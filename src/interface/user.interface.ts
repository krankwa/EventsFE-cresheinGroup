// bases: EventManagementAPI/DTOs/Users/UserResponse.cs
export interface UserResponse {
  userId: number;
  name: string;
  email: string;
  role: string; // User or "Admin
}

// bases: EventManagementAPI/DTOs/Users/UpdateUserRequest.cs
export interface UpdateUserRequest {
  name?: string; // MinLength(2) optional
  email?: string; // EmailAddress optional
  role?: string; // optional
}
