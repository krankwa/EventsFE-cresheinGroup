import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../services/apiAuth";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email address...");

  useEffect(() => {
    const handleVerification = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link. No token found.");
        return;
      }

      try {
        const response = await verifyEmail(token);
        setStatus("success");
        setMessage(response.message || "Your email has been successfully verified.");
        toast.success("Verification successful!");
      } catch (error: any) {
        setStatus("error");
        setMessage(error.message || "Failed to verify email. The link may be expired or invalid.");
        toast.error("Verification failed");
      }
    };

    handleVerification();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] px-4">
      <div className="max-w-md w-full text-center space-y-8 p-10 rounded-3xl bg-[#121214] border border-[#1d1d20] shadow-2xl relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 space-y-6">
          <div className="flex justify-center">
            {status === "loading" && (
              <div className="p-4 bg-blue-500/10 rounded-2xl">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              </div>
            )}
            {status === "success" && (
              <div className="p-4 bg-green-500/10 rounded-2xl animate-in zoom-in duration-300">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
            )}
            {status === "error" && (
              <div className="p-4 bg-red-500/10 rounded-2xl animate-in zoom-in duration-300">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {status === "loading" && "Verification in Progress"}
              {status === "success" && "Email Verified!"}
              {status === "error" && "Verification Failed"}
            </h1>
            <p className="text-gray-400 leading-relaxed">
              {message}
            </p>
          </div>

          {(status === "success" || status === "error") && (
            <button
              onClick={() => navigate("/login")}
              className="group relative w-full flex items-center justify-center gap-2 py-4 px-6 bg-white text-black font-semibold rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-white/10"
            >
              Back to Login
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          )}

          {status === "loading" && (
            <p className="text-sm text-gray-500 animate-pulse">
              Please wait while we secure your account...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
