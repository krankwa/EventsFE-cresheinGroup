import { useState } from "react";
import { useLogin } from "../../features/authentication/useLogin";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Mail, Lock, ArrowRight } from "lucide-react";

export function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login, isPending } = useLogin();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		login({ email, password });
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="space-y-2">
				<Label htmlFor="email">Email</Label>
				<div className="relative">
					<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
					<Input
						id="email"
						type="email"
						placeholder="user@email.com"
						className="pl-10 h-10"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						disabled={isPending}
                        autoComplete="username"
					/>
				</div>
			</div>
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<Label htmlFor="password">Password</Label>
					<a href="#" className="text-xs text-primary hover:underline">
						Forgot password?
					</a>
				</div>
				<div className="relative">
					<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
					<Input
						id="password"
						type="password"
						className="pl-10 h-10"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						disabled={isPending}
                        autoComplete="current-password"
					/>
				</div>
			</div>
			<Button
				className="w-full h-11 text-base font-semibold transition-all hover:scale-[1.01]"
				type="submit"
				disabled={isPending}
			>
				{isPending ? (
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-white rounded-full animate-spin" />
						Logging in...
					</div>
				) : (
					<div className="flex items-center gap-2">
						Sign In
						<ArrowRight className="w-4 h-4" />
					</div>
				)}
			</Button>
		</form>
	);
}
