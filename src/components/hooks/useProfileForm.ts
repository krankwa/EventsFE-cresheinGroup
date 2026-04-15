import { useState } from "react";
import { userService } from "@/services/userService";
import { toast } from "react-hot-toast";
import type {
  ProfileFormData,
  ProfileErrors,
} from "@/features/account/types/account.type";

export function useProfileForm(user: any, onSuccess?: () => void) {
  const [form, setForm] = useState<ProfileFormData>({
    name: user?.name ?? "",
    email: user?.email ?? "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingData, setPendingData] = useState<ProfileFormData | null>(null);

  const validate = (): boolean => {
    const newErrors: ProfileErrors = {};
    const isAdmin = user?.role === "Admin";

    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email address.";

    // Password validation for users updating themselves
    if (!isAdmin) {
      if (!form.currentPassword) {
        newErrors.currentPassword = "Current password is required to save changes.";
      }
    }

    // New password validation
    if (form.newPassword) {
      if (form.newPassword.length < 8) {
        newErrors.newPassword = "New password must be at least 8 characters.";
      }
      if (form.newPassword !== form.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasChanges = (): boolean => {
    return (
      form.name.trim() !== user.name ||
      form.email.trim() !== user.email ||
      !!form.newPassword
    );
  };

  const handleSave = () => {
    if (!validate()) return;
    if (!hasChanges()) {
      toast.error("No changes to save.");
      return;
    }
    // We don't really need a confirm dialog if it's inline as per user feedback "no modal for password",
    // but the user might still want a confirm dialog for the WHOLE profile update.
    // However, the user said "dont have to put a modal for the password changing", 
    // which I interpreted as "just use the form". I'll skip the confirm dialog for now to minimize friction.
    confirmUpdate();
  };

  const confirmUpdate = async () => {
    setIsSaving(true);
    try {
      await userService.update(user.userId, {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.currentPassword,
        newPassword: form.newPassword || undefined,
      });
      toast.success("Profile updated successfully!");
      setForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setErrors({});
      onSuccess?.();
    } catch (err: any) {
      const message = err?.response?.data?.Message || "Failed to update profile. Please try again.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    form,
    setForm,
    errors,
    isSaving,
    showConfirm,
    setShowConfirm,
    pendingData,
    handleSave,
    confirmUpdate,
  };
}
