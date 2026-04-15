import { createContext, useContext, useState, type ReactNode, } from "react";
import { ConfirmDialog } from "../dialog/confirm-dialog";

interface ConfirmOptions {
  title: string;
  description: string | React.ReactNode;
  confirmText?: string | undefined;
  cancelText?: string | undefined;
  variant?: "default" | "destructive" | undefined;
  onConfirm: () => void | Promise<void>;
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => void;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [dialogProps, setDialogProps] = useState<ConfirmOptions & { open: boolean }>({
    open: false,
    title: "",
    description: "",
    onConfirm: async () => { },
  });

  const confirm = (options: ConfirmOptions) => {
    setDialogProps({
      open: true,
      ...options,
    });
  };

  const handleClose = () => {
    setDialogProps((prev) => ({ ...prev, open: false }));
  };

  const handleConfirm = async () => {
    await dialogProps.onConfirm();
    handleClose();
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <ConfirmDialog
        open={dialogProps.open}
        onOpenChange={handleClose}
        onConfirm={handleConfirm}
        title={dialogProps.title}
        description={dialogProps.description}
        confirmText={dialogProps.confirmText ?? "Confirm"}
        cancelText={dialogProps.cancelText ?? "Cancel"}
        variant={dialogProps.variant ?? "default"}
        isLoading={false}
      />
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return context;
}