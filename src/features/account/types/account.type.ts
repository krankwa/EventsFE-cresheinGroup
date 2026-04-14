export interface ProfileFormData {
  name: string;
  email: string;
}

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileErrors {
  name?: string;
  email?: string;
}

export interface PasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}
