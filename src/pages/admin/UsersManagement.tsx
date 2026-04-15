import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Search,
  RefreshCcw,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Info,
  UserCog,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { userService } from "../../services/userService";
import type { UserResponse, UserRole } from "../../interface/Auth.interface";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { UsersTable } from "../../components/organisms/UsersTable";
import { toast } from "react-hot-toast";
import { PaginationWrapper } from "@/components/organisms/PaginationWrapper";
import { usePagination } from "@/utils/pagination/usePagination";

export function UsersManagement() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUserForRole, setSelectedUserForRole] =
    useState<UserResponse | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Client-side pagination hook
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
  } = usePagination({ initialPageSize: 10 });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data || []);
    } catch (error) {
      console.error("Failed to load users", error);
      toast.error("Failed to load the user list.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filteredUsers = useMemo(() => {
    const searchLower = debouncedSearch.toLowerCase();
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(searchLower) ||
        u.email?.toLowerCase().includes(searchLower),
    );
  }, [users, debouncedSearch]);

  useEffect(() => {
    setTotalItems(filteredUsers.length);
  }, [filteredUsers, setTotalItems]);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, page, pageSize]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleRefresh = () => {
    loadUsers();
  };

  const handleEdit = async (
    user: UserResponse,
    data: { name: string; email: string },
  ): Promise<void> => {
    try {
      await userService.update(user.userId, {
        name: data.name,
        email: data.email,
      });
      toast.success(`${data.name}'s details have been updated.`);
      loadUsers();
    } catch (error) {
      toast.error("Failed to update user details.");
      throw error;
    }
  };

  const handleUpdateRole = async (role: UserRole) => {
    if (!selectedUserForRole) return;

    setIsUpdating(true);
    try {
      await userService.update(selectedUserForRole.userId, { role });
      toast.success(`${selectedUserForRole.name} is now a ${role}.`);
      setSelectedUserForRole(null);
      loadUsers();
    } catch (error) {
      console.error("Failed to update user role", error);
      toast.error("Failed to update user role.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and administrative permissions.
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 focus-visible:ring-offset-2"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCcw
            className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-6">
          <div className="space-y-1">
            <CardTitle>User Directory</CardTitle>
            <CardDescription>
              Total of {totalItems} registered accounts found.
            </CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground animate-pulse">
              Loading users...
            </div>
          ) : (
            <>
              <UsersTable
                users={paginatedUsers}
                onPromote={setSelectedUserForRole}
                isLoading={isLoading}
                onEdit={handleEdit}
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

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border-2 border-dashed p-4 flex items-center gap-4 bg-muted/20">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold">Security Note</h3>
            <p className="text-xs text-muted-foreground">
              Promoted users will have full access to database records, events,
              and ticket management.
            </p>
          </div>
        </div>
      </div>

      {/* Role Change Dialog */}
      <Dialog
        open={!!selectedUserForRole}
        onOpenChange={(open) => !open && setSelectedUserForRole(null)}
      >
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-950 border-2 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
              <UserCog className="w-6 h-6 text-primary" />
              Edit User Role
            </DialogTitle>
            <DialogDescription>
              Select the administrative level for{" "}
              <span className="font-bold text-foreground">
                {selectedUserForRole?.name}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <button
              onClick={() => handleUpdateRole("Admin")}
              disabled={isUpdating}
              className="flex items-start gap-4 p-4 rounded-xl border-2 border-transparent hover:border-rose-500/50 hover:bg-rose-50/50 transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-bold text-rose-700">Administrator</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Full access to all system data, event management, and user
                  permissions.
                </p>
              </div>
            </button>

            <button
              onClick={() => handleUpdateRole("Staff")}
              disabled={isUpdating}
              className="flex items-start gap-4 p-4 rounded-xl border-2 border-transparent hover:border-blue-500/50 hover:bg-blue-50/50 transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-bold text-blue-700">Staff</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Can manage events and redeem tickets, but cannot manage other
                  users.
                </p>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground italic">
            <Info className="w-4 h-4 shrink-0" />
            Changes take effect immediately upon selection.
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
