import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAuthForm } from "@/hooks/useAuthForm";
import { signInWithGoogle } from "@/lib/auth";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    formData,
    setFormData,
    isLoading,
    error,
    handleSignIn,
    handleSignUp,
    clearError,
  } = useAuthForm();

  const handleModeToggle = () => {
    clearError();
    setIsSignUp(!isSignUp);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleGoogleSignIn = async () => {
    const { data, error } = await signInWithGoogle();
    if (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      await handleSignUp();
    } else {
      await handleSignIn();
    }
  };

  // Check if form is valid
  const isFormValid = isSignUp
    ? formData.email &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword
    : formData.email && formData.password;

  const isSuccessMessage = error?.includes("created") || error?.includes("check your email");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,.03)_10px,rgba(255,255,255,.03)_20px)] pointer-events-none"></div>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute right-1/4 top-1/3 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main container */}
      <div className="relative w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding and features */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 text-white">
          {/* ACES Logo Section */}
          <div className="flex flex-col items-start">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fabc8ab05f7d144f289a582747d3e5ca3%2F2884fc9a1a5d47faad23fb841f7538d3?format=webp&width=400"
              alt="ACES Managed Services"
              className="h-40 w-auto"
            />
            <div className="mt-3 mb-5">
              <div className="w-56 h-0.5 bg-gradient-to-r from-red-500 via-red-500 to-transparent rounded-sm shadow-sm shadow-red-900/20"></div>
            </div>
          </div>

          {/* Tagline */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold leading-snug">
              <p>
                <strong>COW Movement Management System </strong>
                <span className="text-3xl font-light opacity-70">CMMS</span>
              </p>
            </h1>
          </div>

          {/* Footer text */}
          <div className="pt-12 border-t border-blue-500/20 opacity-60">
            <h2 className="text-sm">
              <span style={{ color: "rgb(155, 155, 155)" }}>Powered by</span>{" "}
              <strong style={{ color: "rgb(239, 55, 75)" }}>ACES MSD</strong>
            </h2>
          </div>
        </div>

        {/* Right side - Login/Signup form */}
        <div className="w-full max-w-md mx-auto lg:mb-0 mb-4">
          <div className="bg-white/98 backdrop-blur-xl rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] p-8 md:p-10 space-y-8 border border-white/30">
            {/* Mobile ACES Logo */}
            <div className="lg:hidden flex flex-col items-center pb-4 border-b border-slate-200 gap-3">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fabc8ab05f7d144f289a582747d3e5ca3%2F2884fc9a1a5d47faad23fb841f7538d3?format=webp&width=400"
                alt="ACES Managed Services"
                className="h-28 w-auto"
              />
              <div className="mt-1">
                <div className="w-36 h-0.5 bg-gradient-to-r from-red-500 via-red-500 to-transparent rounded-sm shadow-sm shadow-red-900/20"></div>
              </div>
            </div>

            {/* Form title */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">
                {isSignUp ? "Create Account" : "Welcome back"}
              </h2>
              <p className="text-white">
                {isSignUp
                  ? "Sign up to start managing your ACES operations"
                  : "Sign in to your ACES account to manage your operations"}
              </p>
            </div>

            {/* Error/Success message */}
            {error && (
              <div
                className={`p-4 rounded-xl flex items-start gap-3 ${
                  isSuccessMessage
                    ? "bg-green-50/80 border border-green-200"
                    : "bg-red-50/80 border border-red-200"
                }`}
              >
                {isSuccessMessage ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <p
                  className={
                    isSuccessMessage ? "text-green-800 text-sm" : "text-red-800 text-sm"
                  }
                >
                  {error}
                </p>
              </div>
            )}

            {/* Auth form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name field (signup only) */}
              {isSignUp && (
                <div className="space-y-2">
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-white"
                  >
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      id="fullName"
                      type="text"
                      value={formData.fullName || ""}
                      onChange={(e) =>
                        setFormData({ fullName: e.target.value })
                      }
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:border-blue-400 focus:bg-white transition-all shadow-sm hover:shadow-md"
                    />
                  </div>
                </div>
              )}

              {/* Email field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:border-blue-400 focus:bg-white transition-all shadow-sm hover:shadow-md"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white"
                >
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:border-blue-400 focus:bg-white transition-all shadow-sm hover:shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors p-1.5 rounded hover:bg-blue-50"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password field (signup only) */}
              {isSignUp && (
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-white"
                  >
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword || ""}
                      onChange={(e) =>
                        setFormData({ confirmPassword: e.target.value })
                      }
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:border-blue-400 focus:bg-white transition-all shadow-sm hover:shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors p-1.5 rounded hover:bg-blue-50"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Remember me & Forgot password (signin only) */}
              {!isSignUp && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-white group-hover:text-white transition-colors">
                      Remember me
                    </span>
                  </label>
                  <a
                    href="#"
                    className="text-sm text-white hover:text-blue-300 transition-all duration-200 relative group"
                  >
                    Forgot password?
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                  </a>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading || !isFormValid}
                className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:via-blue-600 hover:to-cyan-600 active:shadow-inner active:scale-98 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 disabled:shadow-none"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 50 50">
                      <circle
                        className="opacity-30"
                        cx="25"
                        cy="25"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="5"
                        fill="none"
                      />
                      <circle
                        className="opacity-100"
                        cx="25"
                        cy="25"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="5"
                        fill="none"
                        strokeDasharray="100"
                        strokeDashoffset="75"
                      />
                    </svg>
                    {isSignUp ? "Creating account..." : "Signing in..."}
                  </>
                ) : (
                  <>
                    {isSignUp ? "Create Account" : "Sign in to ACES"}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/98 text-slate-500">or continue with</span>
              </div>
            </div>

            {/* Google Sign-in Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-white hover:bg-slate-50 active:scale-98 text-slate-900 font-semibold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-md hover:shadow-lg border border-slate-200"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Toggle between signin and signup */}
            <div className="text-center text-sm text-white">
              <p>
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <button
                  type="button"
                  onClick={handleModeToggle}
                  className="text-white hover:text-blue-300 transition-all duration-200 relative group font-medium"
                >
                  {isSignUp ? "Sign in" : "Create one"}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
