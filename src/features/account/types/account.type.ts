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

export interface PasswordFormData {
  currentPassword?: string | undefined;
  newPassword?: string | undefined;
  confirmPassword?: string | undefined;
}

export interface PasswordErrors {
  currentPassword?: string | undefined;
  newPassword?: string | undefined;
  confirmPassword?: string | undefined;
}
