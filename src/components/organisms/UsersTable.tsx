import { 
  ShieldCheck, 
  User, 
  MoreVertical,
  Mail,
  ShieldAlert
} from "lucide-react";
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
import type { UserResponse } from "../../types/Auth.types";
import { useAuth } from "../../hooks/useAuth";

interface UsersTableProps {
  users: UserResponse[];
  onPromote: (user: UserResponse) => void;
  isLoading?: boolean;
}

export function UsersTable({ users, onPromote, isLoading }: UsersTableProps) {
  const { user: currentUser } = useAuth();

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
                  <Badge variant="outline" className="text-[10px] py-0">You</Badge>
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
                variant={user.role === "Admin" ? "default" : "secondary"}
                className="gap-1"
              >
                {user.role === "Admin" ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                {user.role}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {user.role !== "Admin" ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
                  onClick={() => onPromote(user)}
                >
                  <ShieldAlert className="w-4 h-4" />
                  Appoint Admin
                </Button>
              ) : (
                <Button variant="ghost" size="icon" disabled={user.userId === currentUser?.userId}>
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
