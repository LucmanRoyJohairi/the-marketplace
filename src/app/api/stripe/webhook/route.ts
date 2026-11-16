import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { email, displayName, location } = await req.json();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail) {
      return NextResponse.json(
        { error: "Email is required to connect Stripe." },
        { status: 400 }
      );
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    // 1. Check if this seller already has a profile / stripe_account_id
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("stripe_account_id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    let accountId = existingProfile?.stripe_account_id;

    // 2. Create a new Express connected account if they don't have one yet
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: normalizedEmail,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });

      accountId = account.id;

      // Save or create the profile row with the new stripe_account_id
      await supabase.from("profiles").upsert(
        {
          email: normalizedEmail,
          display_name:
            displayName?.trim() ||
            normalizedEmail
              .split("@")[0]
              .replace(/[._-]/g, " ")
              .replace(/\b\w/g, (c: string) => c.toUpperCase()),
          location: location || "Palo Alto, CA",
          stripe_account_id: accountId,
        },
        { onConflict: "email" }
      );
    }

    // 3. Generate a one-time onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${origin}/?stripe_connect=refresh&email=${encodeURIComponent(normalizedEmail)}`,
      return_url: `${origin}/?stripe_connect=return&email=${encodeURIComponent(normalizedEmail)}`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to connect Stripe account";
    console.error("Stripe connect error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
