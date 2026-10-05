import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const supabase = getServiceSupabase();

    let query = supabase.from("scans").select(`
      id,
      user_id,
      platform,
      ad_headline,
      ad_primary_text,
      landing_page_url,
      compliance_score,
      risk_level,
      summary_text,
      created_at,
      scan_violations (
        id,
        severity,
        quote,
        potential_issue,
        policy_ref
      ),
      ai_rewrites (
        id,
        safer_headline,
        safer_primary_text,
        why_this_matters
      )
    `).order("created_at", { ascending: false }).limit(20);

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data: scans, error } = await query;

    if (error) {
      console.error("Fetch scans error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Also fetch user subscription if userId is provided
    let subscription = null;
    if (userId) {
      const { data: subData } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .single();
      subscription = subData;
    }

    return NextResponse.json({
      success: true,
      scans: scans || [],
      subscription,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      platform = "meta",
      adHeadline,
      adPrimaryText,
      description,
      callToAction,
      landingPageUrl,
      complianceScore,
      riskLevel,
      summaryText,
      violations = [],
      aiRewrite,
    } = body;

    const supabase = getServiceSupabase();

    // 1. Insert scan record
    const { data: scan, error: scanError } = await supabase
      .from("scans")
      .insert({
        user_id: userId || null,
        platform,
        ad_headline: adHeadline || "Untitled Campaign",
        ad_primary_text: adPrimaryText || "",
        description: description || null,
        call_to_action: callToAction || null,
        landing_page_url: landingPageUrl || null,
        compliance_score: complianceScore,
        risk_level: riskLevel,
        summary_text: summaryText || null,
      })
      .select()
      .single();

    if (scanError || !scan) {
      console.error("Scan insert error:", scanError);
      return NextResponse.json({ success: false, error: scanError?.message || "Failed to save scan" }, { status: 500 });
    }

    // 2. Insert violations if any
    if (violations && violations.length > 0) {
      const violationsRows = violations.map((v: any) => ({
        scan_id: scan.id,
        severity: v.severity,
        quote: v.quote,
        potential_issue: v.potentialIssue,
        policy_ref: v.policyRef,
      }));
      await supabase.from("scan_violations").insert(violationsRows);
    }

    // 3. Insert AI rewrite if present
    if (aiRewrite) {
      await supabase.from("ai_rewrites").insert({
        scan_id: scan.id,
        safer_headline: aiRewrite.saferHeadline,
        safer_primary_text: aiRewrite.saferPrimaryText,
        why_this_matters: aiRewrite.whyThisMatters || [],
      });
    }

    // 4. Update user scan credits if userId provided
    if (userId) {
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("id, scans_used, scan_limit")
        .eq("user_id", userId)
        .single();

      if (sub) {
        await supabase
          .from("subscriptions")
          .update({ scans_used: sub.scans_used + 1 })
          .eq("id", sub.id);
      }
    }

    return NextResponse.json({
      success: true,
      scanId: scan.id,
      scan,
    });
  } catch (err: any) {
    console.error("Save scan error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
