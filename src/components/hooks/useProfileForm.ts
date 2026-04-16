import { useState } from "react";
import { userService } from "@/services/userService";
import { toast } from "react-hot-toast";
import type {
  ProfileFormData,
  ProfileErrors,
} from "@/features/account/types/account.type";
import type { UserResponse } from "@/interface/Auth.interface";

export function useProfileForm(user: UserResponse | null, onSuccess?: () => void) {
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
    if (!user) return false;
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
    setPendingData(form);
    setShowConfirm(true);
  };

  const confirmUpdate = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await userService.update(user.userId, {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.currentPassword,
        newPassword: form.newPassword || undefined,
      });
      toast.success("Profile updated successfully!");
      setShowConfirm(false);
      setPendingData(null);
      setForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setErrors({});
      onSuccess?.();
    } catch (err: unknown) {
      const errorData = (err as { response?: { data?: { Message?: string } } })?.response?.data;
      const message = errorData?.Message || "Failed to update profile. Please try again.";
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
    handleSave,
    confirmUpdate,
    showConfirm,
    setShowConfirm,
    pendingData,
  };
}
