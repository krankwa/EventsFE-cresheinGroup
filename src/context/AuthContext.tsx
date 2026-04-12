import React, { useState, useEffect } from "react";
import { authService } from "../services/authService";
import type { UserResponse } from "../types/Auth.types";
import { toast } from "react-hot-toast";
import { AuthContext } from "../hooks/useAuth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<UserResponse | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchUser = async () => {
		try {
			const userData = await authService.getMe();
			setUser(userData);
		} catch (error) {
			console.error("Failed to fetch user session", error);
			localStorage.removeItem("token");
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			fetchUser();
		} else {
			setLoading(false);
		}
	}, []);

	const login = async (token: string) => {
		localStorage.setItem("token", token);
		setLoading(true);
		await fetchUser();
		toast.success("Welcome back!");
	};

	const logout = () => {
		authService.logout();
		setUser(null);
		toast.success("Logged out successfully");
	};

	const isAdmin = user?.role === "Admin";

	return (
		<AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
			{children}
		</AuthContext.Provider>
	);
}
