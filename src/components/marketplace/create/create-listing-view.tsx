"use client";

import { useState } from "react";
import { Listing } from "@/types/marketplace";
import { SellerProfile } from "@/lib/supabase";
import { CreateSidebar } from "./create-sidebar";
import { CreateHeader } from "./create-header";
import { TypeSelector } from "./type-selector";
import { ListingForm } from "./listing-form";
import { YourListings } from "./your-listings";
import { ProfileView } from "../profile/profile-view";

interface CreateListingViewProps {
  isOpen: boolean;
  initialTab?: "create" | "your-listings" | "profile";
  userEmail: string;
  userProfile: SellerProfile | null;
  userListings: Listing[];
  onProfileSaved: (saved: SellerProfile) => void;
  onClose: () => void;
  onAddListing: (newListing: Listing) => void;
  onToggleSold: (id: string) => void;
  onDeleteListing: (id: string) => void;
}

export function CreateListingView({
  isOpen,
  initialTab = "create",
  userEmail,
  userProfile,
  userListings,
  onProfileSaved,
  onClose,
  onAddListing,
  onToggleSold,
  onDeleteListing,
}: CreateListingViewProps) {
  const [activeTab, setActiveTab] = useState<
    "create" | "your-listings" | "profile"
  >(initialTab);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [location, setLocation] = useState(
    userProfile?.location || "Palo Alto, CA"
  );

  if (!isOpen) return null;

  const activeLocation = userProfile?.location || location;

  const handleClose = () => {
    setSelectedType(null);
    setActiveTab("create");
    onClose();
  };

  const handleCreated = async (newListing: Listing) => {
    await onAddListing(newListing);
    setSelectedType(null);
    setActiveTab("your-listings");
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-50 text-slate-900 animate-in fade-in duration-150">
      <CreateSidebar
        activeTab={activeTab === "profile" ? "your-listings" : activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          if (tab === "create") setSelectedType(null);
        }}
        hasSelectedType={!!selectedType}
        userListingsCount={userListings.length}
        location={activeLocation}
        onClose={handleClose}
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <CreateHeader
          isProfileActive={activeTab === "profile"}
          onOpenProfile={() => setActiveTab("profile")}
        />

        <div className="flex-2 w-full px-6 sm:px-10 lg:px-12 pt-2 pb-16">
          {activeTab === "profile" ? (
            <ProfileView
              userEmail={userEmail}
              profile={userProfile}
              location={activeLocation}
              userListings={userListings}
              onProfileSaved={(saved) => {
                setLocation(saved.location);
                onProfileSaved(saved);
              }}
              onNavigateTab={(tab) => {
                setSelectedType(null);
                setActiveTab(tab);
              }}
            />
          ) : activeTab === "your-listings" ? (
            <div className="max-w-5xl mx-auto">
              <YourListings
                listings={userListings}
                onCreateNew={() => {
                  setSelectedType(null);
                  setActiveTab("create");
                }}
                onToggleSold={onToggleSold}
                onDelete={onDeleteListing}
              />
            </div>
          ) : !selectedType ? (
            <div className="flex justify-center pt-8">
              <TypeSelector onSelectType={setSelectedType} />
            </div>
          ) : (
            <ListingForm
              selectedType={selectedType}
              defaultEmail={userProfile?.email || userEmail}
              sellerProfile={userProfile}
              defaultLocation={activeLocation}
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
