export interface UpdateUserRequest {
  name: string;
  email: string;
  role: string;
}

export interface UserResponse {
  userId: string;
  name: string;
  email: string;
  role: string;
}
