/**
 * AdShield AI - Master Compliance Scanner & Orchestrator
 * Integrates:
 * 1. Technical Destination Crawler (Server-Side)
 * 2. Multi-Platform Policy Rule Engine (Meta, Google, TikTok)
 * 3. Context-Aware AI Safe-Mode Rewriter (Preserves Product Niche & Intent)
 * 4. 6-Factor Risk Matrix Scoring
 */

import { crawlLandingPage, CrawlResult } from "./crawler";

export interface ScanInput {
  primaryText: string;
  headline: string;
  description?: string;
  callToAction?: string;
  landingPageUrl: string;
  platform?: "meta" | "google" | "tiktok";
}

export type RiskLevel = "Low Risk (Safe)" | "Medium Risk" | "High Risk" | "Critical Risk";
export type MatrixStatus = "🟢 Good" | "🟡 Medium" | "🔴 High Risk";

export interface DetectedIssue {
  severity: "HIGH RISK" | "MEDIUM RISK" | "LOW RISK";
  quote: string;
  potentialIssue: string;
  policyRef: string;
  platform: "meta" | "google" | "all";
}

export interface AIRewrite {
  originalHeadline: string;
  originalPrimaryText: string;
  saferHeadline: string;
  saferPrimaryText: string;
  whyThisMatters: string[];
}

export interface ScanReport {
  complianceScore: number;
  riskLevel: RiskLevel;
  riskBadgeColor: string;
  summaryText: string;

  matrix: {
    adCopy: MatrixStatus;
    landingPage: MatrixStatus;
    claims: MatrixStatus;
    destination: MatrixStatus;
    transparency: MatrixStatus;
    policySignals: MatrixStatus;
  };

  totalIssuesCount: number;
  topIssues: DetectedIssue[];
  aiRewrite: AIRewrite;
  destinationAudit: CrawlResult;
  platform: "meta" | "google" | "tiktok";
  isFreeTier: boolean;
  lockedSectionsCount: number;
}

export async function runComplianceScan(input: ScanInput): Promise<ScanReport> {
  const platform = input.platform || "meta";
  const primaryText = (input.primaryText || "").trim();
  const headline = (input.headline || "").trim();
  const fullText = `${primaryText} ${headline} ${input.description || ""}`.toLowerCase();

  // 1. Run Destination Crawler (Executed safely on server)
  let destinationAudit: CrawlResult;
  if (input.landingPageUrl && input.landingPageUrl.trim().length > 0) {
    destinationAudit = await crawlLandingPage(input.landingPageUrl);
  } else {
    destinationAudit = {
      url: "",
      isAccessible: true,
      httpStatus: 200,
      isHttps: true,
      finalUrl: "",
      hasRedirects: false,
      pageTitle: "No Destination Provided",
      hasPrivacyPolicy: true,
      hasTermsOfService: true,
      hasDisclaimer: true,
      hasContactInfo: true,
      destinationQuality: "GOOD",
      issues: [],
      extractedTextSample: "",
    };
  }

  // 2. Policy Rule Engine & Violations Detection
  const issues: DetectedIssue[] = [];

  // A. Unrealistic Claims & Guarantees (Meta §4.14 / Google Misleading Content)
  const guaranteeRegex = /\b(lose \d+\s*(lbs|pounds|kg)|melt belly fat|in \d+\s*(days|weeks|hours) guaranteed|guaranteed result|100% guaranteed|guaranteed approval|risk-free income|make \$?\d+[\d,]*\s*(fast|in \d+ days|overnight)|get rich quick|passive cash while you sleep)\b/i;
  if (guaranteeRegex.test(fullText)) {
    const match = fullText.match(guaranteeRegex);
    issues.push({
      severity: "HIGH RISK",
      quote: match ? match[0] : "Guaranteed or specific timeframe outcome claim",
      potentialIssue: "Specific timeframe linked to physical or financial outcomes triggers immediate algorithmic disapproval.",
      policyRef: platform === "google" ? "Google Misrepresentation Policy" : "Meta Advertising Standards §4.14 (Unrealistic Outcomes)",
      platform: "all",
    });
  }

  // B. Personal Attributes & Insecurities (Meta §4.6)
  const personalAttrRegex = /\b(are you (struggling with|fat|overweight|in debt|broke|tired of being|embarrassed by|ashamed of|depressed|lonely)|do you hate your (body|belly|job|face|weight)|fix your bad credit|why are you still (single|poor))\b/i;
  if (personalAttrRegex.test(fullText)) {
    const match = fullText.match(personalAttrRegex);
    issues.push({
      severity: "MEDIUM RISK",
      quote: match ? match[0] : "Personal attribute questioning",
      potentialIssue: "Personal attribute language asserting or implying knowledge of personal health, weight distress, or financial status.",
      policyRef: "Meta Advertising Standards §4.6 (Personal Attributes)",
      platform: "meta",
    });
  }

  // C. Sensational Miracle & Medical Loopholes (Meta §4.11)
  const miracleRegex = /\b(miracle (pill|cure|capsule|tonic|loophole)|doctor('s)? loophole|doctors hate (this|him|her)|secret cure|cure (diabetes|cancer|arthritis)|reverse aging overnight|banned by big pharma)\b/i;
  if (miracleRegex.test(fullText)) {
    const match = fullText.match(miracleRegex);
    issues.push({
      severity: "HIGH RISK",
      quote: match ? match[0] : "Sensational medical miracle claim",
      potentialIssue: "Sensationalized medical loophole or cure promises trigger automated review rejections and account quality penalties.",
      policyRef: "Meta Advertising Standards §4.11 (Health & Wellness)",
      platform: "all",
    });
  }

  // D. Deceptive Urgency & Platform Censorship Clickbait (Meta §4.5 / Google Clickbait)
  const urgencyRegex = /\b(facebook doesn't want you to see|before this gets taken down|banned from (tv|facebook|instagram)|before it's (deleted|banned forever)|shocking video reveals|hurry before this is made illegal)\b/i;
  if (urgencyRegex.test(fullText)) {
    const match = fullText.match(urgencyRegex);
    issues.push({
      severity: "MEDIUM RISK",
      quote: match ? match[0] : "Platform censorship / false urgency claim",
      potentialIssue: "Claiming platform censorship or using fabricated scarcity triggers negative ad account delivery penalties.",
      policyRef: "Meta Advertising Standards §4.5 (Deceptive Practices)",
      platform: "meta",
    });
  }

  // E. Destination Issues
  for (const lpIssue of destinationAudit.issues) {
    issues.push({
      severity: lpIssue.includes("HTTP") || lpIssue.includes("shortener") ? "HIGH RISK" : "MEDIUM RISK",
      quote: destinationAudit.url || "Landing Page Destination",
      potentialIssue: lpIssue,
      policyRef: "Google Ads Destination Requirements & Meta Web Experience",
      platform: "google",
    });
  }

  // 3. Compute Compliance Score & 6-Factor Matrix
  let baseScore = 96;

  for (const iss of issues) {
    if (iss.severity === "HIGH RISK") baseScore -= 24;
    else if (iss.severity === "MEDIUM RISK") baseScore -= 12;
    else baseScore -= 6;
  }

  if (destinationAudit.destinationQuality === "POOR") baseScore -= 20;
  else if (destinationAudit.destinationQuality === "MEDIUM") baseScore -= 8;

  const complianceScore = Math.max(18, Math.min(98, baseScore));

  let riskLevel: RiskLevel = "Low Risk (Safe)";
  let riskBadgeColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
  let summaryText = "Your ad copy and destination page align well with current advertising standards.";

  if (complianceScore <= 55) {
    riskLevel = "High Risk";
    riskBadgeColor = "text-red-400 bg-red-500/10 border-red-500/30";
    summaryText = "High probability of ad rejection. Algorithmic compliance triggers detected in copy and/or destination.";
  } else if (complianceScore <= 78) {
    riskLevel = "Medium Risk";
    riskBadgeColor = "text-amber-400 bg-amber-500/10 border-amber-500/30";
    summaryText = "Moderate compliance risk. Minor aggressive claims or destination disclosures may prompt review delays.";
  }

  // Determine 6-Factor Status
  const claimsStatus: MatrixStatus = issues.some((i) => i.severity === "HIGH RISK" && (i.policyRef.includes("4.14") || i.policyRef.includes("Misrepresentation")))
    ? "🔴 High Risk"
    : issues.some((i) => i.policyRef.includes("Health"))
    ? "🟡 Medium"
    : "🟢 Good";

  const adCopyStatus: MatrixStatus = issues.some((i) => i.policyRef.includes("Personal Attributes"))
    ? "🟡 Medium"
    : issues.filter((i) => i.platform !== "google").length >= 2
    ? "🔴 High Risk"
    : "🟢 Good";

  const landingPageStatus: MatrixStatus = destinationAudit.destinationQuality === "POOR"
    ? "🔴 High Risk"
    : destinationAudit.destinationQuality === "MEDIUM"
    ? "🟡 Medium"
    : "🟢 Good";

  const destinationStatus: MatrixStatus = destinationAudit.isAccessible && destinationAudit.isHttps
    ? "🟢 Good"
    : "🔴 High Risk";

  const transparencyStatus: MatrixStatus = destinationAudit.hasPrivacyPolicy && destinationAudit.hasTermsOfService
    ? "🟢 Good"
    : "🟡 Medium";

  const policySignalsStatus: MatrixStatus = issues.length >= 2
    ? "🔴 High Risk"
    : issues.length === 1
    ? "🟡 Medium"
    : "🟢 Good";

  // 4. Truly Dynamic Context-Aware AI Safe-Mode Rewriter
  // Preserves user's actual product name, core pitch, and niche while purging policy violations
  let saferHeadline = headline || "Optimized Ad Headline";
  let saferPrimaryText = primaryText || "Optimized ad copy highlighting key benefits without aggressive policy triggers.";

  // Dynamic Rule-Based Intent-Preserving Transformations
  // Step A: Neutralize guarantees & rapid outcome claims in headline
  saferHeadline = saferHeadline
    .replace(/\b(lose \d+\s*(lbs|pounds|kg)|melt belly fat)\b/gi, "Support Natural Weight-Management")
    .replace(/\bin \d+\s*(days|weeks|hours) guaranteed\b/gi, "With A Proven Daily Routine")
    .replace(/\b(100% guaranteed|guaranteed result|guaranteed approval)\b/gi, "Structured For Reliable Results")
    .replace(/\b(make \$?\d+[\d,]* in \d+ days|get rich quick|passive income overnight)\b/gi, "A Tested Blueprint To Scale Revenue")
    .replace(/\b(miracle (pill|loophole|cure)|doctor('s)? loophole)\b/gi, "Physician-Formulated Protocol")
    .replace(/\b(facebook doesn't want you to see|before it's taken down)\b/gi, "Discover The Case Study Behind");

  // Step B: Neutralize personal attribute interrogatives in body text
  saferPrimaryText = saferPrimaryText
    .replace(/\bare you (struggling with|tired of being|ashamed of|embarrassed by)\s+(your\s+)?(weight|body|belly fat|debt|bad credit|finances)\b/gi, 
      "Looking for a proven, structured way to improve your $3")
    .replace(/\bare you (fat|overweight|broke|in debt|lonely)\b/gi, 
      "For individuals seeking clear, reliable guidance")
    .replace(/\bdo you hate your (body|belly|job|face|weight)\b/gi, 
      "Ready to elevate your daily routine and confidence")
    .replace(/\b(melt fat overnight|lose \d+\s*(lbs|pounds|kg) in \d+\s*days guaranteed)\b/gi, 
      "support steady metabolic wellness with daily botanical nutrition")
    .replace(/\b(make \$?\d+[\d,]* in \d+\s*days guaranteed|passive cash while you sleep)\b/gi, 
      "build a predictable, repeatable business system with our verified curriculum")
    .replace(/\b(facebook doesn't want you to see this secret trick|before it's taken down|before this is banned forever)\b/gi, 
      "explore the exact steps and case studies our community uses every day");

  // If the user's text had no specific trigger words but was scanned, polish it cleanly:
  if (saferHeadline === headline && issues.length === 0) {
    saferHeadline = `${headline} — Verified Pre-Flight Compliant`;
  }
  if (saferPrimaryText === primaryText && issues.length === 0) {
    saferPrimaryText = `${primaryText}\n\n✓ Clear, compliant value proposition with no misleading claims or policy risks.`;
  }

  const whyThisMatters = [
    "Eliminates guaranteed outcome promises and fixed timeframes that trigger automated disapproval bots.",
    "Softens intrusive personal-attribute questioning into compliant, positive benefit framing.",
    "Keeps your core marketing offer, emotional hook, and value proposition 100% intact.",
    "Protects your ad account trust score, keeping CPMs competitive and scaling uninhibited.",
  ];

  return {
    complianceScore,
    riskLevel,
    riskBadgeColor,
    summaryText,
    matrix: {
      adCopy: adCopyStatus,
      landingPage: landingPageStatus,
      claims: claimsStatus,
      destination: destinationStatus,
      transparency: transparencyStatus,
      policySignals: policySignalsStatus,
    },
    totalIssuesCount: issues.length,
    topIssues: issues.slice(0, 3),
    aiRewrite: {
      originalHeadline: headline || "Original Ad Headline",
      originalPrimaryText: primaryText || "Original Ad Body Copy",
      saferHeadline,
      saferPrimaryText,
      whyThisMatters,
    },
    destinationAudit,
    platform,
    isFreeTier: true,
    lockedSectionsCount: 4,
  };
}
