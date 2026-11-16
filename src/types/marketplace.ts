export type PriceFilter = "all" | "under500" | "free";
export type SortOption = "newest" | "price-asc" | "price-desc";

export interface AdvancedFilters {
  conditions: string[];
  minPrice: string;
  maxPrice: string;
  sortBy: SortOption;
}


export interface Category {
  name: string;
  icon: string;
}

export interface Seller {
  name: string;
  email?: string;
  joinedYear: string;
  rating: string;
  avatar?: string;
}

export interface Listing {
  id: string; // Updated from number to string for UUID
  price: number;
  title: string;
  location: string;
  timeAgo: string;
  condition: string;
  category: string;
  description: string;
  image: string;
  sellerEmail: string; // Added to match seller_email column
  seller: Seller;
  status?: "active" | "sold";
}


export interface Seller {
  name: string;
  email?: string;
  joinedYear: string;
  rating: string;
  avatar?: string;
  stripeAccountId?: string | null;
  stripeOnboarded?: boolean;
}
