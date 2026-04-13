import { useEffect, useState } from "react";
import { Search, RefreshCcw, ShieldAlert } from "lucide-react";
import { userService } from "../../services/userService";
import type { UserResponse } from "../../types/Auth.types";
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

export function UsersManagement() {
	const [users, setUsers] = useState<UserResponse[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const loadUsers = async (showRefresh = false) => {
		if (showRefresh) setIsRefreshing(true);
		try {
			const data = await userService.getAll();
			setUsers(data);
		} catch (error) {
			console.error("Failed to load users", error);
			toast.error("Failed to load the user list.");
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	};

	useEffect(() => {
		loadUsers();
	}, []);

	const filteredUsers = users.filter((user) => {
        const query = searchQuery.toLowerCase();
        return (
            user.name.toLowerCase().includes(query) || 
            user.email.toLowerCase().includes(query)
        );
    });

	const handleEdit = async (user: UserResponse, data: { name: string; email: string }): Promise<void> => {
		try {
			await userService.update(user.userId, { name: data.name, email: data.email });
			toast.success(`${data.name}'s details have been updated.`);
			loadUsers();
		} catch (error) {
			toast.error("Failed to update user details.");
			throw error; // keeps the edit row open so the admin can retry
		}
	};


	const handlePromote = async (user: UserResponse) => {
		const confirmed = window.confirm(
			`Are you sure you want to appoint ${user.name} as an administrator? This grants full management permissions.`,
		);

		if (!confirmed) return;

		try {
			await userService.update(user.userId, { role: "Admin" });
			toast.success(`${user.name} is now an administrator.`);
			loadUsers(); // Refresh list
		} catch (error) {
			console.error("Failed to promote user", error);
			toast.error("Failed to update user role.");
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
					onClick={() => loadUsers(true)}
					disabled={isRefreshing}
				>
					<RefreshCcw
						className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
					/>
					Refresh
				</Button>
			</div>

			<Card>
				<CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-6">
					<div className="space-y-1">
						<CardTitle>User Directory</CardTitle>
						<CardDescription>
							Total of {users.length} registered accounts.
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
					<UsersTable
						users={filteredUsers}
						onPromote={handlePromote}
						isLoading={isLoading}
						onEdit={handleEdit}
					/>
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
		</div>
	);
}
