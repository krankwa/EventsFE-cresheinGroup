import { useEffect, useState, useCallback } from "react";
import { isPast } from "date-fns";
import {
  Ticket,
  Search,
  RefreshCcw,
} from "lucide-react";
import { ticketsService } from "../../services/ticketsService";
import type { TicketResponse } from "../../interface/Ticket.interface";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { toast } from "react-hot-toast";
import { PaginationWrapper } from "@/components/organisms/PaginationWrapper";
import { usePagination } from "@/utils/pagination/usePagination";
import { TableEmptyState } from "@/components/organisms/TableEmptyState";

// Decoupled Components
import { TicketStats } from "./components/TicketStats";
import { TicketTable } from "./components/TicketTable";

// Status helpers
function getStatus(t: TicketResponse): "redeemed" | "past" | "upcoming" {
  if (t.isRedeemed) return "redeemed";
  if (isPast(new Date(t.eventDate))) return "past";
  return "upcoming";
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

      <TicketStats
        total={stats.total}
        upcoming={stats.upcoming}
        redeemed={stats.redeemed}
        past={stats.past}
      />

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
              <TicketTable
                tickets={tickets}
                sortBy={sortBy}
                isDescending={isDescending}
                onSort={handleSort}
                onScan={handleScan}
                scanningId={scanningId}
                getStatus={getStatus}
              />
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
