import { apiRequest } from "./client";
import type {
  UserResponse,
  UpdateUserRequest,
} from "../interface/Auth.interface";
import type { PaginationParams, PaginatedResponse } from "../interface/pagination";

export const userService = {
  getAll: (): Promise<UserResponse[]> =>
    apiRequest<UserResponse[]>("/users", {
      method: "GET",
      requiresAuth: true,
    }),

  getPaginated: (params: PaginationParams): Promise<PaginatedResponse<UserResponse>> => {
    const queryParams = new URLSearchParams({
      pageNumber: params.pageNumber.toString(),
      pageSize: params.pageSize.toString(),
    });
    if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.isDescending !== undefined) queryParams.append("isDescending", params.isDescending.toString());
    
    return apiRequest<PaginatedResponse<UserResponse>>(`/users/list?${queryParams.toString()}`, {
      method: "GET",
      requiresAuth: true,
    });
  },

  update: (id: number, data: UpdateUserRequest): Promise<UserResponse> =>
    apiRequest<UserResponse>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      requiresAuth: true,
    }),
};
 