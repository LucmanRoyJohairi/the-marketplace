export type PriceFilter = "all" | "under500" | "free";

export interface Category {
  name: string;
  icon: string;
}

export interface Listing {
  id: number;
  price: number;
  title: string;
  location: string;
  timeAgo: string;
  condition: string;
  category: string;
  image: string;
}
