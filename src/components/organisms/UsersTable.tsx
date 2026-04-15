import { useState } from "react";
import {
  ShieldCheck,
  User,
  Mail,
  Pencil,
  X,
  Check,
  Loader2,
  ShieldAlert,
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

import { TableEmptyState } from "./TableEmptyState";

interface UsersTableProps {
  users: UserResponse[];
  onPromote: (user: UserResponse) => Promise<void>; // Changed to Promise
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

interface LoadingState {
  promoting: number | null;
  editing: number | null;
}

export function UsersTable({
  users,
  onPromote,
  onEdit,
  isLoading,
}: UsersTableProps) {
  const { user: currentUser } = useUser();
  const [editState, setEditState] = useState<EditState | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    promoting: null,
    editing: null,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground animate-pulse">
        Fetching user accounts...
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <TableEmptyState
        icon={User}
        title="No Users Registered"
        description="Your professional network is currently empty. Users will appear here once they register or are added."
      />
    );
  }

  const handleEditClick = (user: UserResponse) => {
    setEditState({ userId: user.userId, name: user.name, email: user.email });
  };

  const handleCancel = () => {
    setEditState(null);
  };

  const handleSave = async (user: UserResponse) => {
    if (!editState) return;

    setLoadingState(prev => ({ ...prev, editing: user.userId }));
    try {
      await onEdit(user, { name: editState.name, email: editState.email });
      setEditState(null);
    } finally {
      setLoadingState(prev => ({ ...prev, editing: null }));
    }
  };

  const handlePromote = async (user: UserResponse) => {
    setLoadingState(prev => ({ ...prev, promoting: user.userId }));
    try {
      await onPromote(user);
    } finally {
      setLoadingState(prev => ({ ...prev, promoting: null }));
    }
  };

  const isPromoting = (userId: number) => loadingState.promoting === userId;
  const isEditing = (userId: number) => loadingState.editing === userId;

  return (
    <Table>
      <TableHeader className="bg-gray-100 rounded-t-lg">
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          const isEditingMode = editState?.userId === user.userId;
          const isAdmin = user.role === "Admin";
          // const isStaff = user.role === "Staff";
          const isCurrentUser = user.userId === currentUser?.userId;
          const isPromotingUser = isPromoting(user.userId);
          const isEditingUser = isEditing(user.userId);

          return (
            <TableRow
              key={user.userId}
              className={isPromotingUser ? "opacity-50 pointer-events-none" : ""}
            >
              {/* Name cell — inline edit */}
              <TableCell>
                {isEditingMode ? (
                  <input
                    autoFocus
                    value={editState.name}
                    onChange={(e) =>
                      setEditState(
                        (prev) => prev && { ...prev, name: e.target.value },
                      )
                    }
                    className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    disabled={isEditingUser}
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="font-medium">{user.name}</span>
                    {isCurrentUser && (
                      <Badge variant="outline" className="text-[10px] py-0">
                        You
                      </Badge>
                    )}
                  </div>
                )}
              </TableCell>

              {/* Email cell — inline edit */}
              <TableCell>
                {isEditingMode ? (
                  <input
                    type="email"
                    value={editState.email}
                    onChange={(e) =>
                      setEditState(
                        (prev) => prev && { ...prev, email: e.target.value },
                      )
                    }
                    className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    disabled={isEditingUser}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                )}
              </TableCell>

              {/* Role - Differentiated colors */}
              <TableCell>
                {user.role === "Admin" ? (
                  <Badge className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white border-0">
                    <ShieldAlert className="w-3 h-3" />
                    Admin
                  </Badge>
                ) : user.role === "Staff" ? (
                  <Badge className="gap-1.5 bg-blue-400 hover:bg-blue-500 text-white border-0">
                    <ShieldCheck className="w-3 h-3" />
                    Staff
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200">
                    <User className="w-3 h-3" />
                    User
                  </Badge>
                )}
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                {isEditingMode ? (
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCancel}
                      disabled={isEditingUser}
                      title="Cancel"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button
                      size="sm"
                      className="gap-1 bg-green-600"
                      onClick={() => handleSave(user)}
                      disabled={
                        isEditingUser ||
                        !editState.name.trim() ||
                        !editState.email.trim()
                      }
                    >
                      {isEditingUser ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-end gap-2">
                    {/* Promote button - only for non-admin users */}
                    {!isAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handlePromote(user)}
                        disabled={isPromotingUser}
                        title="Promote to Admin"
                      >
                        {isPromotingUser ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Promoting...
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            Promote
                          </>
                        )}
                      </Button>
                    )}

                    {/* Edit button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleEditClick(user)}
                      disabled={isPromotingUser}
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