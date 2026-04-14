import { useState, useCallback, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Loader2, Search, MapPin } from "lucide-react";
import type { VenueResponse, VenueUpdateDTO } from "../../interface/Venue.interface";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import type { LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icons
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});



interface LatLng {
  lat: number;
  lng: number;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  class: string;
  type: string;
  address?: Record<string, string>;
}

interface VenueEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: VenueUpdateDTO) => void;
  venue?: VenueResponse | null;
  isLoading?: boolean;
}

const DEFAULT_CENTRE: LatLng = { lat: 14.5995, lng: 120.9842 };

function MapClickHandler({ onMapClick }: { onMapClick: (latlng: LatLng) => void }) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function MapFlyTo({ target }: { target: LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], 15, { duration: 1 });
    }
  }, [target, map]);
  return null;
}

async function searchPlaces(query: string): Promise<NominatimResult[]> {
  if (!query.trim() || query.trim().length < 3) return [];
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=10&addressdetails=1&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: { "Accept-Language": "en" } });
    return (await res.json()) as NominatimResult[];
  } catch {
    return [];
  }
}

async function reverseGeocode(lat: number, lng: number): Promise<{ 
  display_name: string; 
  name?: string | undefined; 
  address?: Record<string, string> | undefined;
}> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = (await res.json()) as { display_name: string; address?: Record<string, string> };
    
    const name = data.address?.amenity || 
                 data.address?.tourism || 
                 data.address?.building || 
                 data.address?.office || 
                 data.address?.shop ||
                 data.display_name.split(",")[0];

    return { 
      display_name: data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      name: name,
      address: data.address
    };
  } catch {
    return { display_name: `${lat.toFixed(5)}, ${lng.toFixed(5)}` };
  }
}

interface VenueFormProps {
  venue?: VenueResponse | null | undefined;
  onClose: () => void;
  onSave: (data: VenueUpdateDTO) => void;
  isLoading?: boolean | undefined;
}

function VenueEditForm({
  venue,
  onClose,
  onSave,
  isLoading,
}: VenueFormProps) {
  const [formData, setFormData] = useState<VenueUpdateDTO>(() => ({
    name: venue?.name ?? "",
    address: venue?.address ?? "",
    latitude: venue?.latitude ?? 0,
    longitude: venue?.longitude ?? 0,
    placeId: venue?.placeId ?? "",
    city: venue?.city ?? "",
    region: venue?.region ?? "",
    country: venue?.country ?? "",
    postCode: venue?.postCode ?? "",
    streetName: venue?.streetName ?? "",
    houseNumber: venue?.houseNumber ?? "",
  }));

  const initialPos = venue ? { lat: venue.latitude, lng: venue.longitude } : null;
  const [markerPos, setMarkerPos] = useState<LatLng | null>(initialPos);
  const [flyTarget, setFlyTarget] = useState<LatLng | null>(initialPos);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (val: string) => {
    setFormData((prev) => ({ ...prev, address: val }));
    setShowDropdown(true);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (val.trim().length < 3) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeout.current = setTimeout(async () => {
      const results = await searchPlaces(val);
      setSuggestions(results);
      setIsSearching(false);
    }, 500);
  };

  const handleSelectSuggestion = (result: NominatimResult) => {
    const pos = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
    
    const establishment = result.address?.amenity || 
                          result.address?.tourism || 
                          result.address?.building || 
                          result.address?.office || 
                          result.address?.shop ||
                          result.display_name.split(",")[0] ||
                          "";

    // Separate Name from Address
    let cleanAddress = result.display_name;
    if (establishment && cleanAddress.startsWith(establishment)) {
      cleanAddress = cleanAddress.slice(establishment.length).replace(/^[, ]+/, "");
    }

    setFormData((prev) => ({
      ...prev,
      name: establishment || prev.name || result.display_name.split(",")[0] || "",
      address: cleanAddress,
      latitude: pos.lat,
      longitude: pos.lng,
      placeId: result.place_id.toString(),
      city: result.address?.city || result.address?.town || result.address?.village || "",
      region: result.address?.state || result.address?.region || "",
      country: result.address?.country || "",
      postCode: result.address?.postcode || "",
      streetName: result.address?.road || "",
      houseNumber: result.address?.house_number || "",
    }));
    setMarkerPos(pos);
    setFlyTarget(pos);
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleMapClick = useCallback(async (latlng: LatLng) => {
    setMarkerPos(latlng);
    setFlyTarget(latlng);
    setIsGeocoding(true);
    const result = await reverseGeocode(latlng.lat, latlng.lng);
    
    // Separate Name from Address
    let cleanAddress = result.display_name;
    if (result.name && cleanAddress.startsWith(result.name)) {
      cleanAddress = cleanAddress.slice(result.name.length).replace(/^[, ]+/, "");
    }

    setFormData((prev) => ({
      ...prev,
      name: result.name || prev.name,
      address: cleanAddress,
      latitude: latlng.lat,
      longitude: latlng.lng,
      city: result.address?.city || result.address?.town || result.address?.village || "",
      region: result.address?.state || result.address?.region || "",
      country: result.address?.country || "",
      postCode: result.address?.postcode || "",
      streetName: result.address?.road || "",
      houseNumber: result.address?.house_number || "",
    }));
    setShowDropdown(false);
    setIsGeocoding(false);
  }, []);


  const savingRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingRef.current || isLoading) return;

    try {
      savingRef.current = true;
      await onSave(formData);
    } catch (error) {
      console.error("Save failed:", error);
      savingRef.current = false;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="space-y-4">
        {/* Consolidated Name & Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Venue Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Grand Ballroom"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Search Location</Label>
            <div className="relative" ref={dropdownRef}>
              <div className="relative">
                <Input
                  value={formData.address}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowDropdown(true);
                  }}
                  placeholder="Street, City, or Point of Interest..."
                  className="pr-10"
                />
                <div className="absolute right-3 top-2.5">
                  {isSearching || isGeocoding ? (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  ) : (
                    <Search className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>
              
              {showDropdown && suggestions.length > 0 && (
                <ul className="absolute z-[1001] left-0 right-0 mt-1 bg-popover border-2 rounded-xl shadow-xl divide-y max-h-48 overflow-y-auto">
                  {suggestions.map((s) => (
                    <li
                      key={s.place_id}
                      className="px-4 py-2 hover:bg-muted cursor-pointer text-sm flex gap-2 items-start"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectSuggestion(s);
                      }}
                    >
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary/60" />
                      <span className="line-clamp-2">{s.display_name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Structured Info Preview (ReadOnly) */}
        {(formData.city || formData.country) && (
          <div className="p-3 rounded-lg bg-muted/30 border text-[11px] grid grid-cols-3 gap-2">
            <div>
              <span className="text-muted-foreground block uppercase font-bold tracking-wider mb-0.5">City</span>
              <span className="truncate">{formData.city || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block uppercase font-bold tracking-wider mb-0.5">Region</span>
              <span className="truncate">{formData.region || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block uppercase font-bold tracking-wider mb-0.5">Country</span>
              <span className="truncate">{formData.country || "—"}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Latitude</Label>
            <Input value={formData.latitude.toFixed(6)} readOnly className="bg-muted/50" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Longitude</Label>
            <Input value={formData.longitude.toFixed(6)} readOnly className="bg-muted/50" />
          </div>
        </div>

        <div className="h-64 rounded-xl overflow-hidden border-2 shadow-inner">
          <MapContainer
            center={[formData.latitude || DEFAULT_CENTRE.lat, formData.longitude || DEFAULT_CENTRE.lng]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapClickHandler onMapClick={handleMapClick} />
            <MapFlyTo target={flyTarget} />
            {markerPos && <Marker position={[markerPos.lat, markerPos.lng]} />}
          </MapContainer>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Tip: Click anywhere on the map to set the exact coordinates.
        </p>
      </div>

      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : venue ? "Save Changes" : "Create Venue"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function VenueEditDialog({
  isOpen,
  onClose,
  onSave,
  venue,
  isLoading,
}: VenueEditDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl bg-background/95 backdrop-blur-md border-2">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {venue ? "Edit Venue" : "Register New Venue"}
          </DialogTitle>
          <DialogDescription>
            {venue 
              ? "Update the venue's name and physical location details."
              : "Define the name and physical location for your new venue."
            }
          </DialogDescription>
        </DialogHeader>

        {isOpen && (
          <VenueEditForm
            key={venue?.id ?? "new"}
            venue={venue}
            onClose={onClose}
            onSave={onSave}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
