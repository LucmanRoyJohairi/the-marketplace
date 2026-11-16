import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ onboarded: false }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_account_id")
    .eq("email", email)
    .maybeSingle();

  if (!profile?.stripe_account_id) {
    return NextResponse.json({ onboarded: false });
  }

  const account = await stripe.v2.core.accounts.retrieve(
    profile.stripe_account_id,
    {
      include: ["configuration.merchant", "requirements"],
    }
  );

  const capStatus =
    account.configuration?.merchant?.capabilities?.card_payments?.status;
  const isReady = capStatus === "active" || capStatus === "pending";

  if (isReady) {
    await supabase
      .from("profiles")
      .update({ stripe_onboarded: true })
      .eq("email", email);
  }

  return NextResponse.json({ onboarded: isReady });
}
