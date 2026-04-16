import { ShieldCheck, CheckCircle2, UserCog, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { cn } from "@/lib/utils";
import { MODAL_STYLES } from "../../../features/admin/constants";
import type { UserResponse, UserRole } from "../../../interface/Auth.interface";

interface RoleChangeDialogProps {
  user: UserResponse | null;
  onClose: () => void;
  onUpdateRole: (role: UserRole) => void;
  isUpdating: boolean;
}

export function RoleChangeDialog({
  user,
  onClose,
  onUpdateRole,
  isUpdating,
}: RoleChangeDialogProps) {
  return (
    <Dialog
      open={!!user}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className={cn("sm:max-w-[425px]", MODAL_STYLES)}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <UserCog className="w-6 h-6 text-primary" />
            Edit User Role
          </DialogTitle>
          <DialogDescription className="sr-only">
            Assign a new administrative or staff role to the selected user.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <button
            onClick={() => onUpdateRole("Admin")}
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
            onClick={() => onUpdateRole("Staff")}
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
  );
}
