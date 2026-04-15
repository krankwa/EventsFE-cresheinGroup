import { apiRequest } from "./client";
import type {
  UserResponse,
  UpdateUserRequest,
} from "../interface/Auth.interface";
import type {
  PaginationParams,
  PaginatedResponse,
} from "@/interface/pagination";

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

  getAllPaginated: async (
    params: PaginationParams,
  ): Promise<PaginatedResponse<UserResponse>> => {
    // Build URL manually to ensure parameters are sent correctly
    const queryParams = new URLSearchParams();
    queryParams.append("pageNumber", params.pageNumber.toString());
    queryParams.append("pageSize", params.pageSize.toString());
    if (params.searchTerm) {
      queryParams.append("searchTerm", params.searchTerm);
    }

    const url = `/Users/paginated?${queryParams.toString()}`;

    return apiRequest<PaginatedResponse<UserResponse>>(url, {
      method: "GET",
      requiresAuth: true,
    });
  },
};
 