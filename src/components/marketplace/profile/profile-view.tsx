"use client";

import { useState, useEffect } from "react";
import { Listing } from "@/types/marketplace";
import { SellerProfile, switchOrCreateProfile, upsertProfile } from "@/lib/supabase";
import { ProfileInfoCard } from "./profile-info-card";
import { StripeConnectCard } from "./stripe-connect-card";
import { ProfileStatsCard } from "./profile-stats-card";
import { ProfileQuickActions } from "./profile-quick-actions";

interface ProfileViewProps {
  userEmail: string;
  profile: SellerProfile | null;
  location: string;
  userListings: Listing[];
  onProfileSaved: (saved: SellerProfile) => void;
  onNavigateTab: (tab: "create" | "your-listings") => void;
}

export function ProfileView({
  userEmail,
  profile,
  location,
  userListings,
  onProfileSaved,
  onNavigateTab,
}: ProfileViewProps) {
  const effectiveEmail = profile?.email || userEmail || "seller@example.com";
  const fallbackName = effectiveEmail
    .split("@")[0]
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const [displayName, setDisplayName] = useState(
    profile?.displayName || fallbackName
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile?.displayName) {
      setDisplayName(profile.displayName);
    }
  }, [profile]);

  const activeListings = userListings.filter(
    (item) => item.status !== "sold"
  ).length;

  const handleSaveProfile = async (
    nextName: string,
    nextEmail: string,
    nextLocation: string
  ) => {
    if (!nextEmail.trim()) return;
    setIsSaving(true);

    const saved = await upsertProfile({
      email: nextEmail,
      displayName: nextName,
      location: nextLocation,
    });

    if (saved) {
      localStorage.setItem("marketplace_user_email", saved.email);
      setDisplayName(saved.displayName);
      onProfileSaved(saved);
      setIsEditing(false);
    }

    setIsSaving(false);
  };

  const handleQuickSwitch = async (targetEmail: string) => {
    setIsSaving(true);
    const switched = await switchOrCreateProfile(targetEmail, location);
    if (switched) {
      localStorage.setItem("marketplace_user_email", switched.email);
      setDisplayName(switched.displayName);
      onProfileSaved(switched);
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Seller profile
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage your public marketplace identity and account overview
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-5">
          <ProfileInfoCard
            displayName={displayName}
            userEmail={profile?.email || userEmail}
            location={profile?.location || location}
            isEditing={isEditing}
            isSaving={isSaving}
            onStartEdit={() => setIsEditing(true)}
            onCancelEdit={() => setIsEditing(false)}
            onSaveProfile={handleSaveProfile}
            onQuickSwitch={handleQuickSwitch}
          />

          <StripeConnectCard
            defaultEmail={profile?.email || userEmail}
            displayName={displayName}
            location={profile?.location || location}
            stripeAccountId={profile?.stripeAccountId}
            stripeOnboarded={profile?.stripeOnboarded}
          />
        </div>

        <div className="lg:col-span-5 space-y-5">
          <ProfileStatsCard
            totalListings={userListings.length}
            activeListings={activeListings}
          />

          <ProfileQuickActions
            onCreateNew={() => onNavigateTab("create")}
            onViewListings={() => onNavigateTab("your-listings")}
            onEditSettings={() => setIsEditing(true)}
          />
        </div>
      </div>
    </div>
  );
}
