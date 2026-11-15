"use client";

import { useState } from "react";
import { CATEGORIES, LISTINGS } from "@/lib/data";
import { PriceFilter } from "@/types/marketplace";
import { MarketplaceSidebar } from "@/components/marketplace/market-sidebar";
import { MarketplaceFilterBar } from "@/components/marketplace/filter-bar";
import { ListingCard } from "@/components/marketplace/listing-card";
import { MarketplaceEmptyState } from "@/components/marketplace/empty-state";

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState("Browse all");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");

  const toggleSave = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const resetFilters = () => {
    setSelectedCategory("Browse all");
    setSearchQuery("");
    setPriceFilter("all");
  };

  const filteredListings = LISTINGS.filter((item) => {
    const matchesCategory =
      selectedCategory === "Browse all" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "under500" && item.price <= 500) ||
      (priceFilter === "free" && item.price === 0);

    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <div className="flex min-h-screen bg-slate-50/70 text-slate-900">
      <MarketplaceSidebar
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-[1400px] mx-auto">
          <MarketplaceFilterBar
            selectedCategory={selectedCategory}
            itemCount={filteredListings.length}
            priceFilter={priceFilter}
            onPriceFilterChange={setPriceFilter}
          />

          {filteredListings.length === 0 ? (
            <MarketplaceEmptyState onReset={resetFilters} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {filteredListings.map((item) => (
                <ListingCard
                  key={item.id}
                  item={item}
                  isSaved={savedIds.includes(item.id)}
                  onToggleSave={toggleSave}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
