import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing stripe-signature or webhook secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const listingId = session.metadata?.listingId;

        // Ignore events from other apps in the shared sandbox
        if (!listingId) {
          return NextResponse.json({ received: true }, { status: 200 });
        }

        // Check if this listing exists in your Supabase database
        const { data: existing } = await supabase
          .from("listings")
          .select("id")
          .eq("id", listingId)
          .maybeSingle();

        if (existing) {
          await supabase
            .from("listings")
            .update({ status: "sold" })
            .eq("id", listingId);
        }
        break;
      }

      case "account.updated": {
        const account = event.data.object as Stripe.Account;
        // Optional: update seller's stripe_onboarded status in `profiles`
        // if you store stripe_account_id on your profiles table
        if (account.charges_enabled) {
          await supabase
            .from("profiles")
            .update({ stripe_onboarded: true })
            .eq("stripe_account_id", account.id);
        }
        break;
      }

      default:
        // Safely acknowledge any other event types
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
