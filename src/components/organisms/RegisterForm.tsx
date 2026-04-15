import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useRegister } from "../../features/authentication/useRegister";
import { toast } from "react-hot-toast";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, isPending } = useRegister();
  const navigate = useNavigate();

  // Client-side validation helpers
  const passwordsMatch = confirmPassword === "" || password === confirmPassword;
  const passwordStrong = password.length === 0 || password.length >= 6;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    register(
      { name, email, password, confirmPassword },
      {
        onSuccess: () => {
          navigate("/login");
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Full Name */}
      <div className="space-y-1.5">
        <Label htmlFor="reg-name">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="reg-name"
            type="text"
            placeholder="John Doe"
            className="pl-10 h-10"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            disabled={isPending}
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="reg-email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="reg-email"
            type="email"
            placeholder="you@example.com"
            className="pl-10 h-10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isPending}
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="reg-password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            placeholder="Min. 6 characters"
            className={`pl-10 pr-10 h-10 ${!passwordStrong ? "border-destructive focus-visible:ring-destructive" : ""}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={isPending}
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowPassword((p) => !p)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {!passwordStrong && (
          <p className="text-xs text-destructive">
            Password must be at least 6 characters.
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <Label htmlFor="reg-confirm">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="reg-confirm"
            type={showConfirm ? "text" : "password"}
            placeholder="Repeat your password"
            className={`pl-10 pr-10 h-10 ${!passwordsMatch ? "border-destructive focus-visible:ring-destructive" : ""}`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isPending}
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowConfirm((p) => !p)}
            tabIndex={-1}
          >
            {showConfirm ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {!passwordsMatch && (
          <p className="text-xs text-destructive">Passwords do not match.</p>
        )}
      </div>

      <Button
        className="w-full h-11 text-base font-semibold transition-all hover:scale-[1.01] mt-2"
        type="submit"
        disabled={isPending || !passwordsMatch || !passwordStrong}
      >
        {isPending ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-white rounded-full animate-spin" />
            Creating account...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            Create Account
            <ArrowRight className="w-4 h-4" />
          </div>
        )}
      </Button>
    </form>
  );
}
