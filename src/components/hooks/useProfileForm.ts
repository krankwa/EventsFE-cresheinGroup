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
  });
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingData, setPendingData] = useState<ProfileFormData | null>(null);

  const validate = (): boolean => {
    const newErrors: ProfileErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email address.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasChanges = (): boolean => {
    return form.name.trim() !== user.name || form.email.trim() !== user.email;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (!hasChanges()) {
      toast.error("No changes to save.");
      return;
    }
    setPendingData({ name: form.name.trim(), email: form.email.trim() });
    setShowConfirm(true);
  };

  const confirmUpdate = async () => {
    if (!pendingData) return;
    setIsSaving(true);
    try {
      await userService.update(user.userId, {
        name: pendingData.name,
        email: pendingData.email,
      });
      toast.success("Profile updated successfully!");
      setForm({ name: pendingData.name, email: pendingData.email });
      setErrors({});
      setShowConfirm(false);
      setPendingData(null);
      onSuccess?.();
    } catch (err) {
      toast.error("Failed to update profile. Please try again.");
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
