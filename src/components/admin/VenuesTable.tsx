import { memo } from "react";
import { MapPin, Edit, ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import type { VenueResponse } from "../../interface/Venue.interface";

interface VenuesTableProps {
  venues: VenueResponse[];
  onEdit: (venue: VenueResponse) => void;
}

export const VenuesTable = memo(function VenuesTable({
  venues,
  onEdit,
}: VenuesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Venue Name</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Coordinates</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {venues.map((venue) => (
          <TableRow key={venue.id} className="group transition-colors hover:bg-muted/50">
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <span className="font-semibold text-foreground">{venue.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <p className="text-sm text-muted-foreground line-clamp-1 max-w-md">
                {venue.address}
              </p>
            </TableCell>
            <TableCell>
              <div className="flex flex-col text-[10px] font-mono text-muted-foreground">
                <span>LAT: {venue.latitude.toFixed(6)}</span>
                <span>LNG: {venue.longitude.toFixed(6)}</span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-2"
                  onClick={() => onEdit(venue)}
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit Details
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground"
                  title="View on Google Maps"
                  onClick={() => window.open(`https://www.google.com/maps?q=${venue.latitude},${venue.longitude}`, "_blank")}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});
