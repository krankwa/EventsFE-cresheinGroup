//EventManagement.Core/Enums/UserRole.cs
export type UserRole = "User" | "Admin";

//EventManagement.Core/DTO/Auth/LoginRequest.cs
export interface LoginRequest {
  email: string; // Required: EmailAddress
  password: string; // Required
}

//EventManagement.Core/DTO/Auth/RegisterRequest.cs
export interface RegisterRequest {
  name: string; // Required: MinLength(2)
  email: string; // Required: EmailAddress
  password: string; // Required: MinLength(6)
  confirmPassword: string; // Required: Compare("Password")
}

//EventManagement.Core/DTO/Auth/AuthResponse.cs
export interface AuthResponse {
  token: string;
  message: string;
}

//EventManagement.Core/DTO/Users/UserResponse.cs
export interface UserResponse {
  userId: number;
  name: string;
  email: string;
  role: UserRole;
}

//EventManagement.Core/DTO/Users/UpdateUserRequest.cs
export interface UpdateUserRequest {
  name?: string; // MinLength(2)
  email?: string; // EmailAddress
  role?: UserRole;
}
