import { useState } from "react";
import { userService } from "@/services/userService";
import { toast } from "react-hot-toast";
import type { PasswordFormData, PasswordErrors } from "@/features/account/types/account.type";

export function usePasswordForm(user: any) {
  const [form, setForm] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingData, setPendingData] = useState<Omit<PasswordFormData, "confirmPassword"> | null>(null);

  const validate = (): boolean => {
    const newErrors: PasswordErrors = {};
    if (!form.currentPassword) newErrors.currentPassword = "Current password is required.";
    if (!form.newPassword) newErrors.newPassword = "New password is required.";
    else if (form.newPassword.length < 8)
      newErrors.newPassword = "Password must be at least 8 characters.";
    if (!form.confirmPassword) newErrors.confirmPassword = "Please confirm your new password.";
    else if (form.newPassword !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setPendingData({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });
    setShowConfirm(true);
  };

  const confirmUpdate = async () => {
    if (!pendingData) return;
    setIsSaving(true);
    try {
      await userService.update(user.userId, {
        password: pendingData.currentPassword,
        newPassword: pendingData.newPassword,
      });
      toast.success("Password changed successfully! Please use your new password next login.");
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
      setShowConfirm(false);
      setPendingData(null);
    } catch (err) {
      toast.error("Failed to change password. Please check your current password.");
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