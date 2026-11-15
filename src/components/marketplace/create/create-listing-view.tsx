"use client";

import { useState } from "react";
import { Listing } from "@/types/marketplace";
import { CreateSidebar } from "./create-sidebar";
import { CreateHeader } from "./create-header";
import { TypeSelector } from "./type-selector";
import { ListingForm } from "./listing-form";
import { YourListings } from "./your-listings";

interface CreateListingViewProps {
  isOpen: boolean;
  initialTab?: "create" | "your-listings";
  userListings: Listing[];
  onClose: () => void;
  onAddListing: (newListing: Listing) => void;
  onToggleSold: (id: number) => void;
  onDeleteListing: (id: number) => void;
}

export function CreateListingView({
  isOpen,
  initialTab = "create",
  userListings,
  onClose,
  onAddListing,
  onToggleSold,
  onDeleteListing,
}: CreateListingViewProps) {
  const [activeTab, setActiveTab] = useState<"create" | "your-listings">(
    initialTab
  );
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [location, setLocation] = useState("Palo Alto, CA");

  if (!isOpen) return null;

  const handleClose = () => {
    setSelectedType(null);
    setActiveTab("create");
    onClose();
  };

  const handleCreated = (newListing: Listing) => {
    onAddListing(newListing);
    setSelectedType(null);
    setActiveTab("your-listings"); // Jump to Your Listings after publishing!
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-50 text-slate-900 animate-in fade-in duration-150">
      <CreateSidebar
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          if (tab === "create") setSelectedType(null);
        }}
        hasSelectedType={!!selectedType}
        userListingsCount={userListings.length}
        location={location}
        onClose={handleClose}
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <CreateHeader />

        <div className="flex-1 flex items-start justify-center px-6 pt-4 pb-16">
          {activeTab === "your-listings" ? (
            <YourListings
              listings={userListings}
              onCreateNew={() => {
                setSelectedType(null);
                setActiveTab("create");
              }}
              onToggleSold={onToggleSold}
              onDelete={onDeleteListing}
            />
          ) : !selectedType ? (
            <TypeSelector onSelectType={setSelectedType} />
          ) : (
            <ListingForm
              selectedType={selectedType}
              defaultLocation={location}
              onLocationChange={setLocation}
              onBack={() => setSelectedType(null)}
              onCancel={handleClose}
              onSubmitListing={handleCreated}
            />
          )}
        </div>
      </div>
    </div>
  );
}
