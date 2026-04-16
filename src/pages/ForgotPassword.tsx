import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { forgotPassword } from "../services/apiAuth";
import { PublicNavbar } from "../components/organisms/PublicNavbar";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNavbar />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 transition-all">
          
          {!isSubmitted ? (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Forgot Password?</h1>
                <p className="text-slate-500 text-sm">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10 h-11 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all bg-slate-50/50"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isPending}
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                    <span className="shrink-0">⚠️</span>
                    {error}
                  </div>
                )}

                <Button 
                  className="w-full h-11 text-base font-semibold bg-blue-950 group"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-white rounded-full animate-spin" />
                      Sending Link...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Send Reset Link
                      <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="text-center">
                <Link 
                  to="/login" 
                  className="inline-flex items-center text-sm text-slate-500 hover:text-primary transition-colors gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Log In
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
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-outfit">Check Your Email</h1>
                <p className="text-slate-500 text-sm">
                  We've sent a password reset link to <span className="font-semibold text-slate-700">{email}</span>.
                </p>
                <p className="text-slate-400 text-xs italic mt-4">
                  (Note: Check your spam folder if you don't see it within a few minutes)
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full h-11 font-medium border-slate-200 hover:bg-slate-50"
                onClick={() => setIsSubmitted(false)}
              >
                Try Another Email
              </Button>
              <div className="text-center">
                <Link 
                  to="/login" 
                  className="inline-flex items-center text-sm text-slate-500 hover:text-primary transition-colors gap-2 font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Return to Log In
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
