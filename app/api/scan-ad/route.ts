import { NextRequest, NextResponse } from "next/server";
import { runComplianceScan, ScanInput } from "@/lib/scanner-orchestrator";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ScanInput;

    if (!body.primaryText && !body.headline && !body.landingPageUrl) {
      return NextResponse.json(
        { success: false, error: "Please provide ad copy or a destination landing page URL to scan." },
        { status: 400 }
      );
    }

    const report = await runComplianceScan(body);

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error: any) {
    console.error("Ad Compliance Scan Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to scan ad for compliance." },
      { status: 500 }
    );
  }
}
