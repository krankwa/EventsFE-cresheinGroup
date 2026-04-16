import { format } from "date-fns";
import {
  ChevronUp,
  ChevronDown,
  Loader2,
  ScanLine,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { cn } from "@/lib/utils";
import type { TicketResponse } from "../../../interface/Ticket.interface";

// Status helpers
const statusConfig = {
  upcoming: {
    label: "Upcoming",
    class: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  redeemed: {
    label: "Redeemed",
    class: "bg-green-500/10 text-green-600 border-green-500/20",
  },
  past: {
    label: "Past",
    class: "bg-muted text-muted-foreground border-muted",
  },
};

const SortIconHelper = ({ 
  field, 
  sortBy, 
  isDescending 
}: { 
  field: string;
  sortBy?: string | undefined;
  isDescending?: boolean | undefined;
}) => {
  if (sortBy !== field) return null;
  return isDescending ? (
    <ChevronDown className="ml-1 w-4 h-4 inline-block" />
  ) : (
    <ChevronUp className="ml-1 w-4 h-4 inline-block" />
  );
};

const HeaderCellHelper = ({
  label,
  field,
  className,
  sortBy,
  isDescending,
  onSort,
}: {
  label: string;
  field?: string;
  className?: string;
  sortBy?: string | undefined;
  isDescending?: boolean | undefined;
  onSort?: (field: string) => void;
}) => (
  <TableHead
    className={cn(
      field
        ? "cursor-pointer hover:text-primary transition-colors select-none"
        : "",
      className,
    )}
    onClick={() => field && onSort?.(field)}
  >
    <div className="flex items-center">
      {label}
      {field && <SortIconHelper field={field} sortBy={sortBy} isDescending={isDescending} />}
    </div>
  </TableHead>
);

interface TicketTableProps {
  tickets: TicketResponse[];
  sortBy: string | undefined;
  isDescending: boolean | undefined;
  onSort: (field: string) => void;
  onScan: (id: number) => void;
  scanningId: number | null;
  getStatus: (t: TicketResponse) => "redeemed" | "past" | "upcoming";
}

export function TicketTable({
  tickets,
  sortBy,
  isDescending,
  onSort,
  onScan,
  scanningId,
  getStatus,
}: TicketTableProps) {
  return (
    <Table>
      <TableHeader className="bg-gray-100">
        <TableRow>
          <HeaderCellHelper label="ID" field="id" sortBy={sortBy} isDescending={isDescending} onSort={onSort} />
          <HeaderCellHelper label="Event" field="event" sortBy={sortBy} isDescending={isDescending} onSort={onSort} />
          <HeaderCellHelper label="Tier" field="tier" sortBy={sortBy} isDescending={isDescending} onSort={onSort} />
          <HeaderCellHelper label="Price" field="price" sortBy={sortBy} isDescending={isDescending} onSort={onSort} />
          <HeaderCellHelper label="Event Date" field="eventdate" sortBy={sortBy} isDescending={isDescending} onSort={onSort} />
          <HeaderCellHelper label="Booked" field="booked" sortBy={sortBy} isDescending={isDescending} onSort={onSort} />
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => {
          const status = getStatus(ticket);
          const { label, class: cls } = statusConfig[status];
          const isScanning = scanningId === ticket.ticketId;

          return (
            <TableRow key={ticket.ticketId}>
              <TableCell className="font-mono text-xs text-muted-foreground">
                #{ticket.ticketId}
              </TableCell>
              <TableCell className="font-medium max-w-[160px] truncate">
                {ticket.eventTitle}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {ticket.tierName ?? "General"}
              </TableCell>
              <TableCell className="text-sm font-semibold text-primary">
                ₱{ticket.price.toLocaleString()}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(ticket.eventDate), "PP")}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(ticket.registrationDate), "PP")}
              </TableCell>
              <TableCell>
                <Badge className={`gap-1 text-[11px] border ${cls}`}>
                  {label}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {status === "upcoming" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 bg-blue-950 hover:text-white text-white transition-colors"
                    disabled={isScanning}
                    onClick={() => onScan(ticket.ticketId)}
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <ScanLine className="w-3.5 h-3.5 " />
                        Redeem
                      </>
                    )}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
