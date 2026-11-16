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

export function mapRowToListing(row: Record<string, any>): Listing {
  const email: string = row.seller_email || "seller@example.com";
  const displayName = email.split("@")[0] || "Seller";

  return {
    id: row.id,
    title: row.title,
    description: row.description || "",
    price: Number(row.price),
    category: row.category,
    location: row.location || "Palo Alto, CA",
    image:
      row.image_url ||
      "/placeholder.png",
    sellerEmail: email,
    timeAgo: row.created_at ? formatTimeAgo(row.created_at) : "Just now",
    // Default UI values until you add these columns to your schema later:
    condition: row.condition || "Good",

    status: "active",
    seller: {
      name: displayName,
      email,
      joinedYear: "2024",
      rating: "5.0",
    },
  };
}

export interface SellerProfile {
  email: string;
  displayName: string;
  location: string;
  rating: string;
  joinedDate: string;
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
  };
}
