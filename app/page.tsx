"use client";

import React, { useState } from "react";
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

    setTimeout(async () => {
      const res = await runComplianceScan({
        primaryText,
        headline,
        description,
        callToAction: cta,
        landingPageUrl,
        platform,
      });
      setScanReport(res);
      setIsScanning(false);

      // Scroll to results smoothly
      const resultsElem = document.getElementById("scan-results-view");
      if (resultsElem) {
        resultsElem.scrollIntoView({ behavior: "smooth" });
      }
    }, 1800);
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
              Free Ad Checker
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing Plans
            </a>
            <Link href="/dashboard" className="text-emerald-400 hover:text-emerald-300 font-bold">
              User Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-3">
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
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Live Free Checker */}
      <section id="free-checker" className="py-12 md:py-16 px-6 max-w-5xl mx-auto w-full text-center">
        {/* Compliance Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Pre-Flight Ad Compliance & Destination Auditor
        </div>

        {/* Headline */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-3xl mx-auto">
          Check Your Ad Before <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            You Hit Publish
          </span>
        </h1>

        {/* Subtitle strictly following non-guarantee compliant marketing guideline */}
        <p className="mt-4 text-sm md:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Reduce the risk of ad disapprovals and account penalties with AI-powered compliance checks for Meta & Google Ads.
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input 1: Ad Copy */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" /> 1. Ad Copy
                </label>
                <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-white/5 text-[11px]">
                  {(["meta", "google", "tiktok"] as const).map((plat) => (
                    <button
                      key={plat}
                      onClick={() => setPlatform(plat)}
                      className={`px-2 py-0.5 rounded font-bold capitalize transition-all ${
                        platform === plat ? "bg-emerald-400 text-black" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {plat === "meta" ? "Facebook" : plat === "google" ? "Google" : "TikTok"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Text */}
              <div>
                <span className="text-[11px] text-zinc-400 block mb-1">Primary Text (Body Copy)</span>
                <textarea
                  value={primaryText}
                  onChange={(e) => setPrimaryText(e.target.value)}
                  rows={4}
                  placeholder="Paste your ad body copy here..."
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 leading-relaxed font-sans"
                />
              </div>

              {/* Headline */}
              <div>
                <span className="text-[11px] text-zinc-400 block mb-1">Ad Headline</span>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Enter your ad headline..."
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Description & CTA */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[11px] text-zinc-400 block mb-1">Description (Optional)</span>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short description..."
                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-zinc-400 block mb-1">Call To Action (CTA)</span>
                  <select
                    value={cta}
                    onChange={(e) => setCta(e.target.value)}
                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="Learn More">Learn More</option>
                    <option value="Order Now">Order Now</option>
                    <option value="Get Started">Get Started</option>
                    <option value="Sign Up">Sign Up</option>
                    <option value="Shop Now">Shop Now</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Input 2: Landing Page URL */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" /> 2. Destination Landing Page URL
              </label>

              <div>
                <span className="text-[11px] text-zinc-400 block mb-1">
                  Destination URL (Crawls SSL, disclosures, and redirect issues)
                </span>
                <input
                  type="url"
                  value={landingPageUrl}
                  onChange={(e) => setLandingPageUrl(e.target.value)}
                  placeholder="https://example.com/landing-page"
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Real Crawler Explanation Card */}
              <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-white/5 text-xs text-zinc-400 flex flex-col gap-2 mt-auto">
                <p className="font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" /> Google & Meta Destination Requirements:
                </p>
                <p className="text-[11px] leading-relaxed">
                  Our crawler automatically tests: HTTP Status, HTTPS SSL, Privacy Policy & Terms of Service links,
                  aggressive countdown popups, and ad-to-page mismatch.
                </p>
                <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-mono">
                  <span>✓ 200 OK</span>
                  <span>✓ SSL Safe</span>
                  <span>✓ Privacy Check</span>
                  <span>✓ Cloak Detection</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleScanAd}
                disabled={isScanning}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.01] mt-auto"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    <span>{scanStep}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-black text-black" />
                    <span>SCAN MY AD — FREE</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SCAN RESULTS SECTION (Dynamically Loaded or Previewed) */}
      {scanReport && (
        <section id="scan-results-view" className="py-12 px-6 max-w-5xl mx-auto w-full">
          <div className="p-6 md:p-8 rounded-3xl bg-[#0c101c] border border-white/10 shadow-2xl flex flex-col gap-8">
            {/* Header: Score & Risk Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-zinc-400 block mb-1">
                  AdShield Pre-Flight Audit Result
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                  <span>Compliance Score:</span>
                  <span className="text-emerald-400 font-mono">{scanReport.complianceScore} / 100</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-1 max-w-xl">{scanReport.summaryText}</p>
              </div>

              <div className="sm:text-right">
                <span className={`inline-block px-3 py-1.5 rounded-xl border text-xs font-black ${scanReport.riskBadgeColor}`}>
                  {scanReport.riskLevel}
                </span>
                <p className="text-[11px] text-zinc-500 mt-1">Platform: {scanReport.platform.toUpperCase()} ADS</p>
              </div>
            </div>

            {/* 6-Factor Status Matrix Table */}
            <div>
              <h3 className="text-xs uppercase font-bold text-zinc-400 tracking-wider mb-3">
                Compliance Status Matrix (6 Technical Layers)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                {[
                  { name: "Ad Copy", status: scanReport.matrix.adCopy },
                  { name: "Landing Page", status: scanReport.matrix.landingPage },
                  { name: "Claims", status: scanReport.matrix.claims },
                  { name: "Destination", status: scanReport.matrix.destination },
                  { name: "Transparency", status: scanReport.matrix.transparency },
                  { name: "Policy Signals", status: scanReport.matrix.policySignals },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 flex flex-col gap-1">
                    <span className="text-[11px] text-zinc-400">{item.name}</span>
                    <span className="text-xs font-bold text-white font-mono">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Issues Detected */}
            {scanReport.topIssues.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Top Issues Detected ({scanReport.totalIssuesCount})
                  </h3>
                  <span className="text-[10px] text-zinc-500">Free audit reveals top 3 triggers</span>
                </div>

                <div className="space-y-3">
                  {scanReport.topIssues.map((issue, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-zinc-900/80 border border-white/5 flex flex-col gap-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                            issue.severity === "HIGH RISK"
                              ? "bg-red-500/10 text-red-400 border-red-500/30"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {issue.severity}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">{issue.policyRef}</span>
                      </div>
                      <p className="font-semibold text-white">
                        Triggered on: <span className="text-emerald-300">"{issue.quote}"</span>
                      </p>
                      <p className="text-zinc-400 text-[11px] leading-relaxed">{issue.potentialIssue}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* High-Value AI Recommended Rewrite (Solution) */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/30 flex flex-col gap-4">
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
              <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-3 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-black text-white">Unlock Your Complete Compliance Audit Report</h4>
                <p className="text-xs text-zinc-400 max-w-md mt-1 mb-4 leading-relaxed">
                  Includes full destination technical crawl, 5 additional AI copy variations, platform-by-platform rules,
                  and official compliance PDF certificate.
                </p>
                <button
                  onClick={() => setShowPricingModal(true)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-black font-extrabold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-105"
                >
                  Upgrade to Pro ($49/mo) — 100 Scans Included
                </button>
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

      {/* Architecture / How It Works */}
      <section id="how-it-works" className="py-16 px-6 max-w-5xl mx-auto w-full border-t border-white/5">
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider">
            Hybrid Scanning Technology
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mt-2">
            Not Just A Generic ChatGPT Prompt
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 mt-2 max-w-xl mx-auto">
            AdShield combines 3 distinct analytical layers to evaluate both ad creatives and destination experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0c101c] border border-white/5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-400/10 text-cyan-400 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-white text-base">Layer 1 — Technical Crawler</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Crawls destination URLs for HTTP 200 OK, HTTPS SSL, Privacy Policy links, cloaking redirects, and thin content.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c101c] border border-white/5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-white text-base">Layer 2 — Policy Rule Engine</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Evaluates copy against 100+ granular Advertising Standards: Personal Attributes, Miracle Health, and Unrealistic Outcomes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c101c] border border-white/5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-400/10 text-purple-400 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-white text-base">Layer 3 — AI Safe Rewriter</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Generates compliant alternatives that eliminate toxic ban triggers while preserving your conversion hook and marketing intent.
            </p>
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
            Protect Your Ad Spend & Accounts
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 mt-2">
            No unexpected billing. Monthly scan credits enforced directly from the backend.
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
                  <span>Scan History</span>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="mt-8 w-full py-2.5 rounded-xl border border-white/10 hover:border-zinc-600 text-white font-bold text-xs text-center transition-all"
            >
              Choose Starter
            </Link>
          </div>

          {/* Plan 2: Pro (Popular) */}
          <div className="p-6 rounded-3xl bg-[#0e1626] border border-emerald-400/40 flex flex-col justify-between relative shadow-[0_0_30px_rgba(16,185,129,0.15)]">
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
                  <span>Meta + Google Ads Checker</span>
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
                  <span>AI Rewrites & Marketing Intent Preserver</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Downloadable PDF Reports</span>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="mt-8 w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-black font-extrabold text-xs text-center transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              Choose Pro ($49/mo)
            </Link>
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
                  <span>Multiple Client Projects & Workspaces</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>White-Label Client Compliance Reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Meta + Google + TikTok Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>API Access for Batch Audits</span>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="mt-8 w-full py-2.5 rounded-xl border border-white/10 hover:border-zinc-600 text-white font-bold text-xs text-center transition-all"
            >
              Choose Agency
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-zinc-500">
        <p className="max-w-xl mx-auto leading-relaxed">
          © 2026 AdShield AI Technologies Inc. AdShield provides compliance insights based on publicly available platform
          advertising standards. Platform policy decisions are solely determined by Meta and Google.
        </p>
      </footer>
    </div>
  );
}
