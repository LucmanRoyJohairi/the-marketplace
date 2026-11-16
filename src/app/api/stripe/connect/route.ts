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

    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("stripe_account_id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    let accountId = existingProfile?.stripe_account_id;

    // 1. Create a connected account using Stripe Accounts v2 with Managed Risk
    if (!accountId) {
      const account = await stripe.v2.core.accounts.create({
        contact_email: normalizedEmail,
        display_name:
          displayName?.trim() ||
          normalizedEmail
            .split("@")
            .replace(/[._-]/g, " ")
            .replace(/\b\w/g, (c: string) => c.toUpperCase()),
        dashboard: "full",
        identity: {
          country: "US",
        },
        defaults: {
          responsibilities: {
            fees_collector: "stripe",
            losses_collector: "stripe",
          },
        },
        configuration: {
          merchant: {
            capabilities: {
              card_payments: {
                requested: true,
              },
            },
          },
        },
      });

      accountId = account.id;

      await supabase.from("profiles").upsert(
        {
          email: normalizedEmail,
          display_name:
            displayName?.trim() ||
            normalizedEmail
              .split("@")
              .replace(/[._-]/g, " ")
              .replace(/\b\w/g, (c: string) => c.toUpperCase()),
          location: location || "Palo Alto, CA",
          stripe_account_id: accountId,
        },
        { onConflict: "email" }
      );
    }

    // 2. Create a v2 Account Link for Stripe-hosted onboarding
    const accountLink = await stripe.v2.core.accountLinks.create({
      account: accountId,
      use_case: {
        type: "account_onboarding",
        account_onboarding: {
          collection_options: {
            fields: "eventually_due",
          },
          refresh_url: `${origin}/?stripe_connect=refresh&email=${encodeURIComponent(normalizedEmail)}`,
          return_url: `${origin}/?stripe_connect=return&email=${encodeURIComponent(normalizedEmail)}`,
        },
      },
    });


    return NextResponse.json({ url: accountLink.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to connect Stripe account";
    console.error("Stripe connect error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
