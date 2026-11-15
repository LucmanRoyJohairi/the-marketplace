"use client";

import { useState, useEffect } from "react";
import { CATEGORIES } from "@/lib/data";
import { supabase, mapRowToListing } from "@/lib/supabase";
import { AdvancedFilters, Listing, PriceFilter } from "@/types/marketplace";
import { MarketplaceSidebar } from "@/components/marketplace/market-sidebar";
import { MarketplaceFilterBar } from "@/components/marketplace/filter-bar";
import { ListingCard } from "@/components/marketplace/listing-card";
import { ListingSkeletonGrid } from "@/components/marketplace/loading-skeleton";
import { MarketplaceEmptyState } from "@/components/marketplace/empty-state";
import { ListingDetailModal } from "@/components/marketplace/listing-detail-modal";
import { CreateListingView } from "@/components/marketplace/create/create-listing-view";

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("Browse all");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    conditions: [],
    minPrice: "",
    maxPrice: "",
    sortBy: "newest",
  });

  

  // Fetch live listings from Supabase
  useEffect(() => {
  async function fetchListings() {
    setIsLoading(true);
    setFetchError(null);

    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setFetchError(error.message);
      } else if (data) {
        setListings(data.map(mapRowToListing));
      }
    } catch (err) {
      setFetchError(
        err instanceof Error
          ? err.message
          : "Network error while connecting to Supabase."
      );
    } finally {
      setIsLoading(false);
    }
  }

  fetchListings();
}, []);

  const userListings = listings.filter(
    (item) =>
      currentUserEmail &&
      item.sellerEmail.toLowerCase() === currentUserEmail.toLowerCase()
  );
  
  const handleAddListing = async (newListing: Listing) => {
    setCurrentUserEmail(newListing.sellerEmail);

    const { data, error } = await supabase
      .from("listings")
      .insert({
        title: newListing.title,
        description: newListing.description,
        price: newListing.price,
        category: newListing.category,
        condition: newListing.condition, // <-- Add this line
        seller_email: newListing.sellerEmail,
        image_url: newListing.image,
        location: newListing.location,
      })
      .select()
      .single();


    if (!error && data) {
      setListings((prev) => [mapRowToListing(data), ...prev]);
    } else {
      console.error("Failed to insert listing:", error?.message);
    }
  };

  const handleToggleSold = (id: string) => {
    setListings((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "sold" ? "active" : "sold" }
          : item
      )
    );
  };

  const handleDeleteListing = async (id: string) => {
    const { error } = await supabase.from("listings").delete().eq("id", id);

    if (!error) {
      setListings((prev) => prev.filter((item) => item.id !== id));
    } else {
      console.error("Failed to delete listing:", error.message);
    }
  };

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };


const resetFilters = () => {
  setSelectedCategory("Browse all");
  setSearchQuery("");
  setPriceFilter("all");
  setAdvancedFilters({
    conditions: [],
    minPrice: "",
    maxPrice: "",
    sortBy: "newest",
  });
};


const filteredListings = listings
  .filter((item) => {
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

    // Advanced condition & custom price range checks
    const matchesCondition =
      advancedFilters.conditions.length === 0 ||
      advancedFilters.conditions.includes(item.condition);
    const matchesMinPrice =
      advancedFilters.minPrice === "" ||
      item.price >= Number(advancedFilters.minPrice);
    const matchesMaxPrice =
      advancedFilters.maxPrice === "" ||
      item.price <= Number(advancedFilters.maxPrice);

    return (
      matchesCategory &&
      matchesSearch &&
      matchesPrice &&
      matchesCondition &&
      matchesMinPrice &&
      matchesMaxPrice
    );
  })
  .sort((a, b) => {
    if (advancedFilters.sortBy === "price-asc") return a.price - b.price;
    if (advancedFilters.sortBy === "price-desc") return b.price - a.price;
    return 0; // "newest" preserves Supabase created_at DESC order
  });


const hasActiveFilters =
  selectedCategory !== "Browse all" ||
  searchQuery.trim() !== "" ||
  priceFilter !== "all" ||
  advancedFilters.conditions.length > 0 ||
  advancedFilters.minPrice !== "" ||
  advancedFilters.maxPrice !== "";

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
            advancedFilters={advancedFilters}
            onAdvancedFiltersChange={setAdvancedFilters}
          />


          {fetchError && (
            <div className="mb-6 rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
              Could not load listings from Supabase: {fetchError}
            </div>
          )}

          {isLoading ? (
            <ListingSkeletonGrid />
          ) : filteredListings.length === 0 ? (
            <MarketplaceEmptyState
              hasActiveFilters={hasActiveFilters}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              onReset={resetFilters}
              onCreateNew={() => setIsCreating(true)}
            />
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
