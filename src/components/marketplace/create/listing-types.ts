import { Tag, Layers, Car, Home } from "lucide-react";

export interface ListingTypeOption {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

export const LISTING_TYPES: ListingTypeOption[] = [
  {
    id: "item",
    title: "Item for sale",
    description: "Create a single listing for one or more items to sell.",
    icon: Tag,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "multiple",
    title: "Create multiple listings",
    description: "Quickly list several different items at once.",
    icon: Layers,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    id: "vehicle",
    title: "Vehicle for sale",
    description: "Sell a car, truck, motorcycle, or other vehicle.",
    icon: Car,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    id: "home",
    title: "Home for sale or rent",
    description: "List a house, apartment, or room for rent or sale.",
    icon: Home,
    color: "bg-amber-100 text-amber-600",
  },
];
