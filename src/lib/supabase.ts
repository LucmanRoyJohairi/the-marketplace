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
    condition: "Good",
    status: "active",
    seller: {
      name: displayName,
      email,
      joinedYear: "2024",
      rating: "5.0",
    },
  };
}
