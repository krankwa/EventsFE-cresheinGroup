// Mirrors: EventManagement.Core/Enums/UserRole.cs
export type UserRole = "User" | "Admin";

// Mirrors: EventManagement.Core/DTO/Auth/LoginRequest.cs
export interface LoginRequest {
  email: string;
  password: string;
}

// Mirrors: EventManagement.Core/DTO/Auth/RegisterRequest.cs
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Mirrors: EventManagement.Core/DTO/Auth/AuthResponse.cs
export interface AuthResponse {
  token: string;
  message: string;
}

// Mirrors: EventManagement.Core/DTO/Users/UserResponse.cs
export interface UserResponse {
  userId: number;
  name: string;
  email: string;
  role: UserRole;
}

// Mirrors: EventManagement.Core/DTO/Users/UpdateUserRequest.cs
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: UserRole;
  password?: string;
  newPassword?: string;
}
