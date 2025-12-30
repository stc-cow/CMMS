import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // For demo purposes, allow any email/password
    if (email && password) {
      navigate("/");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Main container */}
      <div className="relative w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding and features */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 text-white">
          {/* ACES Logo */}
          <div className="flex items-center gap-4">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fabc8ab05f7d144f289a582747d3e5ca3%2F2884fc9a1a5d47faad23fb841f7538d3?format=webp&width=400"
              alt="ACES Managed Services"
              className="h-40 w-auto"
            />
          </div>

          {/* Tagline */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold leading-tight">
              Equipment Operations <span className="text-cyan-400">Simplified</span>
            </h1>
          </div>

          {/* Footer text */}
          <div className="pt-12 border-t border-blue-500/30">
            <p className="text-sm text-blue-200">
              © 2024 ACES - Advanced COW Equipment System. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-10 space-y-8 border border-white/20">
            {/* Mobile ACES Logo */}
            <div className="lg:hidden flex items-center justify-center pb-4 border-b border-slate-200">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fabc8ab05f7d144f289a582747d3e5ca3%2F2884fc9a1a5d47faad23fb841f7538d3?format=webp&width=400"
                alt="ACES Managed Services"
                className="h-28 w-auto"
              />
            </div>

            {/* Form title */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
              <p className="text-slate-600">Sign in to your ACES account to manage your operations</p>
            </div>

            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-900">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-900">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                    Remember me
                  </span>
                </label>
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 50 50"
                    >
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
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to ACES
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Demo account</span>
              </div>
            </div>

            {/* Demo credentials */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <p className="text-xs font-semibold text-blue-900">Demo Credentials:</p>
              <div className="text-xs text-blue-800 space-y-1">
                <p><span className="font-medium">Email:</span> demo@aces.com</p>
                <p><span className="font-medium">Password:</span> any password</p>
              </div>
            </div>

            {/* Help text */}
            <div className="text-center text-sm text-slate-600">
              <p>
                Don't have an account?{" "}
                <a
                  href="#"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Contact your administrator
                </a>
              </p>
            </div>

            {/* Security note */}
            <div className="border-t border-slate-200 pt-6">
              <p className="text-xs text-slate-500 text-center">
                🔒 Your login credentials are encrypted and secure. ACES systems comply with enterprise security standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
