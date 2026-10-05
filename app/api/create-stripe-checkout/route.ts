import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2024-12-18.acacia" as any,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { tier = "pro" } = body;
    const origin = req.headers.get("origin") || "http://localhost:3000";

    const isLive = process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes("placeholder");

    if (!isLive) {
      return NextResponse.json({
        success: true,
        url: `${origin}/dashboard?subscription=success&tier=${tier}`,
        isSimulated: true,
      });
    }

    const priceAmount = tier === "agency" ? 14900 : 4900; // $149 or $49 in cents
    const planName = tier === "agency" ? "AdShield AI Agency ($149/mo)" : "AdShield AI Pro ($49/mo)";

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: planName,
              description: "Pre-Flight Meta & Google Ad Compliance Protection. Unlimited scans, Landing Page Auditor, and AI Safe-Mode Rewriter.",
            },
            unit_amount: priceAmount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/dashboard?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
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
