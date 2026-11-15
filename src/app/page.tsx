"use client";

import { useState } from "react";
import { CATEGORIES, LISTINGS as INITIAL_LISTINGS } from "@/lib/data";
import { Listing, PriceFilter } from "@/types/marketplace";
import { MarketplaceSidebar } from "@/components/marketplace/market-sidebar";
import { MarketplaceFilterBar } from "@/components/marketplace/filter-bar";
import { ListingCard } from "@/components/marketplace/listing-card";
import { MarketplaceEmptyState } from "@/components/marketplace/empty-state";
import { ListingDetailModal } from "@/components/marketplace/listing-detail-modal";
import { CreateListingView } from "@/components/marketplace/create/create-listing-view";

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [selectedCategory, setSelectedCategory] = useState("Browse all");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Filter personal listings created by the current user
  const userListings = listings.filter((item) => item.seller.name === "You");

  const handleAddListing = (newListing: Listing) => {
    setListings((prev) => [newListing, ...prev]);
  };

  const handleToggleSold = (id: number) => {
    setListings((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "sold" ? "active" : "sold" }
          : item
      )
    );
  };

  const handleDeleteListing = (id: number) => {
    setListings((prev) => prev.filter((item) => item.id !== id));
  };

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

  // Hide sold items from the main public feed while keeping them in "Your listings"
  const filteredListings = listings.filter((item) => {
    if (item.status === "sold") return false;

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
        onOpenCreate={() => setIsCreating(true)}
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
                  onSelect={setSelectedListing}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <ListingDetailModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        isSaved={
          selectedListing ? savedIds.includes(selectedListing.id) : false
        }
        onToggleSave={toggleSave}
      />

      <CreateListingView
        isOpen={isCreating}
        userListings={userListings}
        onClose={() => setIsCreating(false)}
        onAddListing={handleAddListing}
        onToggleSold={handleToggleSold}
        onDeleteListing={handleDeleteListing}
      />
    </div>
  );
}
