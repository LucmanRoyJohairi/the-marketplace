"use client";

import { useState, useEffect } from "react";
import { Listing } from "@/types/marketplace";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";
import { SellerProfile, upsertProfile } from "@/lib/supabase";
import { ProfileInfoCard } from "./profile-info-card";
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
        />


          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Local Pickup &amp; Messaging Ready
                </p>
                <p className="text-xs text-slate-500">
                  {isSaving
                    ? "Saving changes to Supabase..."
                    : "Buyers can message you directly on active listings"}
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-blue-50 text-blue-700 border border-blue-100 shrink-0"
            >
              Verified
            </Badge>
          </div>
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
