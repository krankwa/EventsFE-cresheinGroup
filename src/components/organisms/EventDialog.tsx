import { useState, useCallback, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MODAL_STYLES } from "../../features/admin/constants";

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
import {
  CalendarDays,
  Users,
  Upload,
  MapPin,
  Loader2,
  Search,
  Trash2,
  PlusCircle,
  Tag,
} from "lucide-react";
import type {
  EventResponse,
  EventCreateDTO,
  EventUpdateDTO,
  TicketTierCreateRequest,
  TicketTierUpdateRequest,
  TierTypeResponse,
} from "../../interface/Event.interface";
import { format } from "date-fns";
import { uploadEventImage } from "../../services/uploadService";
import { toast } from "react-hot-toast";
import { ticketTiersService } from "../../services/ticketTiersService";

// Leaflet
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ── Fix Vite-bundled Leaflet marker icons ──────────────────────────────────
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ─── Types ─────────────────────────────────────────────────────────────────

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

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EventCreateDTO | EventUpdateDTO) => void;
  event?: EventResponse | null;
  isLoading?: boolean;
}

// ─── Default map centre (Manila) ────────────────────────────────────────────
const DEFAULT_CENTRE: LatLng = { lat: 14.5995, lng: 120.9842 };

// ─── Map helpers ────────────────────────────────────────────────────────────

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (latlng: LatLng) => void;
}) {
  useMapEvents({
    click(e) {
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

// ─── Geocode helpers ────────────────────────────────────────────────────────

async function searchPlaces(query: string): Promise<NominatimResult[]> {
  if (!query.trim() || query.trim().length < 3) return [];
  try {
    const url =
      `https://nominatim.openstreetmap.org/search` +
      `?format=jsonv2&limit=10&addressdetails=1&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: { "Accept-Language": "en" },
    });
    return (await res.json()) as NominatimResult[];
  } catch {
    return [];
  }
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      { headers: { "Accept-Language": "en" } },
    );
    const data = await res.json();
    return data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

// ─── Main component ─────────────────────────────────────────────────────────

export function EventDialog({
  isOpen,
  onClose,
  onSave,
  event,
  isLoading,
}: EventDialogProps) {
  // ── Tier Types State ───────────────────────────────────────────────────
  const [tierTypes, setTierTypes] = useState<TierTypeResponse[]>([]);

  // ── Form state ─────────────────────────────────────────────────────────
  const [formData, setFormData] = useState<Omit<EventCreateDTO, 'tiers'> & { tiers: (Partial<TicketTierUpdateRequest> & TicketTierCreateRequest)[] }>(
    event
      ? {
          title: event.title,
          date: event.date
            ? event.date.split("T")[0] || format(new Date(), "yyyy-MM-dd")
            : format(new Date(), "yyyy-MM-dd"),
          venue: event.venue || "",
          venueAddress: event.venueAddress || "",
          capacity: event.capacity,
          ticketsSold: event.ticketsSold,
          maxTicketsPerPerson: event.maxTicketsPerPerson || 5,
          coverImageUrl: event.coverImageUrl || "",
          tiers:
            event.tiers && event.tiers.length > 0
              ? event.tiers.map((t) => ({
                  id: t.id,
                  name: t.name,
                  price: t.price,
                  capacity: t.capacity,
                  ticketsSold: t.ticketsSold,
                }))
              : [
                  {
                    name: "Regular",
                    price: 0,
                    capacity: event.capacity,
                  },
                ],
        }
      : {
          title: "",
          date: format(new Date(), "yyyy-MM-dd"),
          venue: "",
          venueAddress: "",
          capacity: 100,
          maxTicketsPerPerson: 5,
          coverImageUrl: "",
          tiers: [{ name: "Regular", price: 0, capacity: 100 }],
        },
  );

  // ── Map / geocoding state ───────────────────────────────────────────────
  const [markerPos, setMarkerPos] = useState<LatLng | null>(null);
  const [flyTarget, setFlyTarget] = useState<LatLng | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // ── Venue search autocomplete state ────────────────────────────────────
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const venueWrapperRef = useRef<HTMLDivElement>(null);

  // ── Image upload state ─────────────────────────────────────────────────
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    event?.coverImageUrl || null,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track which tier name is currently being edited
  const [editingTierIndex, setEditingTierIndex] = useState<number | null>(null);



  // Fetch Tier Types
  useEffect(() => {
    if (isOpen && event?.id) {
      ticketTiersService
        .getTiersByEventId(event.id)
        .then(setTierTypes)
        .catch((err) => console.error("Failed to load ticket tiers", err));
    }
  }, [isOpen, event?.id]);

  // ── Tier Management ────────────────────────────────────────────────────
  const addTier = () => {
    setFormData((prev) => ({
      ...prev,
      tiers: [...prev.tiers, { name: "", price: 0, capacity: 0 }],
    }));
  };

  const removeTier = (index: number) => {
    if (formData.tiers.length <= 1) {
      toast.error("At least one ticket tier is required.");
      return;
    }
    const newTiers = [...formData.tiers];
    newTiers.splice(index, 1);
    setFormData((prev) => ({ ...prev, tiers: newTiers }));
  };

  const updateTier = (index: number, updates: Partial<TicketTierUpdateRequest>) => {
    const newTiers = [...formData.tiers];
    newTiers[index] = { ...newTiers[index], ...updates } as typeof formData.tiers[number];
    setFormData((prev) => ({ ...prev, tiers: newTiers }));
  };

  // ── Venue search autocomplete logic ────────────────────────────────────
  const handleVenueSearchChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      venueAddress: value,
    }));
    setShowDropdown(true);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (value.trim().length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeout.current = setTimeout(async () => {
      const results = await searchPlaces(value);
      const establishmentClasses = [
        "amenity",
        "tourism",
        "shop",
        "office",
        "craft",
        "leisure",
        "historic",
      ];
      const sortedResults = [...results].sort((a, b) => {
        const aIsEst = establishmentClasses.includes(a.class);
        const bIsEst = establishmentClasses.includes(b.class);
        if (aIsEst && !bIsEst) return -1;
        if (!aIsEst && bIsEst) return 1;
        return 0;
      });
      setSuggestions(sortedResults);
      setIsSearching(false);
      setShowDropdown(sortedResults.length > 0);
    }, 500);
  };

  const handleSelectSuggestion = (result: NominatimResult) => {
    const pos: LatLng = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
    };

    // Extract establishment name if possible
    const shortName =
      result.address?.amenity ||
      result.address?.tourism ||
      result.address?.shop ||
      result.address?.office ||
      result.address?.historic ||
      result.display_name.split(",")[0];

    setFormData((prev) => ({
      ...prev,
      venue: shortName || prev.venue || "",
      venueAddress: result.display_name,
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
    const address = await reverseGeocode(latlng.lat, latlng.lng);

    setFormData((prev) => ({
      ...prev,
      venue: address.split(",")[0] || prev.venue || "",
      venueAddress: address,
    }));
    setSuggestions([]);
    setShowDropdown(false);
    setIsGeocoding(false);
  }, []);

  // ── Image handling ──────────────────────────────────────────────────────
  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 25 * 1024 * 1024) {
      toast.error("Image must be smaller than 25 MB.");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect],
  );

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, coverImageUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isUploading || isSearching || isGeocoding) return;

    const totalTierCapacity = formData.tiers.reduce(
      (acc, t) => acc + t.capacity,
      0,
    );
    if (totalTierCapacity !== formData.capacity) {
      toast.error(
        `Sum of tier capacities (${totalTierCapacity}) must equal total capacity (${formData.capacity}).`,
      );
      return;
    }

    let finalImageUrl = formData.coverImageUrl;
    if (imageFile) {
      setIsUploading(true);
      try {
        finalImageUrl = await uploadEventImage(imageFile);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Image upload failed.";
        toast.error(msg);
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    if (event) {
      // For Update
      const sanitizedTiers: TicketTierUpdateRequest[] = formData.tiers.map((t) => {
        const tier: TicketTierUpdateRequest = {
          id: t.id || 0,
          name: t.name,
          price: t.price,
          capacity: t.capacity,
        };
        const ts = (t as { ticketsSold?: number }).ticketsSold;
        if (typeof ts === "number") {
          tier.ticketsSold = ts;
        }
        return tier;
      });

      onSave({
        ...formData,
        coverImageUrl: finalImageUrl || undefined,
        tiers: sanitizedTiers,
      } as EventUpdateDTO);
    } else {
      // For Create
      const sanitizedTiers: TicketTierCreateRequest[] = formData.tiers.map((t) => ({
        name: t.name,
        price: t.price,
        capacity: t.capacity,
      }));

      onSave({
        ...formData,
        coverImageUrl: finalImageUrl || null,
        tiers: sanitizedTiers,
      } as EventCreateDTO);
    }
  };

  const isBusy = isLoading || isUploading;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        key={isOpen ? `open-${event?.id ?? "new"}` : "closed"}
        className={cn(
          "sm:max-w-[800px] max-h-[90dvh] overflow-y-auto",
          MODAL_STYLES,
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {event ? "Modify Event" : "Create Masterwork Event"}
          </DialogTitle>
          <DialogDescription className="text-base">
            Configure the identity and economics of your event experience.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-sm font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Event Identity
                  </Label>
                  <Input
                    id="title"
                    className="text-lg font-semibold h-12 border-2 hover:border-primary/50 focus:border-primary transition-all shadow-sm"
                    placeholder="e.g. Neon Nights Expo"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="date"
                    className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wider"
                  >
                    <CalendarDays className="w-3.5 h-3.5" />
                    Schedule
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    className="h-11 border-2"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="capacity"
                    className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wider"
                  >
                    <Users className="w-3.5 h-3.5" />
                    Capacity
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    className="h-11 border-2"
                    min={1}
                    value={formData.capacity || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capacity: parseInt(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="maxTicketsPerPerson"
                  className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wider"
                >
                  <Tag className="w-3.5 h-3.5" />
                  Booking Limit (Per Person)
                </Label>
                <Input
                  id="maxTicketsPerPerson"
                  type="number"
                  className="h-11 border-2"
                  min={1}
                  max={100}
                  value={formData.maxTicketsPerPerson || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxTicketsPerPerson: parseInt(e.target.value) || 1,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wider">
                    <Tag className="w-3.5 h-3.5" />
                    Ticket Tiers
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTier}
                    className="h-8 gap-1.5 hover:bg-primary/5 text-primary border-primary/20"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Add Tier
                  </Button>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {formData.tiers.map((tier, idx) => (
                    <div
                      key={`tier-${idx}-${tier.name}`}
                      className="p-3 rounded-xl bg-muted/40 border-2 border-transparent hover:border-primary/10 transition-all flex items-center gap-3 animate-in fade-in slide-in-from-top-1"
                    >
                      <div className="flex-1 space-y-2">
                        {editingTierIndex === idx ? (
                          <Input
                            autoFocus
                            placeholder="Tier Name (e.g. Regular, VIP)"
                            className="h-10 border-2 bg-background font-bold px-3 focus-visible:ring-primary shadow-sm rounded-lg"
                            value={tier.name}
                            onChange={(e) =>
                              updateTier(idx, { name: e.target.value })
                            }
                            onBlur={() => setEditingTierIndex(null)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                setEditingTierIndex(null);
                              }
                            }}
                            list="tier-types-list"
                            required
                          />
                        ) : (
                          <div
                            className="flex items-center justify-between group cursor-pointer"
                            onClick={() => setEditingTierIndex(idx)}
                          >
                            <span className="text-sm font-bold truncate">
                              {tier.name || (
                                <span className="text-muted-foreground italic font-normal">
                                  Unnamed Tier (Click to edit)
                                </span>
                              )}
                            </span>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-background/60 border shadow-sm">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">
                              ₱
                            </span>
                            <input
                              type="number"
                              className="w-full bg-transparent border-none text-xs font-bold focus:outline-none"
                              value={tier.price}
                              onChange={(e) =>
                                updateTier(idx, {
                                  price: parseFloat(e.target.value) || 0,
                                })
                              }
                              required
                            />
                          </div>
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-background/60 border shadow-sm">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">
                              Qty
                            </span>
                            <input
                              type="number"
                              className="w-full bg-transparent border-none text-xs font-bold focus:outline-none"
                              value={tier.capacity}
                              onChange={(e) =>
                                updateTier(idx, {
                                  capacity: parseInt(e.target.value) || 0,
                                })
                              }
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => removeTier(idx)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="venue"
                  className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wider"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Venue Name
                </Label>
                <Input
                  id="venue"
                  className="h-11 border-2"
                  placeholder="e.g. Grand Ballroom, SMX Center"
                  value={formData.venue}
                  onChange={(e) =>
                    setFormData({ ...formData, venue: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  Location (Venue Address)
                </Label>
                <div className="relative" ref={venueWrapperRef}>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-9 border-2 h-11 focus-visible:ring-primary/20 transition-shadow"
                      placeholder="Search for a location or address..."
                      value={formData.venueAddress}
                      onChange={(e) => handleVenueSearchChange(e.target.value)}
                      onFocus={() => setShowDropdown(suggestions.length > 0)}
                    />
                    {(isSearching || isGeocoding) && (
                      <div className="absolute right-3 top-3.5 flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground font-medium animate-pulse">
                          {isSearching ? "Searching..." : "Pinning..."}
                        </span>
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      </div>
                    )}
                  </div>

                  {showDropdown && suggestions.length > 0 && (
                    <div className="absolute z-[1000] left-0 right-0 mt-1 bg-background border-2 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-2 bg-muted/30 border-b text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-between">
                        <span>Top Results</span>
                        <span className="text-primary/40 italic">
                          OpenStreetMap
                        </span>
                      </div>
                      <ul className="divide-y divide-border/50 max-h-60 overflow-y-auto custom-scrollbar">
                        {suggestions.map((s) => (
                          <li
                            key={s.place_id}
                            className="px-4 py-3 hover:bg-primary/5 cursor-pointer text-sm flex gap-3 items-start transition-colors group"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSelectSuggestion(s);
                            }}
                          >
                            <div className="mt-0.5 p-1 rounded-md bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col gap-0.5 min-w-0">
                              <span className="font-semibold text-foreground line-clamp-1">
                                {s.display_name.split(",")[0]}
                              </span>
                              <span className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                {s.display_name}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="h-[210px] rounded-2xl overflow-hidden border-2 shadow-inner group">
                    <MapContainer
                      center={[DEFAULT_CENTRE.lat, DEFAULT_CENTRE.lng]}
                      zoom={11}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <MapClickHandler onMapClick={handleMapClick} />
                      <MapFlyTo target={flyTarget} />
                      {markerPos && (
                        <Marker position={[markerPos.lat, markerPos.lng]} />
                      )}
                    </MapContainer>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Event Aesthetics
                </Label>
                {imagePreview ? (
                  <div className="relative aspect-video rounded-2xl overflow-hidden border-2 shadow-lg group">
                    <img
                      src={imagePreview}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleRemoveImage}
                        className="shadow-lg"
                      >
                        Remove Visual
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${isDragging ? "border-primary bg-primary/5" : "hover:bg-muted/10 border-muted"}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                  >
                    <div className="p-3 bg-muted rounded-full">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-xs font-bold text-muted-foreground">
                      Drop Image or Click to Browse
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 gap-3">
            <Button
              type="button"
              variant="ghost"
              className="h-12 px-8 font-bold"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-12 px-12 font-bold bg-blue-950 min-w-[180px] shadow-lg shadow-primary/20"
              disabled={isBusy}
            >
              {isBusy ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : event ? (
                "Update"
              ) : (
                "Broadcast Event"
              )}
            </Button>
          </DialogFooter>
        </form>

        <datalist id="tier-types-list">
          {tierTypes.map((t) => (
            <option key={t.id} value={t.name} />
          ))}
        </datalist>
      </DialogContent>
    </Dialog>
  );
}
