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
    const { listingId } = await req.json();

    if (!listingId) {
      return NextResponse.json(
        { error: "Listing ID is required." },
        { status: 400 }
      );
    }

    // 1. Fetch the listing from Supabase
    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("*")
      .eq("id", listingId)
      .single();

    if (listingError || !listing) {
      return NextResponse.json(
        { error: "Listing not found." },
        { status: 404 }
      );
    }

    if (listing.status === "sold") {
      return NextResponse.json(
        { error: "This item has already been sold." },
        { status: 400 }
      );
    }

    // 2. Look up the seller's connected Stripe account
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_account_id, stripe_onboarded")
      .eq("email", listing.seller_email.trim().toLowerCase())
      .maybeSingle();

    if (!profile?.stripe_account_id || !profile?.stripe_onboarded) {
      return NextResponse.json(
        { error: "Seller has not enabled Stripe payments yet." },
        { status: 400 }
      );
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

      const unitAmount = Math.round(Number(listing.price) * 100);
    // 10% platform fee (in cents)
    const applicationFee = Math.round(unitAmount * 0.10);

    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: listing.title,
                description: listing.description || undefined,
                images: listing.image_url?.startsWith("http")
                  ? [listing.image_url]
                  : undefined,
              },
              unit_amount: unitAmount,
            },
            quantity: 1,
          },
        ],
        payment_intent_data: {
          application_fee_amount: applicationFee,
        },
        metadata: {
          listingId: listing.id,
          listingTitle: listing.title,
          sellerEmail: listing.seller_email,
          sellerAccountId: profile.stripe_account_id,
          platformFee: String(applicationFee),
        },
        success_url: `${origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}&account_id=${profile.stripe_account_id}`,
        cancel_url: `${origin}/?checkout=cancelled`,
      },
      {
        stripeAccount: profile.stripe_account_id,
      }
    );

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to start checkout";
    console.error("Stripe checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
