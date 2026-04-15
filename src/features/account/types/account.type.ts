export interface ProfileFormData {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface ProfileErrors {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}
