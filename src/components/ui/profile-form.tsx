import {
  User,
  Mail,
  Check,
  Lock,
  ShieldCheck,
  ShieldAlert,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type {
  ProfileFormData,
  ProfileErrors,
} from "@/features/account/types/account.type";
import { ProfileField } from "./profile-field";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ProfileFormProps {
  user: any;
  form: ProfileFormData;
  setForm: React.Dispatch<React.SetStateAction<ProfileFormData>>;
  errors: ProfileErrors;
  isSaving: boolean;
  onSave: () => void;
}

export function ProfileForm({
  user,
  form,
  setForm,
  errors,
  isSaving,
  onSave,
}: ProfileFormProps) {
  const isAdmin = user?.role === "Admin";
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    if (!form.newPassword) {
      setStrength(0);
      return;
    }

    let score = 0;
    if (form.newPassword.length >= 8) score += 25;
    if (/[A-Z]/.test(form.newPassword)) score += 25;
    if (/[0-9]/.test(form.newPassword)) score += 25;
    if (/[^A-Za-z0-9]/.test(form.newPassword)) score += 25;

    setStrength(score);
  }, [form.newPassword]);

  const getStrengthLabel = () => {
    if (strength <= 25)
      return { label: "Weak", color: "bg-red-500", icon: ShieldAlert };
    if (strength <= 50)
      return { label: "Fair", color: "bg-orange-500", icon: Shield };
    if (strength <= 75)
      return { label: "Good", color: "bg-blue-500", icon: ShieldCheck };
    return { label: "Strong", color: "bg-green-500", icon: ShieldCheck };
  };

  const strengthMeta = getStrengthLabel();

  const handleChange =
    (field: keyof ProfileFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <Card className="border-primary/10 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2 text-primary">
          <User className="w-5 h-5 transition-transform hover:scale-110" />
          Account Settings
        </CardTitle>
        <CardDescription>
          Manage your profile information and account security.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileField
            label="Full Name"
            icon={User}
            value={form.name}
            onChange={handleChange("name")}
            error={errors.name}
            placeholder="Your full name"
            disabled={isSaving}
          />

          <ProfileField
            label="Email Address"
            icon={Mail}
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            error={errors.email}
            placeholder="email@example.com"
            disabled={isSaving}
          />
        </div>

        <div className="h-px bg-border/60 my-2" />

        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            <Lock className="w-4 h-4" />
            Security & Credentials
          </div>

          {!isAdmin && (
            <ProfileField
              label="Current Password"
              icon={Lock}
              type="password"
              value={form.currentPassword || ""}
              onChange={handleChange("currentPassword")}
              error={errors.currentPassword}
              placeholder="Required to save changes"
              disabled={isSaving}
              description="For security, please enter your current password to save any changes."
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
              <ProfileField
                label="New Password (Optional)"
                icon={Shield}
                type="password"
                value={form.newPassword || ""}
                onChange={handleChange("newPassword")}
                error={errors.newPassword}
                placeholder="Min. 8 characters"
                disabled={isSaving}
              />

              {form.newPassword && (
                <div className="space-y-2 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <strengthMeta.icon
                        className={cn(
                          "w-3 h-3",
                          strengthMeta.color.replace("bg-", "text-"),
                        )}
                      />
                      Strength:{" "}
                      <span className="font-bold">{strengthMeta.label}</span>
                    </span>
                    <span className="text-muted-foreground font-mono">
                      {strength}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-500 ease-out",
                        strengthMeta.color,
                      )}
                      style={{ width: `${strength}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <ProfileField
                label="Confirm New Password"
                icon={ShieldCheck}
                type="password"
                value={form.confirmPassword || ""}
                onChange={handleChange("confirmPassword")}
                error={errors.confirmPassword}
                placeholder="Repeat new password"
                disabled={isSaving}
              />
              {form.newPassword && form.confirmPassword && form.newPassword === form.confirmPassword && (
                <p className="text-[10px] text-green-600 font-medium flex items-center gap-1 animate-in slide-in-from-left-1 duration-300">
                  <Check className="w-3 h-3" />
                  Passwords match
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border/40 mt-6">
          <Button
            onClick={onSave}
            disabled={isSaving}
            className="gap-2 px-8 py-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving Changes...
              </div>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Update Profile
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
