"use client";

import { useState, useEffect } from "react";
import { CATEGORIES, LISTINGS as INITIAL_LISTINGS } from "@/lib/data";
import { supabase, mapRowToListing } from "@/lib/supabase";
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
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");

  // 1. Fetch listings from Supabase on initial load
  useEffect(() => {
    async function fetchListings() {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setListings(data.map(mapRowToListing));
      }
    }

    fetchListings();
  }, []);

  // Filter personal listings matching the seller's email
  const userListings = listings.filter(
    (item) =>
      currentUserEmail &&
      item.sellerEmail.toLowerCase() === currentUserEmail.toLowerCase()
  );

  // 2. Insert a new listing matching your exact SQL columns
  const handleAddListing = async (newListing: Listing) => {
    setCurrentUserEmail(newListing.sellerEmail);

    const { data, error } = await supabase
      .from("listings")
      .insert({
        title: newListing.title,
        description: newListing.description,
        price: newListing.price,
        category: newListing.category,
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

  // 3. Toggle Sold/Active state locally (until you add a 'status' column to Postgres)
  const handleToggleSold = (id: string) => {
    setListings((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "sold" ? "active" : "sold" }
          : item
      )
    );
  };

  // 4. Delete listing by UUID from Supabase
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
  };

  // Filter active listings for the main public grid
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
