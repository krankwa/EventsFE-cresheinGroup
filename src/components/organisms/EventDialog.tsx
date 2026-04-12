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
import {
	CalendarDays,
	Users,
	Upload,
	X,
	ImageIcon,
	MapPin,
	Loader2,
	Search,
} from "lucide-react";
import type {
	EventResponse,
	EventCreateDTO,
	EventUpdateDTO,
} from "../../types/Event.types";
import { format } from "date-fns";
import { uploadEventImage } from "../../services/uploadService";
import { toast } from "react-hot-toast";

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

/** Listens to map click events and calls onMapClick with the coordinates. */
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

/**
 * Imperatively pans and zooms the map when `target` changes.
 * Must be mounted *inside* <MapContainer>.
 */
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

/** Forward search — returns up to 5 Nominatim suggestions. */
async function searchPlaces(query: string): Promise<NominatimResult[]> {
	if (!query.trim() || query.trim().length < 3) return [];
	try {
		// Fetch 10 results with addressdetails to distinguish between establishments and addresses
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

/** Reverse geocode coordinates to an address string. */
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
	// ── Form state ─────────────────────────────────────────────────────────
	const [formData, setFormData] = useState<EventCreateDTO>(
		event
			? {
					title: event.title,
					date: event.date.split("T")[0],
					venue: event.venue,
					capacity: event.capacity,
					coverImageUrl: event.coverImageUrl || "",
				}
			: {
					title: "",
					date: format(new Date(), "yyyy-MM-dd"),
					venue: "",
					capacity: 100,
					coverImageUrl: "",
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

	// ── Reset when dialog opens/closes ─────────────────────────────────────
	useEffect(() => {
		setMarkerPos(null);
		setFlyTarget(null);
		setSuggestions([]);
		setShowDropdown(false);
		setIsGeocoding(false);
		setIsSearching(false);
		setImageFile(null);
		setIsDragging(false);
		setIsUploading(false);

		if (event) {
			setFormData({
				title: event.title,
				date: event.date.split("T")[0],
				venue: event.venue,
				capacity: event.capacity,
				coverImageUrl: event.coverImageUrl || "",
			});
			setImagePreview(event.coverImageUrl || null);
		} else {
			setFormData({
				title: "",
				date: format(new Date(), "yyyy-MM-dd"),
				venue: "",
				capacity: 100,
				coverImageUrl: "",
			});
			setImagePreview(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen]);

	// ── Close dropdown on outside click ────────────────────────────────────
	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (
				venueWrapperRef.current &&
				!venueWrapperRef.current.contains(e.target as Node)
			) {
				setShowDropdown(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// ── Venue input change — triggers debounced search ──────────────────────
	const handleVenueChange = (value: string) => {
		setFormData((prev) => ({ ...prev, venue: value }));
		setShowDropdown(true);

		if (searchTimeout.current) clearTimeout(searchTimeout.current);

		if (value.trim().length < 3) {
			setSuggestions([]);
			setIsSearching(false);
			return;
		}

		setIsSearching(true);
		searchTimeout.current = setTimeout(async () => {
			const results = await searchPlaces(value);

			// Prioritize establishments/POIs over generic addresses/roads
			// Nominatim classes usually identifying establishments:
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

	// ── Select a suggestion from the dropdown ──────────────────────────────
	const handleSelectSuggestion = (result: NominatimResult) => {
		const pos: LatLng = {
			lat: parseFloat(result.lat),
			lng: parseFloat(result.lon),
		};
		setFormData((prev) => ({ ...prev, venue: result.display_name }));
		setMarkerPos(pos);
		setFlyTarget(pos);
		setSuggestions([]);
		setShowDropdown(false);
	};

	// ── Map click — reverse geocode ─────────────────────────────────────────
	const handleMapClick = useCallback(async (latlng: LatLng) => {
		setMarkerPos(latlng);
		setFlyTarget(latlng);
		setIsGeocoding(true);
		const address = await reverseGeocode(latlng.lat, latlng.lng);
		setFormData((prev) => ({ ...prev, venue: address }));
		setSuggestions([]);
		setShowDropdown(false);
		setIsGeocoding(false);
	}, []);

	// ── Image handling ──────────────────────────────────────────────────────
	const handleFileSelect = useCallback((file: File) => {
		if (!file.type.startsWith("image/")) return;
		if (file.size > 5 * 1024 * 1024) {
			toast.error("Image must be smaller than 5 MB.");
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

		let finalImageUrl = formData.coverImageUrl;

		if (imageFile) {
			setIsUploading(true);
			try {
				finalImageUrl = await uploadEventImage(imageFile);
			} catch (err) {
				const msg = err instanceof Error ? err.message : "Image upload failed.";
				toast.error(msg);
				console.error("Upload error:", err);
				setIsUploading(false);
				return;
			}
			setIsUploading(false);
		}

		onSave({ ...formData, coverImageUrl: finalImageUrl });
	};

	const isBusy = isLoading || isUploading;

	// ─── Render ─────────────────────────────────────────────────────────────
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[760px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">
						{event ? "Edit Event" : "Create New Event"}
					</DialogTitle>
					<DialogDescription>
						{event
							? "Update the details of your event below."
							: "Fill in the details to schedule a new event."}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-5 py-2">
					{/* ── Event Title ── */}
					<div className="space-y-2">
						<Label htmlFor="title">Event Title</Label>
						<Input
							id="title"
							placeholder="e.g. Summer Tech Conference"
							value={formData.title}
							onChange={(e) =>
								setFormData({ ...formData, title: e.target.value })
							}
							required
						/>
					</div>

					{/* ── Date + Capacity ── */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="date" className="flex items-center gap-2 text-sm">
								<CalendarDays className="w-3 h-3" />
								Date
							</Label>
							<Input
								id="date"
								type="date"
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
								className="flex items-center gap-2 text-sm"
							>
								<Users className="w-3 h-3" />
								Capacity
							</Label>
							<Input
								id="capacity"
								type="number"
								min={1}
								value={formData.capacity || ""}
								onChange={(e) => {
									const val =
										e.target.value === "" ? 0 : parseInt(e.target.value);
									setFormData({ ...formData, capacity: val });
								}}
								required
							/>
						</div>
					</div>

					{/* ── Venue ── */}
					<div className="space-y-2">
						<Label className="flex items-center gap-2">
							<MapPin className="w-3 h-3" />
							Venue
						</Label>

						{/* Search input + autocomplete dropdown */}
						<div className="relative" ref={venueWrapperRef}>
							<div className="relative">
								<Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
								<Input
									id="venue"
									className="pl-9 pr-9"
									placeholder="Type an address or place name…"
									value={formData.venue}
									onChange={(e) => handleVenueChange(e.target.value)}
									onFocus={() => {
										if (suggestions.length > 0) setShowDropdown(true);
									}}
									autoComplete="off"
									required
								/>
								{(isSearching || isGeocoding) && (
									<Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
								)}
							</div>

							{/* Dropdown suggestions */}
							{showDropdown && suggestions.length > 0 && (
								<ul
									className="
                    absolute z-[9999] left-0 right-0 mt-1
                    rounded-md border border-border bg-popover shadow-lg
                    divide-y divide-border overflow-hidden
                    max-h-56 overflow-y-auto
                  "
								>
									{suggestions.map((s) => (
										<li
											key={s.place_id}
											className="
                        flex items-start gap-2 px-3 py-2.5
                        cursor-pointer select-none text-sm
                        hover:bg-accent hover:text-accent-foreground
                        transition-colors
                      "
											onMouseDown={(e) => {
												// Use mousedown so the click fires before onBlur hides the list
												e.preventDefault();
												handleSelectSuggestion(s);
											}}
										>
											{/* Use a different color or icon for establishments */}
											{[
												"amenity",
												"tourism",
												"shop",
												"office",
												"craft",
												"leisure",
												"historic",
											].includes(s.class) ? (
												<MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
											) : (
												<MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-muted-foreground" />
											)}
											<div className="flex flex-col gap-0.5">
												<span className="line-clamp-1 leading-snug font-medium">
													{s.display_name.split(",")[0]}
												</span>
												<span className="line-clamp-1 text-[11px] text-muted-foreground leading-tight">
													{s.display_name.split(",").slice(1).join(",").trim()}
												</span>
											</div>
										</li>
									))}
								</ul>
							)}
						</div>

						{/* Map */}
						<div
							className="rounded-lg overflow-hidden border border-border"
							style={{ height: 270 }}
						>
							<MapContainer
								center={[DEFAULT_CENTRE.lat, DEFAULT_CENTRE.lng]}
								zoom={11}
								style={{ height: "100%", width: "100%" }}
								scrollWheelZoom={true}
							>
								<TileLayer
									attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
									url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
								/>
								<MapClickHandler onMapClick={handleMapClick} />
								<MapFlyTo target={flyTarget} />
								{markerPos && (
									<Marker position={[markerPos.lat, markerPos.lng]} />
								)}
							</MapContainer>
						</div>
						<p className="text-xs text-muted-foreground">
							Search above or click the map to drop a pin and auto-fill the
							address.
						</p>
					</div>

					{/* ── Cover Image ── */}
					<div className="space-y-2">
						<Label className="flex items-center gap-2">
							<ImageIcon className="w-3 h-3" />
							Cover Image
						</Label>

						{imagePreview ? (
							<div className="relative group rounded-lg overflow-hidden border border-border h-44">
								<img
									src={imagePreview}
									alt="Cover preview"
									className="w-full h-full object-cover"
								/>
								<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
									<Button
										type="button"
										variant="destructive"
										size="sm"
										onClick={handleRemoveImage}
										className="gap-1"
									>
										<X className="w-3 h-3" />
										Remove
									</Button>
								</div>
							</div>
						) : (
							<div
								onDragOver={(e) => {
									e.preventDefault();
									setIsDragging(true);
								}}
								onDragLeave={() => setIsDragging(false)}
								onDrop={handleDrop}
								onClick={() => fileInputRef.current?.click()}
								className={`
                  cursor-pointer rounded-lg border-2 border-dashed h-36
                  flex flex-col items-center justify-center gap-2
                  transition-colors duration-200 select-none
                  ${
										isDragging
											? "border-primary bg-primary/10 text-primary"
											: "border-border hover:border-primary/60 hover:bg-primary/5 text-muted-foreground"
									}
                `}
							>
								<Upload className="w-6 h-6" />
								<span className="text-sm font-medium">
									Drop an image here or{" "}
									<span className="underline underline-offset-2">browse</span>
								</span>
								<span className="text-xs">PNG, JPG, WEBP — max 5 MB</span>
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

					{/* ── Footer ── */}
					<DialogFooter className="gap-2 sm:gap-0 pt-2">
						<Button
							type="button"
							variant="ghost"
							onClick={onClose}
							disabled={isBusy}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isBusy} className="min-w-[140px]">
							{isUploading ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Uploading…
								</>
							) : isLoading ? (
								event ? (
									"Updating…"
								) : (
									"Creating…"
								)
							) : event ? (
								"Update Event"
							) : (
								"Create Event"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
