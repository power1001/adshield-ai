"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate login & session storage
    setTimeout(() => {
      if (!email.includes("@")) {
        setError("Please enter a valid business email address.");
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        setIsLoading(false);
        return;
      }

      // Store simulated user session
      if (typeof window !== "undefined") {
        localStorage.setItem("adshield_user", JSON.stringify({ email, isLoggedIn: true }));
      }

      router.push("/dashboard");
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#0c101c] border border-white/10 shadow-2xl relative z-10 flex flex-col gap-6">
        {/* Logo & Header */}
        <div className="text-center flex flex-col items-center">
          <Link href="/" className="flex items-center gap-2.5 mb-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-400 to-cyan-400 flex items-center justify-center text-black font-extrabold shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <ShieldCheck className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">
              AdShield <span className="text-emerald-400">AI</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black text-white">Welcome Back</h1>
          <p className="text-xs text-zinc-400 mt-1">Sign in to access your pre-flight scans and credit allowance</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4 text-xs">
          <div>
            <label className="text-zinc-300 font-semibold block mb-1.5">Business Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 pl-10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
              />
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-zinc-300 font-semibold">Password</label>
              <a href="#" className="text-emerald-400 hover:underline text-[11px]">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 pl-10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
              />
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-black font-extrabold text-xs md:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all mt-2"
          >
            {isLoading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Or continue with</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        {/* Google OAuth Button */}
        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              localStorage.setItem("adshield_user", JSON.stringify({ email: "google-user@gmail.com", isLoggedIn: true }));
            }
            router.push("/dashboard");
          }}
          className="w-full py-2.5 rounded-xl border border-white/10 hover:border-zinc-700 bg-zinc-900 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Footer Link */}
        <p className="text-center text-xs text-zinc-400">
          Don't have an account?{" "}
          <Link href="/signup" className="text-emerald-400 font-bold hover:underline">
            Sign Up Free
          </Link>
        </p>
      </div>
    </div>
  );
}
