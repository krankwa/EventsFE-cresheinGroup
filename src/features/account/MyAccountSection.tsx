import { useProfileForm } from "@/components/hooks/useProfileForm";
import { AccountHeader } from "@/components/ui/acc-header";
import { ProfileForm } from "@/components/ui/profile-form";
import { useUser } from "../authentication/useUser";

export function MyAccountSection() {
  const { user, isAdmin } = useUser();

  const profile = useProfileForm(user);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <AccountHeader user={user} isAdmin={isAdmin} />

        <ProfileForm
          user={user}
          form={profile.form}
          setForm={profile.setForm}
          errors={profile.errors}
          isSaving={profile.isSaving}
          onSave={profile.handleSave}
        />
      </div>
    </div>
  );
}