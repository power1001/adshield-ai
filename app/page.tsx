"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Zap,
  Globe,
  Lock,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Check,
  RefreshCw,
  Copy,
  ExternalLink,
  Layers,
  FileText,
  Activity,
  UserCheck,
  TrendingDown,
  HelpCircle,
  Download,
  CreditCard,
  Building,
} from "lucide-react";
import { runComplianceScan, ScanReport } from "@/lib/scanner-orchestrator";

// Sample battle-tested presets for 1-click testing
const PRESET_SCENARIOS = [
  {
    name: "Weight Loss Supplement (Meta)",
    platform: "meta" as const,
    headline: "Doctor's Miracle Loophole Melts Belly Fat In 10 Days",
    primaryText:
      "Tired of being overweight and ashamed of your body? Lose 20 pounds in 10 days guaranteed with our doctor-formulated miracle capsule. Facebook doesn't want you to see this secret trick before it's taken down!",
    description: "100% Guaranteed Fast Weight Loss",
    cta: "Order Now",
    landingPageUrl: "https://example.com/diet-weightloss-offer",
  },
  {
    name: "High-Ticket E-commerce (Google/Meta)",
    platform: "meta" as const,
    headline: "Make $10,000 In 7 Days Guaranteed",
    primaryText:
      "Are you broke and can't pay your bills? Learn how to generate $10,000 in 7 days guaranteed with our automated dropshipping bot. 100% risk free passive income while you sleep.",
    description: "Automated E-commerce Passive Cash",
    cta: "Get Started",
    landingPageUrl: "https://bit.ly/automated-ecom-cash",
  },
  {
    name: "Clean SaaS Operating System (Compliant)",
    platform: "google" as const,
    headline: "The Modern Operating System for High-Growth Teams",
    primaryText:
      "Streamline internal collaboration and automate repetitive workflows. Discover how forward-thinking business owners optimize daily productivity with our verified software.",
    description: "Start your free 14-day trial. No credit card required.",
    cta: "Start Free Trial",
    landingPageUrl: "https://example.com/saas-platform-demo",
  },
];

export default function HomePage() {
  // Input Form State
  const [platform, setPlatform] = useState<"meta" | "google" | "tiktok">("meta");
  const [primaryText, setPrimaryText] = useState<string>(PRESET_SCENARIOS[0].primaryText);
  const [headline, setHeadline] = useState<string>(PRESET_SCENARIOS[0].headline);
  const [description, setDescription] = useState<string>(PRESET_SCENARIOS[0].description);
  const [cta, setCta] = useState<string>(PRESET_SCENARIOS[0].cta);
  const [landingPageUrl, setLandingPageUrl] = useState<string>(PRESET_SCENARIOS[0].landingPageUrl);

  // Scan Execution State
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>("Analyzing ad copy & destination...");
  const [scanReport, setScanReport] = useState<ScanReport | null>(null);

  // UI state
  const [copiedRewrite, setCopiedRewrite] = useState<boolean>(false);
  const [showPricingModal, setShowPricingModal] = useState<boolean>(false);
  const [selectedTier, setSelectedTier] = useState<"starter" | "pro" | "agency">("pro");
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);

  // User state
  const [user, setUser] = useState<{ email?: string; name?: string; isLoggedIn?: boolean } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("adshield_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Trigger Scan
  const handleScanAd = async () => {
    setIsScanning(true);
    setScanStep("1. Crawling destination landing page & SSL...");

    setTimeout(() => {
      setScanStep("2. Evaluating 30+ Meta & Google advertising standards...");
    }, 600);

    setTimeout(() => {
      setScanStep("3. Running AI claim detection & generating compliant rewrites...");
    }, 1200);

    try {
      const response = await fetch("/api/scan-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primaryText,
          headline,
          description,
          callToAction: cta,
          landingPageUrl,
          platform,
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        setScanReport(json.data);
        if (typeof window !== "undefined") {
          localStorage.setItem("adshield_pending_scan", JSON.stringify({ headline, primaryText, res: json.data }));
        }
      } else {
        alert(json.error || "Failed to scan ad. Please check inputs.");
      }
    } catch (err) {
      console.error("Scan API Error:", err);
      alert("Unable to reach scan engine. Please check your connection.");
    } finally {
      setIsScanning(false);
      setTimeout(() => {
        const resultsElem = document.getElementById("scan-results-view");
        if (resultsElem) {
          resultsElem.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    }
  };

  const handleLoadPreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    setPlatform(preset.platform);
    setHeadline(preset.headline);
    setPrimaryText(preset.primaryText);
    setDescription(preset.description);
    setCta(preset.cta);
    setLandingPageUrl(preset.landingPageUrl);
  };

  const handleCopyRewrite = () => {
    if (!scanReport) return;
    navigator.clipboard.writeText(
      `Headline: ${scanReport.aiRewrite.saferHeadline}\n\nPrimary Text:\n${scanReport.aiRewrite.saferPrimaryText}`
    );
    setCopiedRewrite(true);
    setTimeout(() => setCopiedRewrite(false), 2000);
  };

  const handleCheckout = async (tier: "starter" | "pro" | "agency") => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/create-stripe-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to create checkout session.");
      }
    } catch (e) {
      console.error(e);
      alert("Checkout error. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Navigation Bar */}
      <nav className="border-b border-white/5 bg-[#090d16]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-400 to-cyan-400 flex items-center justify-center text-black font-extrabold shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <ShieldCheck className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white">
                AdShield <span className="text-emerald-400">AI</span>
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-400">
            <a href="#free-checker" className="hover:text-white transition-colors">
              Free Ad Scanner
            </a>
            <a href="#roi-comparison" className="hover:text-white transition-colors">
              Why AdShield
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              Technology
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing Plans
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-3">
            {user?.isLoggedIn ? (
              <Link
                href="/dashboard"
                className="text-xs px-3.5 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all"
              >
                <span>Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs px-3.5 py-1.5 rounded-lg border border-white/10 hover:border-zinc-700 text-zinc-300 hover:text-white font-medium transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="text-xs px-3.5 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section with Live Free Checker */}
      <section id="free-checker" className="py-12 md:py-16 px-6 max-w-5xl mx-auto w-full text-center">
        {/* Compliance Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Pre-Flight Ad Compliance & Account Ban Protection
        </div>

        {/* Headline */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-3xl mx-auto">
          Check Your Ad Before <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            You Spend A Single Dollar
          </span>
        </h1>

        {/* Subtitle strictly following non-guarantee compliant marketing guideline */}
        <p className="mt-4 text-sm md:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Audit headlines, body copy, and destination landing pages against 100+ Meta & Google advertising policies.
          Get instant risk scores and high-converting safe rewrites.
        </p>

        {/* Interactive Free Ad Scanner Container */}
        <div className="mt-10 p-6 md:p-8 rounded-3xl bg-[#0c101c] border border-white/10 shadow-2xl text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Quick Demo Presets */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
            <span className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Test Realistic Scenarios:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_SCENARIOS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLoadPreset(p)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                    headline === p.headline
                      ? "border-emerald-400/50 bg-emerald-400/10 text-white"
                      : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Target Ad Platform */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-zinc-300 block mb-2">
              1. Select Platform Advertising Rules
            </label>
            <div className="grid grid-cols-3 gap-3 bg-zinc-900/80 p-1.5 rounded-2xl border border-white/5">
              {(["meta", "google", "tiktok"] as const).map((plat) => (
                <button
                  key={plat}
                  type="button"
                  onClick={() => setPlatform(plat)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all ${
                    platform === plat
                      ? "bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {plat === "meta" ? "Meta (FB & IG)" : plat === "google" ? "Google Ads" : "TikTok Ads"}
                </button>
              ))}
            </div>
          </div>

          {/* Inputs Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Ad Creative Inputs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-300">2. Ad Creative Copy</label>
                <span className="text-[11px] text-zinc-500">Evaluates personal attributes & claims</span>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Headline (e.g., Doctor's Miracle Loophole Melts Belly Fat)"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              <div>
                <textarea
                  rows={4}
                  placeholder="Primary Text / Ad Body Copy (e.g., Tired of being overweight? Lose 20 pounds in 10 days guaranteed...)"
                  value={primaryText}
                  onChange={(e) => setPrimaryText(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400 transition-colors leading-relaxed font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Description (Optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
                />
                <input
                  type="text"
                  placeholder="CTA (e.g., Order Now)"
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Right: Landing Page URL */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-zinc-300">
                    3. Destination Landing Page URL
                  </label>
                  <span className="text-[11px] text-zinc-500">Live SSL & Disclosures Audit</span>
                </div>

                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://example.com/landing-page"
                    value={landingPageUrl}
                    onChange={(e) => setLandingPageUrl(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 pl-9 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400 transition-colors font-mono"
                  />
                  <Globe className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
                </div>

                <div className="mt-4 p-4 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-2 text-xs text-zinc-400">
                  <div className="font-semibold text-zinc-300 text-[11px] uppercase tracking-wider mb-1">
                    What Our Crawler Verifies:
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>HTTP 200 OK & Valid SSL / HTTPS Status</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mandatory Privacy Policy & Terms Footer Links</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>No Suspicious Cloaking or Redirect Loops</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleScanAd}
                disabled={isScanning}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.35)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    <span>{scanStep}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-black text-black" />
                    <span>SCAN MY AD — FREE INSTANT AUDIT</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SCAN RESULTS PRESENTATION SECTION */}
      {scanReport && (
        <section id="scan-results-view" className="py-12 px-6 max-w-5xl mx-auto w-full">
          <div className="p-6 md:p-8 rounded-3xl bg-[#0c101c] border border-white/10 shadow-2xl space-y-8 relative overflow-hidden">
            {/* Top Score Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
              <div className="space-y-1">
                <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
                  Pre-Flight Compliance Audit Result
                </span>
                <h2 className="text-2xl font-black text-white">Overall Compliance Health</h2>
                <p className="text-xs text-zinc-400 max-w-lg leading-relaxed">
                  {scanReport.summaryText}
                </p>
              </div>

              <div className="flex items-center gap-4 bg-zinc-900/80 p-4 rounded-2xl border border-white/5">
                <div className="text-right">
                  <div className="text-4xl font-black font-mono text-white">
                    {scanReport.complianceScore}
                    <span className="text-zinc-500 text-base font-normal"> / 100</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-medium">Compliance Index</div>
                </div>
                <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${scanReport.riskBadgeColor}`}>
                  {scanReport.riskLevel}
                </div>
              </div>
            </div>

            {/* 6-Factor Status Matrix */}
            <div>
              <h3 className="text-xs uppercase font-extrabold text-zinc-400 tracking-wider mb-4">
                6-Factor Pre-Flight Status Matrix
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 text-center">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block mb-1">
                    Ad Copy
                  </span>
                  <span className="font-bold text-xs">{scanReport.matrix.adCopy}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 text-center">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block mb-1">
                    Landing Page
                  </span>
                  <span className="font-bold text-xs">{scanReport.matrix.landingPage}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 text-center">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block mb-1">
                    Claims / Promises
                  </span>
                  <span className="font-bold text-xs">{scanReport.matrix.claims}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 text-center">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block mb-1">
                    Destination SSL
                  </span>
                  <span className="font-bold text-xs">{scanReport.matrix.destination}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 text-center">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block mb-1">
                    Transparency
                  </span>
                  <span className="font-bold text-xs">{scanReport.matrix.transparency}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 text-center">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block mb-1">
                    Policy Signals
                  </span>
                  <span className="font-bold text-xs">{scanReport.matrix.policySignals}</span>
                </div>
              </div>
            </div>

            {/* Top Issues Detected */}
            {scanReport.topIssues.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase font-extrabold text-red-400 tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    Top Issues Detected ({scanReport.totalIssuesCount})
                  </h3>
                  <span className="text-[11px] text-zinc-500">Showing top triggers</span>
                </div>

                <div className="space-y-2">
                  {scanReport.topIssues.map((issue, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-red-400">"{issue.quote}"</span>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-300">
                          {issue.severity}
                        </span>
                      </div>
                      <p className="text-zinc-300">{issue.potentialIssue}</p>
                      <p className="text-[10px] text-zinc-500">Standard: {issue.policyRef}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Safe-Mode Rewrite */}
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs uppercase font-extrabold text-white tracking-wider">
                    AI Recommended Compliant Rewrite
                  </h3>
                </div>
                <button
                  onClick={handleCopyRewrite}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedRewrite ? "Copied to Clipboard!" : "Copy Safe Copy"}
                </button>
              </div>

              {/* Side-by-side or original vs safer comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/40 border border-red-500/20 text-xs">
                  <span className="text-[10px] font-bold uppercase text-red-400 block mb-1">
                    Original (High Policy Risk)
                  </span>
                  <p className="font-bold text-white mb-2">{scanReport.aiRewrite.originalHeadline}</p>
                  <p className="text-zinc-400 leading-relaxed">{scanReport.aiRewrite.originalPrimaryText}</p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-emerald-500/30 text-xs shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-1">
                    Safer Alternative (High Converting)
                  </span>
                  <p className="font-bold text-emerald-300 mb-2">{scanReport.aiRewrite.saferHeadline}</p>
                  <p className="text-zinc-200 leading-relaxed">{scanReport.aiRewrite.saferPrimaryText}</p>
                </div>
              </div>

              {/* Why This Matters Checklist */}
              <div className="pt-2 border-t border-white/5">
                <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block mb-2">
                  Why This Matters for Ad Delivery:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-400">
                  {scanReport.aiRewrite.whyThisMatters.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Locked Sections / Teaser for Free to Paid Funnel */}
            <div className="relative p-6 rounded-2xl bg-zinc-900/60 border border-white/10 overflow-hidden">
              <div className="absolute inset-0 bg-black/75 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-3 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-black text-white">Unlock Your Complete Compliance Audit Report</h4>
                <p className="text-xs text-zinc-400 max-w-md mt-1 mb-4 leading-relaxed">
                  Includes full destination technical crawl, 5 additional AI copy variations, platform-by-platform rules,
                  and official compliance PDF certificate.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setShowPricingModal(true)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-black font-extrabold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-105"
                  >
                    Upgrade to Pro ($49/mo) — 100 Scans Included
                  </button>
                  <Link
                    href="/signup"
                    className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs border border-white/10"
                  >
                    Save This Scan To Free Account
                  </Link>
                </div>
              </div>

              {/* Blurred Dummy Content in Background */}
              <div className="filter blur-sm select-none opacity-40 space-y-4">
                <div className="h-4 bg-zinc-700 rounded w-1/3" />
                <div className="h-20 bg-zinc-800 rounded" />
                <div className="h-4 bg-zinc-700 rounded w-1/4" />
                <div className="h-16 bg-zinc-800 rounded" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ROI & TRUE COST COMPARISON SECTION */}
      <section id="roi-comparison" className="py-16 px-6 max-w-5xl mx-auto w-full border-t border-white/5">
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-extrabold text-red-400 tracking-wider">
            The Reality of Media Buying in 2026
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mt-2">
            The True Cost Of A Banned Ad Account
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 mt-2 max-w-xl mx-auto">
            Meta & Google deploy aggressive automated bots that ban accounts with zero human warning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Without AdShield */}
          <div className="p-6 md:p-8 rounded-3xl bg-red-950/20 border border-red-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Without AdShield</span>
                <TrendingDown className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-xl font-black text-white">The Ban Spiral ($3,500+ Loss)</h3>
              <ul className="mt-4 space-y-3 text-xs text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span><strong>Ad Disapproved:</strong> Campaign stopped mid-scale during peak weekend revenue.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span><strong>Account Quality Drops:</strong> CPMs spike by 40-70% due to negative ad account trust score.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span><strong>Agency Client Lost:</strong> Unhappy client fires agency due to broken delivery and lost budget.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span><strong>Appeals Take 3–7 Days:</strong> Often rejected by offshore automated support loops.</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center text-xs font-bold text-red-300">
              Average Loss Per Disapproval: $1,200 – $5,000+
            </div>
          </div>

          {/* With AdShield AI */}
          <div className="p-6 md:p-8 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col justify-between shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">With AdShield AI</span>
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-xl font-black text-white">Pre-Flight Peace Of Mind ($19/mo)</h3>
              <ul className="mt-4 space-y-3 text-xs text-zinc-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>Instant 3-Layer Scan:</strong> Catch trigger words, fake urgency, and personal attributes in 2 seconds.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>AI Safe Rewrites:</strong> Keep your high-converting hook while eliminating toxic phrases.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>Landing Page Audit:</strong> Verify SSL, disclaimers, and privacy policy before submitting to review.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>White-Label PDF Certificates:</strong> Deliver certified compliance reports to agency clients.</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-xs font-bold text-emerald-300">
              Starts at only $19/mo (Less than 1 disapproved ad)
            </div>
          </div>
        </div>
      </section>

      {/* Credit-Based Monthly Pricing Section */}
      <section id="pricing" className="py-16 px-6 max-w-5xl mx-auto w-full border-t border-white/5">
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider">
            Predictable Credit-Based Plans
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mt-2">
            Select Your Compliance Protection Plan
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 mt-2">
            No long-term contracts. Cancel or upgrade anytime in 1 click.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Plan 1: Starter */}
          <div className="p-6 rounded-3xl bg-[#0c101c] border border-white/5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Starter</span>
              <div className="my-4 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">$19</span>
                <span className="text-xs text-zinc-400">/ month</span>
              </div>
              <p className="text-xs text-zinc-400 mb-6">For solopreneurs and media buyers launching 5–10 campaigns monthly.</p>

              <div className="space-y-3 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span><strong>25 scans</strong> / month</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Facebook & Instagram Ad Scanner</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Landing Page Technical Audit</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>AI Safe-Mode Rewrites</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Scan History in Supabase</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCheckout("starter")}
              disabled={checkoutLoading}
              className="mt-8 w-full py-2.5 rounded-xl border border-white/10 hover:border-zinc-500 text-white font-bold text-xs text-center transition-all"
            >
              Choose Starter ($19/mo)
            </button>
          </div>

          {/* Plan 2: Pro (Popular) */}
          <div className="p-6 rounded-3xl bg-[#0e1626] border-2 border-emerald-400/50 flex flex-col justify-between relative shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-400 text-black text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
              Most Popular
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Pro</span>
              <div className="my-4 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">$49</span>
                <span className="text-xs text-zinc-400">/ month</span>
              </div>
              <p className="text-xs text-zinc-400 mb-6">For scaling media buyers and performance marketing teams.</p>

              <div className="space-y-3 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span><strong>100 scans</strong> / month</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Meta + Google + TikTok Ads</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Full Landing-Page & Disclosures Audit</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Advanced Claim & Guarantee Detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>AI Rewrites & Intent Preserver</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Print & Download PDF Certificates</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCheckout("pro")}
              disabled={checkoutLoading}
              className="mt-8 w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-black font-extrabold text-xs text-center transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              Choose Pro ($49/mo)
            </button>
          </div>

          {/* Plan 3: Agency */}
          <div className="p-6 rounded-3xl bg-[#0c101c] border border-white/5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Agency</span>
              <div className="my-4 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">$99</span>
                <span className="text-xs text-zinc-400">/ month</span>
              </div>
              <p className="text-xs text-zinc-400 mb-6">For agencies managing multiple ad accounts and client deliverables.</p>

              <div className="space-y-3 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span><strong>300 scans</strong> / month</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>White-Label Client PDF Certificates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Meta + Google + TikTok Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Priority Crawler Speeds</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Team Seats (Up to 5 Media Buyers)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCheckout("agency")}
              disabled={checkoutLoading}
              className="mt-8 w-full py-2.5 rounded-xl border border-white/10 hover:border-zinc-500 text-white font-bold text-xs text-center transition-all"
            >
              Choose Agency ($99/mo)
            </button>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="py-16 px-6 max-w-4xl mx-auto w-full border-t border-white/5">
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider">FAQ</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-1">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-5 rounded-2xl bg-[#0c101c] border border-white/5">
            <h4 className="font-extrabold text-white text-sm mb-1.5 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              Does AdShield AI guarantee my ad will never be rejected?
            </h4>
            <p className="text-zinc-400 leading-relaxed">
              No service can guarantee 100% approval because platform algorithms and manual reviewers update their policies frequently.
              AdShield AI significantly reduces your risk by auditing your copy and landing page against known policy standards (Personal Attributes, Unrealistic Promises, False Urgency, Destination SSL, and Disclosures) before you submit your ad.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c101c] border border-white/5">
            <h4 className="font-extrabold text-white text-sm mb-1.5 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              How do monthly scan credits work?
            </h4>
            <p className="text-zinc-400 leading-relaxed">
              Each time you audit an ad copy or destination page, 1 scan credit is deducted. Starter plans include 25 scans, Pro includes 100 scans, and Agency includes 300 scans every month. You can upgrade anytime if your team scales ad volume.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c101c] border border-white/5">
            <h4 className="font-extrabold text-white text-sm mb-1.5 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              Can I generate client PDF compliance certificates?
            </h4>
            <p className="text-zinc-400 leading-relaxed">
              Yes! Pro and Agency subscribers can export clean, official Pre-Flight Compliance Certificates with unique verification IDs, 6-factor matrix breakdowns, and signed audit stamps to share with clients or compliance teams.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING CHECKOUT MODAL */}
      {showPricingModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-xl w-full p-6 md:p-8 rounded-3xl bg-[#0c101c] border border-white/10 relative flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-400">
                  Instant Plan Activation
                </span>
                <h3 className="text-xl font-black text-white">Unlock Full Compliance Reports</h3>
              </div>
              <button
                onClick={() => setShowPricingModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-900 border border-white/5 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {[
                { id: "starter", name: "Starter", price: "$19/mo", scans: "25 Scans / month" },
                { id: "pro", name: "Pro (Recommended)", price: "$49/mo", scans: "100 Scans + PDF Export" },
                { id: "agency", name: "Agency", price: "$99/mo", scans: "300 Scans + White Label" },
              ].map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id as any)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedTier === tier.id
                      ? "bg-emerald-500/10 border-emerald-400 text-white"
                      : "bg-zinc-900/50 border-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  <div>
                    <h5 className="font-extrabold text-sm text-white">{tier.name}</h5>
                    <p className="text-xs text-zinc-400">{tier.scans}</p>
                  </div>
                  <span className="text-base font-black text-emerald-400 font-mono">{tier.price}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleCheckout(selectedTier)}
              disabled={checkoutLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              {checkoutLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 text-black" />
                  <span>Activate {selectedTier.toUpperCase()} Plan</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-zinc-500">
        <p className="max-w-xl mx-auto leading-relaxed">
          © 2026 AdShield AI Technologies Inc. AdShield provides compliance insights based on publicly available platform
          advertising standards. Platform policy decisions are solely determined by Meta, Google, and TikTok.
        </p>
      </footer>
    </div>
  );
}
