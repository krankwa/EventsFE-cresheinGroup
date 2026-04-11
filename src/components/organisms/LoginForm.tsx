import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../api/authService";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });
      await login(response.token);
      
      // Redirect based on role after status update
      // We can fetch the user role from the auth context since login() calls fetchUser()
      // or we can just let RoleRedirect handle it if we navigate to root
      navigate("/"); 
    } catch (error: unknown) {
      console.error("Login failed", error);
      const message = error instanceof Error ? error.message : "Invalid credentials or unauthorized.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
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
            placeholder="admin@eventtix.com"
            className="pl-10 h-10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
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
            disabled={isLoading}
          />
        </div>
      </div>
      <Button className="w-full h-11 text-base font-semibold transition-all hover:scale-[1.01]" type="submit" disabled={isLoading}>
        {isLoading ? (
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
