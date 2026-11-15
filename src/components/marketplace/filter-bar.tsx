"use client";

import { PriceFilter } from "@/types/marketplace";
import { Button } from "@/components/ui/button";
import { MapPin, SlidersHorizontal } from "lucide-react";

interface FilterBarProps {
  selectedCategory: string;
  itemCount: number;
  priceFilter: PriceFilter;
  onPriceFilterChange: (filter: PriceFilter) => void;
}

export function MarketplaceFilterBar({
  selectedCategory,
  itemCount,
  priceFilter,
  onPriceFilterChange,
}: FilterBarProps) {
  return (
    <>
      {/* Top Bar: Title + Location Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {selectedCategory === "Browse all"
              ? "Today's picks"
              : selectedCategory}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {itemCount} {itemCount === 1 ? "item" : "items"} available near you
          </p>
        </div>

        <button className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-full transition-colors self-start sm:self-auto">
          <MapPin className="h-4 w-4" />
          <span>Palo Alto, CA · 40 mi</span>
        </button>
      </div>

      {/* Quick Filter Pills */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        <Button
          variant={priceFilter === "all" ? "default" : "outline"}
          size="sm"
          className="rounded-full h-8 text-xs"
          onClick={() => onPriceFilterChange("all")}
        >
          All prices
        </Button>
        <Button
          variant={priceFilter === "under500" ? "default" : "outline"}
          size="sm"
          className="rounded-full h-8 text-xs"
          onClick={() => onPriceFilterChange("under500")}
        >
          Under $500
        </Button>
        <Button
          variant={priceFilter === "free" ? "default" : "outline"}
          size="sm"
          className="rounded-full h-8 text-xs"
          onClick={() => onPriceFilterChange("free")}
        >
          Free Stuff
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full h-8 text-xs ml-auto gap-1.5"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          More filters
        </Button>
      </div>
    </>
  );
}
