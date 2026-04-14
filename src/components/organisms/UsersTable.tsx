import { useState } from "react";
import {
  ShieldCheck,
  User,
  Mail,
  ShieldAlert,
  Pencil,
  X,
  Check,
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
import type { UserResponse } from "../../interface/Auth.interface";
import { useUser } from "../../features/authentication/useUser";

interface UsersTableProps {
  users: UserResponse[];
  onPromote: (user: UserResponse) => void;
  onEdit: (
    user: UserResponse,
    data: { name: string; email: string },
  ) => Promise<void>;
  isLoading?: boolean;
}

interface EditState {
  userId: number;
  name: string;
  email: string;
}

export function UsersTable({
  users,
  onPromote,
  onEdit,
  isLoading,
}: UsersTableProps) {
  const { user: currentUser } = useUser();
  const [editState, setEditState] = useState<EditState | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleEditClick = (user: UserResponse) => {
    setEditState({ userId: user.userId, name: user.name, email: user.email });
  };

  const handleCancel = () => {
    setEditState(null);
  };

  const handleSave = async (user: UserResponse) => {
    if (!editState) return;
    setIsSaving(true);
    try {
      await onEdit(user, { name: editState.name, email: editState.email });
      setEditState(null);
    } finally {
      setIsSaving(false);
    }
  };

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
        {users.map((user) => {
          const isEditing = editState?.userId === user.userId;

          return (
            <TableRow key={user.userId}>
              {/* Name cell — inline edit */}
              <TableCell>
                {isEditing ? (
                  <input
                    autoFocus
                    value={editState.name}
                    onChange={(e) =>
                      setEditState(
                        (prev) => prev && { ...prev, name: e.target.value },
                      )
                    }
                    className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                ) : (
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
                )}
              </TableCell>

              {/* Email cell — inline edit */}
              <TableCell>
                {isEditing ? (
                  <input
                    type="email"
                    value={editState.email}
                    onChange={(e) =>
                      setEditState(
                        (prev) => prev && { ...prev, email: e.target.value },
                      )
                    }
                    className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                )}
              </TableCell>

              {/* Role */}
              <TableCell>
                <Badge
                  variant={user.role === "Admin" ? "default" : "secondary"}
                  className="gap-1"
                >
                  {user.role === "Admin" ? (
                    <ShieldCheck className="w-3 h-3" />
                  ) : (
                    <User className="w-3 h-3" />
                  )}
                  {user.role}
                </Badge>
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                {isEditing ? (
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCancel}
                      disabled={isSaving}
                      title="Cancel"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button
                      size="sm"
                      className="gap-1"
                      onClick={() => handleSave(user)}
                      disabled={
                        isSaving ||
                        !editState.name.trim() ||
                        !editState.email.trim()
                      }
                    >
                      <Check className="w-4 h-4" />
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-end gap-2">
                    {/* Edit button — available for all users */}
                    {/* Promote or options button */}
                    {user.role !== "Admin" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleEditClick(user)}
                        title="Edit user details"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={user.userId === currentUser?.userId}
                      >
                        {/* <MoreVertical className="w-4 h-4 text-muted-foreground" /> */}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleEditClick(user)}
                      title="Edit user details"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
