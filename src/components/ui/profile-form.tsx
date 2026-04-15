import { User, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import type { ProfileFormData, ProfileErrors } from "@/features/account/types/account.type";
import { ProfileField } from "./profile-field";

interface ProfileFormProps {
    form: ProfileFormData;
    setForm: React.Dispatch<React.SetStateAction<ProfileFormData>>;
    errors: ProfileErrors;
    isSaving: boolean;
    onSave: () => void;
}

export function ProfileForm({ form, setForm, errors, isSaving, onSave }: ProfileFormProps) {
    const handleChange = (field: keyof ProfileFormData) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Profile Information
                </CardTitle>
                <CardDescription>
                    Update your display name and email address.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    placeholder="kurt@gmail.com"
                    disabled={isSaving}
                />

                <div className="flex justify-end pt-1">
                    <Button onClick={onSave} disabled={isSaving} className="gap-2">
                        <Check className="w-4 h-4" />
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}