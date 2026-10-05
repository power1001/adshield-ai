import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServiceSupabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2024-12-18.acacia" as any,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { tier = "pro", userId } = body;
    const origin = req.headers.get("origin") || "http://localhost:3000";

    const isLive = process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes("placeholder");

    // Tier details according to blueprint
    const tierConfig: Record<string, { price: number; scans: number; name: string }> = {
      starter: { price: 1900, scans: 25, name: "AdShield AI Starter ($19/mo)" },
      pro: { price: 4900, scans: 100, name: "AdShield AI Pro ($49/mo)" },
      agency: { price: 9900, scans: 300, name: "AdShield AI Agency ($99/mo)" },
    };

    const selectedTier = tierConfig[tier] || tierConfig.pro;

    // If Stripe key is simulated, upgrade the user's account in Supabase directly
    if (!isLive) {
      if (userId) {
        try {
          const supabase = getServiceSupabase();
          await supabase
            .from("subscriptions")
            .update({
              plan: tier,
              scan_limit: selectedTier.scans,
              status: "active",
            })
            .eq("user_id", userId);
        } catch (e) {
          console.warn("Could not update Supabase subscription in mock mode:", e);
        }
      }

      return NextResponse.json({
        success: true,
        url: `${origin}/dashboard?subscription=success&tier=${tier}&limit=${selectedTier.scans}`,
        isSimulated: true,
        planName: selectedTier.name,
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: selectedTier.name,
              description: `Pre-Flight Meta & Google Ad Compliance Protection. Includes ${selectedTier.scans} scans/month, Landing Page Auditor, and AI Safe-Mode Rewriter.`,
            },
            unit_amount: selectedTier.price,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      metadata: {
        userId: userId || "",
        tier,
      },
      success_url: `${origin}/dashboard?subscription=success&session_id={CHECKOUT_SESSION_ID}&tier=${tier}`,
      cancel_url: `${origin}/dashboard?subscription=cancelled`,
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error: any) {
    console.error("Stripe Session Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
