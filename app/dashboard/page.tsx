"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Zap,
  Check,
  Sparkles,
  RefreshCw,
  Globe,
  Plus,
  ArrowUpRight,
  FileText,
  Copy,
  CheckCircle2,
  Lock,
  Download,
  BarChart3,
  Search,
  ExternalLink,
} from "lucide-react";
import { runComplianceScan, ScanReport } from "@/lib/scanner-orchestrator";

interface RecentScanItem {
  id: string;
  productName: string;
  platform: "Meta Ads" | "Google Ads" | "TikTok Ads";
  adHeadline: string;
  adPrimaryText: string;
  landingUrl: string;
  score: number;
  statusBadge: "🟢 Low Risk" | "🟡 Medium" | "🔴 High Risk";
  badgeColor: string;
  issuesCount: number;
  scannedAt: string;
  saferHeadline: string;
  saferPrimaryText: string;
}

const INITIAL_RECENT_SCANS: RecentScanItem[] = [
  {
    id: "scan-01",
    productName: "Product A — Productivity SaaS Suite",
    platform: "Meta Ads",
    adHeadline: "The Modern Operating System for Teams",
    adPrimaryText: "Streamline workflows and empower your employees with automated scheduling tools.",
    landingUrl: "https://getproducta.io/suite-demo",
    score: 92,
    statusBadge: "🟢 Low Risk",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    issuesCount: 0,
    scannedAt: "Today, 14:20",
    saferHeadline: "The Modern Operating System for Teams",
    saferPrimaryText: "Streamline workflows and empower your employees with automated scheduling tools.",
  },
  {
    id: "scan-02",
    productName: "Product B — Ecom Cashflow Bootcamp",
    platform: "Google Ads",
    adHeadline: "Escape High Interest Debt Faster",
    adPrimaryText: "Are you struggling with credit card debt? Discover modern cash flow strategies to stabilize personal finances.",
    landingUrl: "https://financegrowthpath.com/guide",
    score: 67,
    statusBadge: "🟡 Medium",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    issuesCount: 2,
    scannedAt: "Yesterday, 19:45",
    saferHeadline: "A Structured Blueprint for Modern Cash Flow Planning",
    saferPrimaryText: "Explore verified financial frameworks that help individuals organize debt repayment with clarity.",
  },
  {
    id: "scan-03",
    productName: "Product C — Botanical Keto Capsules",
    platform: "Meta Ads",
    adHeadline: "Lose 20 Pounds in 10 Days Guaranteed",
    adPrimaryText: "Tired of stubborn belly fat? Melt fat overnight with doctor-approved miracle herbal capsules before it is banned!",
    landingUrl: "https://bit.ly/rapid-belly-burn",
    score: 41,
    statusBadge: "🔴 High Risk",
    badgeColor: "bg-red-500/10 text-red-400 border-red-500/30",
    issuesCount: 4,
    scannedAt: "Oct 04, 11:12",
    saferHeadline: "Physician-Formulated Botanical Nutrition for Daily Vitality",
    saferPrimaryText: "Support your natural metabolic health and daily energy with clean, plant-based botanical extracts.",
  },
];

export default function DashboardPage() {
  const [scansUsed, setScansUsed] = useState<number>(18);
  const [totalScansLimit] = useState<number>(100);
  const [recentScans, setRecentScans] = useState<RecentScanItem[]>(INITIAL_RECENT_SCANS);

  // New Scan Modal State
  const [showNewScanModal, setShowNewScanModal] = useState<boolean>(false);
  const [newPlatform, setNewPlatform] = useState<"meta" | "google" | "tiktok">("meta");
  const [newPrimaryText, setNewPrimaryText] = useState<string>("");
  const [newHeadline, setNewHeadline] = useState<string>("");
  const [newLandingUrl, setNewLandingUrl] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // View Scan Report Modal
  const [selectedScan, setSelectedScan] = useState<RecentScanItem | null>(null);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  const handleRunNewScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHeadline && !newPrimaryText) {
      alert("Please provide at least a Headline or Primary Text.");
      return;
    }

    setIsScanning(true);
    const report = await runComplianceScan({
      primaryText: newPrimaryText,
      headline: newHeadline,
      landingPageUrl: newLandingUrl,
      platform: newPlatform,
    });

    const newScanItem: RecentScanItem = {
      id: `scan-${Date.now()}`,
      productName: newHeadline.slice(0, 32) || "New Ad Campaign",
      platform: newPlatform === "meta" ? "Meta Ads" : newPlatform === "google" ? "Google Ads" : "TikTok Ads",
      adHeadline: newHeadline,
      adPrimaryText: newPrimaryText,
      landingUrl: newLandingUrl || "https://example.com/demo",
      score: report.complianceScore,
      statusBadge:
        report.complianceScore >= 80 ? "🟢 Low Risk" : report.complianceScore >= 55 ? "🟡 Medium" : "🔴 High Risk",
      badgeColor:
        report.complianceScore >= 80
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
          : report.complianceScore >= 55
          ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
          : "bg-red-500/10 text-red-400 border-red-500/30",
      issuesCount: report.totalIssuesCount,
      scannedAt: "Just now",
      saferHeadline: report.aiRewrite.saferHeadline,
      saferPrimaryText: report.aiRewrite.saferPrimaryText,
    };

    setRecentScans([newScanItem, ...recentScans]);
    setScansUsed((prev) => prev + 1);
    setIsScanning(false);
    setShowNewScanModal(false);
    setSelectedScan(newScanItem);

    // Reset form
    setNewHeadline("");
    setNewPrimaryText("");
    setNewLandingUrl("");
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-white/5 bg-[#090d16]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-400 to-cyan-400 flex items-center justify-center text-black font-extrabold shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <ShieldCheck className="w-5 h-5 text-black stroke-[2.5]" />
              </div>
              <div>
                <span className="font-extrabold text-base text-white tracking-tight">
                  AdShield <span className="text-emerald-400">AI</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                  Pro Workspace
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Scans Used Counter */}
            <div className="flex items-center gap-2 bg-zinc-900 border border-white/10 px-3 py-1.5 rounded-xl text-xs">
              <span className="text-zinc-400 font-medium">Scans Used:</span>
              <span className="font-mono font-bold text-white">
                <strong className="text-emerald-400">{scansUsed}</strong> / {totalScansLimit}
              </span>
            </div>

            <button
              onClick={() => setShowNewScanModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 text-black stroke-[3]" />
              + New Scan
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full flex flex-col gap-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0c101c] border border-white/5 flex flex-col justify-between">
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Monthly Credits</span>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white font-mono">{scansUsed}</span>
              <span className="text-xs text-zinc-500 font-mono">/ {totalScansLimit} used</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full"
                style={{ width: `${(scansUsed / totalScansLimit) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c101c] border border-white/5 flex flex-col justify-between">
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Avg Compliance Score</span>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-400 font-mono">82%</span>
              <span className="text-xs text-emerald-400 font-semibold">● Good Health</span>
            </div>
            <span className="text-[11px] text-zinc-500">Based on past 30 days audits</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c101c] border border-white/5 flex flex-col justify-between">
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Policy Violations Stopped</span>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white font-mono">6 Ads</span>
              <span className="text-xs text-amber-400 font-semibold">Protected</span>
            </div>
            <span className="text-[11px] text-zinc-500">Prevented ad account score drops</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c101c] border border-white/5 flex flex-col justify-between">
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Active Platforms</span>
            <div className="my-2 flex items-center gap-3">
              <span className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-200 font-semibold">Meta (12)</span>
              <span className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-200 font-semibold">Google (6)</span>
            </div>
            <span className="text-[11px] text-zinc-500">TikTok Engine enabled</span>
          </div>
        </div>

        {/* Recent Scans Section */}
        <div className="p-6 rounded-3xl bg-[#0c101c] border border-white/5 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-white">Recent Ad Compliance Scans</h2>
              <p className="text-xs text-zinc-400">Click any row to inspect policy violations, rewrites, and destination crawl</p>
            </div>

            <button
              onClick={() => setShowNewScanModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.25)] w-fit"
            >
              <Plus className="w-4 h-4 text-black stroke-[3]" />
              + New Scan
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-zinc-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-semibold">Campaign / Product</th>
                  <th className="pb-3 font-semibold">Platform</th>
                  <th className="pb-3 font-semibold">Compliance Score</th>
                  <th className="pb-3 font-semibold">Risk Level</th>
                  <th className="pb-3 font-semibold">Issues</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentScans.map((scan) => (
                  <tr
                    key={scan.id}
                    onClick={() => setSelectedScan(scan)}
                    className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                  >
                    <td className="py-4 pr-4">
                      <p className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {scan.productName}
                      </p>
                      <p className="text-[11px] text-zinc-500 truncate max-w-xs">{scan.adHeadline}</p>
                    </td>
                    <td className="py-4 pr-4 text-zinc-300 font-medium">{scan.platform}</td>
                    <td className="py-4 pr-4">
                      <span className="font-mono font-bold text-white text-sm">{scan.score}</span>
                      <span className="text-zinc-500 font-mono text-[10px]"> / 100</span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${scan.badgeColor}`}>
                        {scan.statusBadge}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-zinc-400">
                      {scan.issuesCount === 0 ? "0 issues" : `${scan.issuesCount} triggers`}
                    </td>
                    <td className="py-4 pr-4 text-zinc-500 text-[11px]">{scan.scannedAt}</td>
                    <td className="py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedScan(scan);
                        }}
                        className="text-emerald-400 hover:text-emerald-300 text-xs font-bold"
                      >
                        View Report →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL 1: Run + New Scan */}
      {showNewScanModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-xl w-full p-6 md:p-8 rounded-3xl bg-[#0c101c] border border-white/10 relative flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="text-lg font-black text-white">Run New Pre-Flight Ad Scan</h3>
                <p className="text-xs text-zinc-400">Deducts 1 credit from your monthly allowance</p>
              </div>
              <button
                onClick={() => setShowNewScanModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-900 border border-white/5 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRunNewScan} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Target Ad Platform</label>
                <div className="grid grid-cols-3 gap-2 bg-zinc-900 p-1 rounded-xl border border-white/5">
                  {(["meta", "google", "tiktok"] as const).map((plat) => (
                    <button
                      type="button"
                      key={plat}
                      onClick={() => setNewPlatform(plat)}
                      className={`py-1.5 rounded-lg font-bold capitalize transition-all ${
                        newPlatform === plat ? "bg-emerald-400 text-black" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {plat === "meta" ? "Facebook/IG" : plat === "google" ? "Google Ads" : "TikTok"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Ad Headline</label>
                <input
                  type="text"
                  required
                  value={newHeadline}
                  onChange={(e) => setNewHeadline(e.target.value)}
                  placeholder="e.g. Lose 20 Pounds In 10 Days Guaranteed"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Primary Text (Body Copy)</label>
                <textarea
                  rows={4}
                  required
                  value={newPrimaryText}
                  onChange={(e) => setNewPrimaryText(e.target.value)}
                  placeholder="Paste ad body copy to evaluate against advertising policies..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-400 leading-relaxed font-sans"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Destination Landing Page URL</label>
                <input
                  type="url"
                  value={newLandingUrl}
                  onChange={(e) => setNewLandingUrl(e.target.value)}
                  placeholder="https://example.com/landing-page"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <button
                type="submit"
                disabled={isScanning}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] mt-2"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    Evaluating Policy Rules & Destination...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-black text-black" />
                    Run Compliance Scan (-1 Credit)
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: View Full Scan Report & AI Rewrite */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full p-6 md:p-8 rounded-3xl bg-[#0c101c] border border-white/10 relative flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-400 block">
                  Audit Report #{selectedScan.id}
                </span>
                <h3 className="text-xl font-black text-white">{selectedScan.productName}</h3>
              </div>
              <button
                onClick={() => setSelectedScan(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-900 border border-white/5 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Score Banner */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-400 block">Compliance Health</span>
                <span className="text-3xl font-black text-white font-mono">{selectedScan.score}</span>
                <span className="text-zinc-500 font-mono text-xs"> / 100</span>
              </div>
              <span className={`text-xs font-black px-3 py-1.5 rounded-xl border ${selectedScan.badgeColor}`}>
                {selectedScan.statusBadge}
              </span>
            </div>

            {/* Original Copy Checked */}
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-white/5 text-xs flex flex-col gap-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Ad Copy Analyzed:</span>
              <p className="font-bold text-white">{selectedScan.adHeadline}</p>
              <p className="text-zinc-300 leading-relaxed">{selectedScan.adPrimaryText}</p>
              <p className="text-[11px] text-zinc-500 font-mono">Destination: {selectedScan.landingUrl}</p>
            </div>

            {/* AI Recommended Rewrite */}
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  AI Compliant Safe Rewrite
                </span>
                <button
                  onClick={() =>
                    handleCopy(`Headline: ${selectedScan.saferHeadline}\n\nPrimary Text:\n${selectedScan.saferPrimaryText}`)
                  }
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  {copiedText ? "Copied!" : "Copy"}
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/20">
                <p className="font-bold text-emerald-300 mb-1">{selectedScan.saferHeadline}</p>
                <p className="text-zinc-200 leading-relaxed">{selectedScan.saferPrimaryText}</p>
              </div>

              <div className="text-[11px] text-zinc-400 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Marketing intent and conversion hook preserved without triggering policy ban filters.</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/5">
              <button
                onClick={() => alert("Downloading PDF Compliance Audit Certificate...")}
                className="px-4 py-2 rounded-xl border border-white/10 hover:border-zinc-600 text-xs font-bold text-zinc-300 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
              <button
                onClick={() => setSelectedScan(null)}
                className="px-4 py-2 rounded-xl bg-emerald-400 text-black text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
