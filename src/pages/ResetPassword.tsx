import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Lock, ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { resetPassword } from "../services/apiAuth";
import { PublicNavbar } from "../components/organisms/PublicNavbar";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Missing reset token. Please request a new password reset link.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsPending(true);
    setError(null);

    try {
      await resetPassword({ token, newPassword, confirmPassword });
      setIsSuccess(true);
      // Auto-redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. The link may have expired.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNavbar />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 transition-all">
          
          {!isSuccess ? (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <div className="flex justify-center mb-2">
                   <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <ShieldCheck className="h-6 w-6 text-primary" />
                   </div>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Reset Password</h1>
                <p className="text-slate-500 text-sm">
                  Create a strong new password for your account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 h-11 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all bg-slate-50/50"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        disabled={isPending || !token}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 h-11 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all bg-slate-50/50"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isPending || !token}
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                    <AlertCircle className="shrink-0 w-4 h-4" />
                    {error}
                  </div>
                )}

                <Button 
                  className="w-full h-11 text-base font-semibold"
                  type="submit"
                  disabled={isPending || !token}
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-white rounded-full animate-spin" />
                      Updating Password...
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>

              <div className="text-center">
                <Link 
                  to="/login" 
                  className="inline-flex items-center text-sm text-slate-500 hover:text-primary transition-colors gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Cancel and Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-center py-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center border border-green-100 animate-in zoom-in duration-300">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-outfit">Password Updated!</h1>
                <p className="text-slate-500 text-sm">
                  Your password has been securely updated. You can now use your new password to sign in.
                </p>
                <p className="text-primary text-sm font-medium pt-4 animate-pulse">
                  Redirecting to login...
                </p>
              </div>
              <Button 
                className="w-full h-11 font-semibold"
                onClick={() => navigate("/login")}
              >
                Go to Login Now
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
