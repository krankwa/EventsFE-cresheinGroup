import { useEffect, useState, useCallback } from "react";
import { format, isPast } from "date-fns";
import {
  Ticket,
  Search,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  Clock,
  ScanLine,
  Loader2,
  Users,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { ticketsService } from "../../services/ticketsService";
import type { TicketResponse } from "../../interface/Ticket.interface";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { toast } from "react-hot-toast";
import { PaginationWrapper } from "@/components/organisms/PaginationWrapper";
import { usePagination } from "@/utils/pagination/usePagination";
import { TableEmptyState } from "@/components/organisms/TableEmptyState";

import { cn } from "@/lib/utils";

// Status helpers
function getStatus(t: TicketResponse): "redeemed" | "past" | "upcoming" {
  if (t.isRedeemed) return "redeemed";
  if (isPast(new Date(t.eventDate))) return "past";
  return "upcoming";
}

const statusConfig = {
  upcoming: {
    label: "Upcoming",
    icon: Clock,
    class: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  redeemed: {
    label: "Redeemed",
    icon: CheckCircle2,
    class: "bg-green-500/10 text-green-600 border-green-500/20",
  },
  past: {
    label: "Past",
    icon: XCircle,
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
  className?: string | undefined;
  sortBy?: string | undefined;
  isDescending?: boolean | undefined;
  onSort?: ((field: string) => void) | undefined;
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

// Stat Card Component
function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-5 flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${color}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function TicketManagement() {
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scanningId, setScanningId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "upcoming" | "redeemed" | "past"
  >("all");

  // Pagination hook
  const {
    page,
    pageSize,
    totalPages,
    totalItems,
    setTotalItems,
    goToPage,
    setPageSize,
    searchQuery: debouncedSearch,
    handleSearch,
    sortBy,
    isDescending,
    handleSort,
  } = usePagination({ initialPageSize: 10 });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  const loadTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await ticketsService.getPaginated({
        pageNumber: page,
        pageSize: pageSize,
        searchTerm: debouncedSearch,
        status: filterStatus === "all" ? undefined : filterStatus,
        sortBy: sortBy,
        isDescending: isDescending,
      });
      setTickets(result.items);
      setTotalItems(result.totalCount);
    } catch (error) {
      console.error("Failed to load tickets", error);
      toast.error("Failed to load tickets.");
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, debouncedSearch, filterStatus, sortBy, isDescending, setTotalItems]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleRefresh = () => {
    loadTickets();
  };

  const handleScan = async (id: number) => {
    setScanningId(id);
    try {
      await ticketsService.scan(id);
      toast.success(`Ticket #${id} redeemed successfully.`);
      loadTickets();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to redeem ticket.";
      toast.error(msg);
    } finally {
      setScanningId(null);
    }
  };

  const stats = {
    total: totalItems,
    upcoming: tickets.filter((t) => getStatus(t) === "upcoming").length,
    redeemed: tickets.filter((t) => getStatus(t) === "redeemed").length,
    past: tickets.filter((t) => getStatus(t) === "past").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tickets</h1>
          <p className="text-muted-foreground">
            Monitor and manage all event tickets.
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCcw
            className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Tickets"
          value={stats.total}
          icon={Ticket}
          color="bg-primary/10 text-primary"
        />
        <StatCard
          label="Upcoming"
          value={stats.upcoming}
          icon={Clock}
          color="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          label="Redeemed"
          value={stats.redeemed}
          icon={CheckCircle2}
          color="bg-green-500/10 text-green-600"
        />
        <StatCard
          label="Past (Unredeemed)"
          value={stats.past}
          icon={Users}
          color="bg-muted text-muted-foreground"
        />
      </div>

      {/* Table card */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle>All Tickets</CardTitle>
            <CardDescription>{totalItems} total tickets found</CardDescription>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search event, tier, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {/* Status filter */}
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value as typeof filterStatus);
                goToPage(1);
              }}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">All Statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="redeemed">Redeemed</option>
              <option value="past">Past</option>
            </select>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : tickets.length === 0 ? (
            <TableEmptyState
              icon={Ticket}
              title="No Tickets Found"
              description="Your box office is currently quiet. Tickets will appear here once attendees start booking events."
              actionLabel={searchQuery ? "Clear Search" : ""}
              onAction={searchQuery ? () => setSearchQuery("") : () => {}}
            />
          ) : (
            <>
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <HeaderCellHelper label="ID" field="id" sortBy={sortBy} isDescending={isDescending} onSort={handleSort} />
                    <HeaderCellHelper label="Event" field="event" sortBy={sortBy} isDescending={isDescending} onSort={handleSort} />
                    <TableHead>Tier</TableHead>
                    <HeaderCellHelper label="Price" field="price" sortBy={sortBy} isDescending={isDescending} onSort={handleSort} />
                    <HeaderCellHelper label="Event Date" field="eventdate" sortBy={sortBy} isDescending={isDescending} onSort={handleSort} />
                    <HeaderCellHelper label="Booked" field="booked" sortBy={sortBy} isDescending={isDescending} onSort={handleSort} />
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => {
                    const status = getStatus(ticket);
                    const {
                      label,
                      icon: Icon,
                      class: cls,
                    } = statusConfig[status];
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
                            <Icon className="w-3 h-3" />
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
                              onClick={() => handleScan(ticket.ticketId)}
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
              <PaginationWrapper
                currentPage={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={totalItems}
                onPageChange={goToPage}
                onPageSizeChange={setPageSize}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
