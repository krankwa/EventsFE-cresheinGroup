import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { cn } from "../../lib/utils";
import { MODAL_STYLES } from "../../features/admin/constants";
import { Button } from "../../components/ui/button";
import { AlertCircle, HelpCircle, AlertTriangle } from "lucide-react";

export type ConfirmationType = "danger" | "warning" | "info";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmationType;
  isLoading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  isLoading,
}: ConfirmationDialogProps) {
  const getIcon = () => {
    switch (type) {
      case "danger":
        return <AlertTriangle className="w-5 h-5" />;
      case "warning":
        return <AlertCircle className="w-5 h-5" />;
      case "info":
        return <HelpCircle className="w-5 h-5" />;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case "danger":
        return "bg-destructive/10 text-destructive";
      case "warning":
        return "bg-yellow-500/10 text-yellow-600";
      case "info":
        return "bg-primary/10 text-primary";
    }
  };

  const getConfirmButtonVariant = () => {
    switch (type) {
      case "danger":
        return "destructive";
      case "warning":
        return "default"; // or a custom warning color
      case "info":
        return "default";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-[425px]", MODAL_STYLES)}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                getIconBg(),
              )}
            >
              {getIcon()}
            </div>
            <DialogTitle className="text-xl">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={getConfirmButtonVariant() as any}
            onClick={onConfirm}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
