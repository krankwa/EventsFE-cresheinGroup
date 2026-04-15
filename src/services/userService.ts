import { apiRequest } from "./client";
import type {
  UserResponse,
  UpdateUserRequest,
} from "../interface/Auth.interface";

export const userService = {
  getAll: (): Promise<UserResponse[]> =>
    apiRequest<UserResponse[]>("/Users", {
      method: "GET",
      requiresAuth: true,
    }),

  update: (id: number, data: UpdateUserRequest): Promise<UserResponse> =>
    apiRequest<UserResponse>(`/Users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      requiresAuth: true,
    }),
};
 