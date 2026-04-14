import { ConfirmDialog } from "@/components/dialog/confirm-dialog";
import { PasswordChangeAlert } from "@/components/dialog/password-change";
import { usePasswordForm } from "@/components/hooks/usePasswordForm";
import { useProfileForm } from "@/components/hooks/useProfileForm";
import { AccountHeader } from "@/components/ui/acc-header";
import { PasswordForm } from "@/components/ui/password-form";
import { ProfileForm } from "@/components/ui/profile-form";
import { useUser } from "../authentication/useUser";

export function MyAccountSection() {
  const { user, isAdmin } = useUser();

  const profile = useProfileForm(user);
  const password = usePasswordForm(user);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <AccountHeader user={user} isAdmin={isAdmin} />

        <ProfileForm
          form={profile.form}
          setForm={profile.setForm}
          errors={profile.errors}
          isSaving={profile.isSaving}
          onSave={profile.handleSave}
        />

        <PasswordForm
          form={password.form}
          setForm={password.setForm}
          errors={password.errors}
          isSaving={password.isSaving}
          onSave={password.handleSave}
        />
      </div>

      {/* Profile Change Confirmation */}
      <ConfirmDialog
        open={profile.showConfirm}
        onOpenChange={profile.setShowConfirm}
        onConfirm={profile.confirmUpdate}
        title="Confirm Profile Changes"
        description={
          <div className="space-y-2">
            <p>Are you sure you want to update your profile information?</p>
            <div className="bg-muted p-3 rounded-md space-y-1 mt-2">
              <p className="text-sm">
                <span className="font-medium">Name:</span>{" "}
                <span className="text-muted-foreground line-through">{user.name}</span>
                {" → "}
                <span className="text-green-600 dark:text-green-400">{profile.pendingData?.name}</span>
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span>{" "}
                <span className="text-muted-foreground line-through">{user.email}</span>
                {" → "}
                <span className="text-green-600 dark:text-green-400">{profile.pendingData?.email}</span>
              </p>
            </div>
          </div>
        }
        confirmText="Save Changes"
        isLoading={profile.isSaving}
      />

      {/* Password Change Confirmation */}
      <PasswordChangeAlert
        open={password.showConfirm}
        onOpenChange={password.setShowConfirm}
        onConfirm={password.confirmUpdate}
        isLoading={password.isSaving}
      />
    </div>
  );
}