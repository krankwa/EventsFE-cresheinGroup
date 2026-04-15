import { useLogout } from "@/features/authentication/useLogout";
import { useConfirm } from "../ui/confirm-context";

export function useLogoutWithConfirm() {
  const { logout } = useLogout();
  const { confirm } = useConfirm();

  const logoutWithConfirm = () => {
    confirm({
      title: "Sign Out",
      description: (
        <>
          <p>Are you sure you want to sign out?</p>
          <p className="text-sm text-muted-foreground mt-2">
            You will need to log in again to access your account.
          </p>
        </>
      ),
      confirmText: "Sign Out",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        await logout();
      },
    });
  };

  return { logoutWithConfirm };
}