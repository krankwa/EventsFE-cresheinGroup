import { useEffect, useState } from "react";
import { Search, MapPin, Plus } from "lucide-react";
import { venueService } from "../../services/venueService";
import type {
  VenueResponse,
  VenueUpdateDTO,
} from "../../interface/Venue.interface";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { VenuesTable } from "../../components/admin/VenuesTable";
import { VenueEditDialog } from "../../components/admin/VenueEditDialog";
import { toast } from "react-hot-toast";
import { Button } from "../../components/ui/button";

export function VenuesManagement() {
  const [venues, setVenues] = useState<VenueResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<VenueResponse | null>(
    null,
  );

  async function loadVenues() {
    setIsLoading(true);
    try {
      const data = await venueService.getAll();
      setVenues(data);
    } catch (error) {
      console.error("Failed to load venues", error);
      toast.error("Failed to fetch venues from the server.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadVenues();
  }, []);

  const filteredVenues = venues.filter((venue) => {
    const query = searchQuery.toLowerCase();
    return (
      venue.name.toLowerCase().includes(query) ||
      venue.address.toLowerCase().includes(query)
    );
  });

  const handleEdit = (venue: VenueResponse) => {
    setSelectedVenue(venue);
    setIsEditDialogOpen(true);
  };

  const handleAddVenue = () => {
    setSelectedVenue(null);
    setIsEditDialogOpen(true);
  };

  const handleSave = async (data: VenueUpdateDTO) => {
    setIsSaving(true);
    try {
      if (selectedVenue) {
        await venueService.update(selectedVenue.id, data);
        toast.success("Venue updated successfully!");
      } else {
        await venueService.create(data);
        toast.success("New venue registered successfully!");
      }
      setIsEditDialogOpen(false);
      loadVenues();
    } catch (error) {
      console.error("Failed to save venue", error);
      toast.error(
        selectedVenue
          ? "Failed to update venue details."
          : "Failed to register new venue.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Venue Configuration
          </h1>
          <p className="text-muted-foreground">
            Manage your physical locations and geolocation settings.
          </p>
        </div>
        <Button
          onClick={handleAddVenue}
          className="gap-2 shadow-lg shadow-primary/20 h-11 px-6 rounded-xl"
        >
          <Plus className="w-4 h-4" />
          Add Venue
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-6">
          <div className="space-y-1">
            <CardTitle>Global Venues</CardTitle>
            <CardDescription>
              Displaying {venues.length} locations registered in the ecosystem.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search by name or address..."
                className="pl-10 h-11 w-full rounded-xl border-2 border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
              <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
              <p className="text-sm font-medium animate-pulse">
                Synchronizing venue data...
              </p>
            </div>
          ) : venues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
              <MapPin className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">
                No venues found in the system.
              </p>
            </div>
          ) : (
            <VenuesTable venues={filteredVenues} onEdit={handleEdit} />
          )}
        </CardContent>
      </Card>

      <VenueEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSave}
        venue={selectedVenue}
        isLoading={isSaving}
      />
    </div>
  );
}
