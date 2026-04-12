import { apiRequest } from "./client";
import type {
	LoginRequest,
	RegisterRequest,
	AuthResponse,
	UserResponse,
} from "../types/Auth.types";

export const authService = {
	login: (data: LoginRequest): Promise<AuthResponse> =>
		apiRequest<AuthResponse>("/Auth/login", {
			method: "POST",
			body: JSON.stringify(data),
			requiresAuth: false,
		}),

	register: (data: RegisterRequest): Promise<AuthResponse> =>
		apiRequest<AuthResponse>("/Auth/register", {
			method: "POST",
			body: JSON.stringify(data),
			requiresAuth: false,
		}),

	getMe: (): Promise<UserResponse> =>
		apiRequest<UserResponse>("/Users/me", {
			method: "GET",
			requiresAuth: true,
		}),

	logout: () => {
		localStorage.removeItem("token");
	},
};
