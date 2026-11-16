import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  const accountId = req.nextUrl.searchParams.get("account_id");

  if (!sessionId || !accountId) {
    return NextResponse.json(
      { error: "Missing session_id or account_id" },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(
      sessionId,
      undefined,
      { stripeAccount: accountId }
    );

    const listingId = session.metadata?.listingId;

    if (session.payment_status === "paid" && listingId) {
      // 1. Mark listing as sold
      await supabase
        .from("listings")
        .update({ status: "sold" })
        .eq("id", listingId);

      // 2. Record the order in Supabase (idempotent on stripe_session_id)
      const amountTotal = session.amount_total || 0;
      const platformFee =
        Number(session.metadata?.platformFee) || Math.round(amountTotal * 0.1);

      const { data: order } = await supabase
        .from("orders")
        .upsert(
          {
            listing_id: listingId,
            listing_title: session.metadata?.listingTitle || "Marketplace Item",
            buyer_email: session.customer_details?.email || "buyer@example.com",
            seller_email: session.metadata?.sellerEmail || "",
            amount_total: amountTotal,
            platform_fee: platformFee,
            stripe_session_id: session.id,
            status: "paid",
          },
          { onConflict: "stripe_session_id" }
        )
        .select()
        .single();

      return NextResponse.json({ paid: true, listingId, order });
    }

    return NextResponse.json({ paid: false });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to verify session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
