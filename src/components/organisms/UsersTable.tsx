import {
  ShieldCheck,
  User,
  MoreVertical,
  Mail,
  UserCog,
  CheckCircle2
} from "lucide-react";
import { cn } from "../../lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import type { UserResponse } from "../../interface/Auth.interface";
import { useUser } from "../../features/authentication/useUser";

interface UsersTableProps {
  users: UserResponse[];
  onEditRole: (user: UserResponse) => void;
  isLoading?: boolean;
}

export function UsersTable({ users, onEditRole, isLoading }: UsersTableProps) {
  const { user: currentUser } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground animate-pulse">
        Fetching user accounts...
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.userId}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="font-medium">{user.name}</span>
                {user.userId === currentUser?.userId && (
                  <Badge variant="outline" className="text-[10px] py-0">
                    You
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                {user.email}
              </div>
            </TableCell>
            <TableCell>
              <Badge 
                variant={user.role === "Admin" ? "default" : user.role === "Staff" ? "outline" : "secondary"}
                className={cn(
                  "gap-1.5 px-2 py-0.5 font-bold transition-all",
                  user.role === "Admin" && "bg-rose-500 hover:bg-rose-600 border-none shadow-sm shadow-rose-200",
                  user.role === "Staff" && "text-blue-600 border-blue-200 bg-blue-50/50 hover:bg-blue-100/50"
                )}
              >
                {user.role === "Admin" ? (
                  <ShieldCheck className="w-3.5 h-3.5" />
                ) : user.role === "Staff" ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <User className="w-3.5 h-3.5" />
                )}
                {user.role}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {user.role !== "Admin" ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 font-semibold hover:border-primary hover:text-primary transition-all rounded-full px-4"
                  onClick={() => onEditRole(user)}
                >
                  <UserCog className="w-4 h-4" />
                  Edit Role
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={user.userId === currentUser?.userId}
                >
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
