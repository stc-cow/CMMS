import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/auth";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Processing authentication...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the error from URL parameters
        const error = searchParams.get("error");
        const errorCode = searchParams.get("error_code");
        const errorDescription = searchParams.get("error_description");

        if (error) {
          // Handle OTP expired or other errors
          if (errorCode === "otp_expired") {
            setMessage(
              "Email link expired. Please sign up again or request a new confirmation link.",
            );
            setTimeout(() => navigate("/login?tab=signup"), 3000);
            return;
          }

          setMessage(`Authentication error: ${errorDescription || error}`);
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        // Check if there's a session after callback
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setMessage("Email confirmed! Redirecting...");
          setTimeout(() => navigate("/"), 1500);
        } else {
          setMessage("Authentication processing...");
          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (err) {
        console.error("Callback error:", err);
        setMessage("An error occurred during authentication.");
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
        <p className="text-lg">{message}</p>
      </div>
    </div>
  );
}
