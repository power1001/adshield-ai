"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, User, Building, ArrowRight, Check, AlertCircle } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      if (!name.trim()) {
        setError("Please enter your full name.");
        setIsLoading(false);
        return;
      }
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

      // Store new user session with free credit
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "adshield_user",
          JSON.stringify({
            name,
            email,
            company: company || "Independent Marketer",
            plan: "Free Starter",
            scansRemaining: 1,
            isLoggedIn: true,
          })
        );
      }

      router.push("/dashboard");
    }, 750);
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
          <h1 className="text-2xl font-black text-white">Create Your Account</h1>
          <p className="text-xs text-zinc-400 mt-1">Get instant access to pre-flight compliance scanning</p>
        </div>

        {/* Benefits checklist */}
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1.5 text-[11px] text-zinc-300">
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>1 Complete Free Pre-Flight Scan Included</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>Full Destination SSL & Policy Disclosures Crawler</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>No credit card required to start</span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignUp} className="flex flex-col gap-3.5 text-xs">
          <div>
            <label className="text-zinc-300 font-semibold block mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 pl-10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
              />
              <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-zinc-300 font-semibold block mb-1">Business Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@agency.com"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 pl-10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
              />
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-zinc-300 font-semibold block mb-1">Password</label>
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

          <div>
            <label className="text-zinc-400 font-semibold block mb-1">Company / Agency (Optional)</label>
            <div className="relative">
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Apex Media LLC"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 pl-10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
              />
              <Building className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-black font-extrabold text-xs md:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all mt-2"
          >
            {isLoading ? (
              <span>Creating Workspace...</span>
            ) : (
              <>
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-400 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
