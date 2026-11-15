export type PriceFilter = "all" | "under500" | "free";

export interface Category {
  name: string;
  icon: string;
}

export interface Seller {
  name: string;
  joinedYear: string;
  rating: string;
  avatar?: string;
}

export interface Listing {
  id: number;
  price: number;
  title: string;
  location: string;
  timeAgo: string;
  condition: string;
  category: string;
  description: string;
  image: string;
  seller: Seller;
  status?: "active" | "sold";
}
