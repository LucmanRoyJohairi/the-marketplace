import { createClient } from "@supabase/supabase-js";
import { Listing } from "@/types/marketplace";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

function formatTimeAgo(dateString: string): string {
  const diffSeconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000
  );
  if (diffSeconds < 60) return "Just now";
  const minutes = Math.floor(diffSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function mapRowToListing(
  row: Record<string, any>,
  profileMap?: Record<string, SellerProfile>
): Listing {
  const email: string = row.seller_email || "seller@example.com";
  const normalizedEmail = email.trim().toLowerCase();
  const profile = profileMap?.[normalizedEmail];

  const fallbackName = email.split("@")[0] || "Seller";

  const joinedYear = profile?.joinedDate
    ? profile.joinedDate.split(", ").pop() || "2024"
    : "2024";

  return {
    id: row.id,
    title: row.title,
    description: row.description || "",
    price: Number(row.price),
    category: row.category,
    location: row.location || "Palo Alto, CA",
    image: row.image_url || "/placeholder.png",
    sellerEmail: email,
    timeAgo: row.created_at ? formatTimeAgo(row.created_at) : "Just now",
    condition: row.condition || "Good",
    status: row.status === "sold" ? "sold" : "active",
    seller: {
      name: profile?.displayName || fallbackName,
      email,
      joinedYear,
      rating: profile?.rating || "5.0",
      stripeAccountId: profile?.stripeAccountId || null,
      stripeOnboarded: Boolean(profile?.stripeOnboarded),
    },
  };
}


export interface SellerProfile {
  email: string;
  displayName: string;
  location: string;
  rating: string;
  joinedDate: string;
  stripeAccountId?: string | null;
  stripeOnboarded?: boolean;
}


export async function fetchProfile(email: string): Promise<SellerProfile | null> {
  if (!email) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (error || !data) return null;

  return {
    email: data.email,
    displayName: data.display_name,
    location: data.location || "Palo Alto, CA",
    rating: Number(data.rating || 5.0).toFixed(1),
    joinedDate: data.created_at
      ? new Date(data.created_at).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "January 2024",
    stripeAccountId: data.stripe_account_id || null,
    stripeOnboarded: Boolean(data.stripe_onboarded),
  };
}

export async function upsertProfile(profile: {
  email: string;
  displayName: string;
  location: string;
}): Promise<SellerProfile | null> {
  const normalizedEmail = profile.email.trim().toLowerCase();
  if (!normalizedEmail) return null;

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        email: normalizedEmail,
        display_name: profile.displayName.trim(),
        location: profile.location.trim() || "Palo Alto, CA",
      },
      { onConflict: "email" }
    )
    .select()
    .single();

  if (error || !data) {
    console.error("Failed to save profile:", error?.message);
    return null;
  }

  return {
    email: data.email,
    displayName: data.display_name,
    location: data.location,
    rating: Number(data.rating || 5.0).toFixed(1),
    joinedDate: new Date(data.created_at).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    stripeAccountId: data.stripe_account_id || null,
    stripeOnboarded: Boolean(data.stripe_onboarded),
  };
}
