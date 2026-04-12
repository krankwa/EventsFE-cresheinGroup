import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/features/authentication/useUser";
import { userService } from "@/services/userService";
import {
    ArrowLeft,
    User,
    Mail,
    Lock,
    ShieldCheck,
    Eye,
    EyeOff,
    Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";

// ─── Small reusable field ────────────────────────────────────────────────────
function Field({
    label,
    icon: Icon,
    error,
    ...props
}: {
    label: string;
    icon: React.ElementType;
    error?: string | undefined;
} & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{label}</label>
            <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                    {...props}
                    className={`h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-destructive focus-visible:ring-destructive" : "border-input"}`}
                />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

// ─── Password field with show/hide toggle ────────────────────────────────────
function PasswordField({
    label,
    error,
    ...props
}: {
    label: string;
    error?: string | undefined;
} & React.InputHTMLAttributes<HTMLInputElement>) {
    const [show, setShow] = useState(false);
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{label}</label>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                    {...props}
                    type={show ? "text" : "password"}
                    className={`h-10 w-full rounded-md border bg-background pl-9 pr-10 text-sm
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-destructive focus-visible:ring-destructive" : "border-input"}`}
                />
                <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShow((s) => !s)}
                    tabIndex={-1}
                >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export function MyAccountSection() {
    const { user, isAdmin } = useUser();
    const navigate = useNavigate();

    // ── Profile form state ──
    const [profileForm, setProfileForm] = useState({
        name: user?.name ?? "",
        email: user?.email ?? "",
    });
    const [profileErrors, setProfileErrors] = useState<{ name?: string; email?: string }>({});
    const [savingProfile, setSavingProfile] = useState(false);

    // ── Password form state ──
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordErrors, setPasswordErrors] = useState<{
        currentPassword?: string;
        newPassword?: string;
        confirmPassword?: string;
    }>({});
    const [savingPassword, setSavingPassword] = useState(false);

    if (!user) return null;

    // ── Profile validation ──
    const validateProfile = () => {
        const errors: typeof profileErrors = {};
        if (!profileForm.name.trim()) errors.name = "Name is required.";
        if (!profileForm.email.trim()) errors.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email))
            errors.email = "Enter a valid email address.";
        setProfileErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleProfileSave = async () => {
        if (!validateProfile()) return;
        setSavingProfile(true);
        try {
            await userService.update(user.userId, {
                name: profileForm.name.trim(),
                email: profileForm.email.trim(),
            });
            toast.success("Profile updated successfully.");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setSavingProfile(false);
        }
    };

    // ── Password validation ──
    const validatePassword = () => {
        const errors: typeof passwordErrors = {};
        if (!passwordForm.currentPassword)
            errors.currentPassword = "Current password is required.";
        if (!passwordForm.newPassword)
            errors.newPassword = "New password is required.";
        else if (passwordForm.newPassword.length < 8)
            errors.newPassword = "Password must be at least 8 characters.";
        if (!passwordForm.confirmPassword)
            errors.confirmPassword = "Please confirm your new password.";
        else if (passwordForm.newPassword !== passwordForm.confirmPassword)
            errors.confirmPassword = "Passwords do not match.";
        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePasswordSave = async () => {
        if (!validatePassword()) return;
        setSavingPassword(true);
        try {
            await userService.update(user.userId, {
                password: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            });
            toast.success("Password changed successfully.");
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setPasswordErrors({});
        } catch (err) {
            console.error(err);
            toast.error("Failed to change password. Check your current password.");
        } finally {
            setSavingPassword(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">

                {/* ── Header ── */}
                <div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 mb-4 -ml-2 text-muted-foreground"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>

                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            {isAdmin
                                ? <ShieldCheck className="w-7 h-7" />
                                : <User className="w-7 h-7" />}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
                                <Badge variant={isAdmin ? "default" : "secondary"}>
                                    {isAdmin ? "Admin" : "User"}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* ── Section 1: Profile info ── */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Profile Information
                        </CardTitle>
                        <CardDescription>Update your display name and email address.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Field
                            label="Full Name"
                            icon={User}
                            value={profileForm.name}
                            onChange={(e) =>
                                setProfileForm((p) => ({ ...p, name: e.target.value }))
                            }
                            error={profileErrors.name}
                            placeholder="Your full name"
                            disabled={savingProfile}
                        />
                        <Field
                            label="Email Address"
                            icon={Mail}
                            type="email"
                            value={profileForm.email}
                            onChange={(e) =>
                                setProfileForm((p) => ({ ...p, email: e.target.value }))
                            }
                            error={profileErrors.email}
                            placeholder="kurt@gmail.com"
                            disabled={savingProfile}
                        />
                        <div className="flex justify-end pt-1">
                            <Button
                                onClick={handleProfileSave}
                                disabled={savingProfile}
                                className="gap-2"
                            >
                                <Check className="w-4 h-4" />
                                {savingProfile ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Section 2: Change password ── */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Change Password
                        </CardTitle>
                        <CardDescription>
                            Choose a strong password at least 8 characters long.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <PasswordField
                            label="Current Password"
                            value={passwordForm.currentPassword}
                            onChange={(e) =>
                                setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))
                            }
                            error={passwordErrors.currentPassword}
                            placeholder="Enter current password"
                            disabled={savingPassword}
                        />
                        <PasswordField
                            label="New Password"
                            value={passwordForm.newPassword}
                            onChange={(e) =>
                                setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))
                            }
                            error={passwordErrors.newPassword}
                            placeholder="Min. 8 characters"
                            disabled={savingPassword}
                        />
                        <PasswordField
                            label="Confirm New Password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) =>
                                setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))
                            }
                            error={passwordErrors.confirmPassword}
                            placeholder="Repeat new password"
                            disabled={savingPassword}
                        />
                        <div className="flex justify-end pt-1">
                            <Button
                                onClick={handlePasswordSave}
                                disabled={savingPassword}
                                className="gap-2"
                            >
                                <Lock className="w-4 h-4" />
                                {savingPassword ? "Updating..." : "Update Password"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
