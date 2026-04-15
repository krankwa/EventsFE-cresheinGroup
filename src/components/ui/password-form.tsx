import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import type { PasswordFormData, PasswordErrors } from "@/features/account/types/account.type";
import { PasswordField } from "./password-field";
interface PasswordFormProps {
    form: PasswordFormData;
    setForm: React.Dispatch<React.SetStateAction<PasswordFormData>>;
    errors: PasswordErrors;
    isSaving: boolean;
    onSave: () => void;
}

export function PasswordForm({ form, setForm, errors, isSaving, onSave }: PasswordFormProps) {
    const handleChange = (field: keyof PasswordFormData) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    return (
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
                    value={form.currentPassword}
                    onChange={handleChange("currentPassword")}
                    error={errors.currentPassword}
                    placeholder="Enter current password"
                    disabled={isSaving}
                />

                <PasswordField
                    label="New Password"
                    value={form.newPassword}
                    onChange={handleChange("newPassword")}
                    error={errors.newPassword}
                    placeholder="Min. 8 characters"
                    description="Password must be at least 8 characters long"
                    disabled={isSaving}
                />

                <PasswordField
                    label="Confirm New Password"
                    value={form.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    error={errors.confirmPassword}
                    placeholder="Repeat new password"
                    disabled={isSaving}
                />

                <div className="flex justify-end pt-1">
                    <Button onClick={onSave} disabled={isSaving} className="gap-2">
                        <Lock className="w-4 h-4" />
                        {isSaving ? "Updating..." : "Update Password"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}