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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,.03)_10px,rgba(255,255,255,.03)_20px)] pointer-events-none"></div>
      {/* Animated background elements with enhanced depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        {/* Radial light source behind card */}
        <div className="absolute right-1/4 top-1/3 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main container */}
      <div className="relative w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding and features */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 text-white">
          {/* ACES Logo with accent line */}
          <div className="flex flex-col items-start gap-4">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fabc8ab05f7d144f289a582747d3e5ca3%2F2884fc9a1a5d47faad23fb841f7538d3?format=webp&width=400"
              alt="ACES Managed Services"
              className="h-40 w-auto"
            />
            {/* Brand accent line */}
            <div className="w-12 h-1 bg-gradient-to-r from-red-500 to-transparent rounded-full"></div>
          </div>

          {/* Tagline with refined typography */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold leading-snug">
              <p>
                <strong>COW Movement Management System </strong>
                <span className="text-3xl font-light opacity-70">CMMS</span>
              </p>
            </h1>
          </div>

          {/* Footer text with reduced opacity */}
          <div className="pt-12 border-t border-blue-500/20 opacity-60">
            <h2 className="text-sm">
              <span style={{ color: "rgb(155, 155, 155)" }}>Powered by</span>{" "}
              <strong style={{ color: "rgb(239, 55, 75)" }}>ACES MSD</strong>
            </h2>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full max-w-md mx-auto lg:mb-0 mb-4">
          <div className="bg-white/98 backdrop-blur-xl rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] p-8 md:p-10 space-y-8 border border-white/30">
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
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:border-blue-400 focus:bg-white transition-all shadow-sm hover:shadow-md"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-900">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:border-blue-400 focus:bg-white transition-all shadow-sm hover:shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors p-1.5 rounded hover:bg-blue-50"
                    aria-label={showPassword ? "Hide password" : "Show password"}
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
                  className="text-sm text-slate-500 hover:text-blue-600 transition-all duration-200 relative group"
                >
                  Forgot password?
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </a>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:via-blue-600 hover:to-cyan-600 active:shadow-inner active:scale-98 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 disabled:shadow-none"
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

            {/* Divider with subtle styling */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
            </div>


            {/* Help text with reduced visual weight */}
            <div className="text-center text-sm text-slate-500">
              <p>
                Don't have an account?{" "}
                <a
                  href="#"
                  className="text-slate-600 hover:text-blue-600 transition-all duration-200 relative group font-medium"
                >
                  Contact your administrator
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </a>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
