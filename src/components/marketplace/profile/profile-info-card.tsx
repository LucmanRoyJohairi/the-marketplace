"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, MapPin, Calendar, Edit3, Check, X, Loader2 } from "lucide-react";

interface ProfileInfoCardProps {
  displayName: string;
  userEmail: string;
  location: string;
  isEditing: boolean;
  isSaving?: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveProfile: (name: string, email: string, location: string) => void;
  onQuickSwitch?: (email: string) => void;
}

export function ProfileInfoCard({
  displayName,
  userEmail,
  location,
  isEditing,
  isSaving = false,
  onStartEdit,
  onCancelEdit,
  onSaveProfile,
  onQuickSwitch,
}: ProfileInfoCardProps) {
  const [draftName, setDraftName] = useState(displayName);
  const [draftEmail, setDraftEmail] = useState(userEmail);
  const [draftLocation, setDraftLocation] = useState(location);

  useEffect(() => {
    if (isEditing) {
      setDraftName(displayName);
      setDraftEmail(userEmail);
      setDraftLocation(location);
    }
  }, [isEditing, displayName, userEmail, location]);

  const initials = displayName
    .split(" ")
    .map((n) => n)
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSave = () => {
    if (isSaving) return;
    onSaveProfile(
      draftName.trim() || displayName,
      draftEmail.trim(),
      draftLocation.trim() || "Palo Alto, CA"
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-blue-100 shadow-2xs">
            <AvatarFallback className="bg-blue-600 text-white font-bold text-xl">
              {initials || "YO"}
            </AvatarFallback>
          </Avatar>

          <div>
            {isEditing ? (
              <Input
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                disabled={isSaving}
                placeholder="Display name"
                className="h-8 text-base font-bold mb-1.5 bg-slate-50"
              />
            ) : (
              <h3 className="text-xl font-bold text-slate-900">
                {displayName}
              </h3>
            )}

            <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-200 font-medium text-xs">
              Active Member
            </Badge>
          </div>
        </div>

        {isEditing ? (
          <div className="flex items-center gap-1.5 self-start">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving || !draftEmail.trim()}
              className="h-8 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white rounded-lg text-xs gap-1.5"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Save
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancelEdit}
              disabled={isSaving}
              className="h-8 rounded-lg text-xs gap-1"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={onStartEdit}
            className="rounded-lg text-xs font-semibold gap-1.5 self-start border-slate-200 hover:bg-slate-50"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-100">
        <div className="flex items-start gap-3">
          <Mail className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-400 font-medium">Email</p>
            {isEditing ? (
              <Input
                type="email"
                value={draftEmail}
                onChange={(e) => setDraftEmail(e.target.value)}
                disabled={isSaving}
                placeholder="you@example.com"
                className="h-8 text-xs mt-1 bg-slate-50"
              />
            ) : (
              <p className="text-sm font-semibold text-slate-800 truncate">
                {userEmail || "Not specified (link your email)"}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-slate-400 font-medium">Member since</p>
            <p className="text-sm font-semibold text-slate-800">January 2024</p>
          </div>
        </div>

        <div className="flex items-start gap-3 sm:col-span-2">
          <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-400 font-medium">Location</p>
            {isEditing ? (
              <Input
                value={draftLocation}
                onChange={(e) => setDraftLocation(e.target.value)}
                disabled={isSaving}
                placeholder="City, State"
                className="h-8 text-xs mt-1 bg-slate-50 max-w-xs"
              />
            ) : (
              <p className="text-sm font-semibold text-slate-800">
                {location || "Palo Alto, CA"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Account Switcher Bar for Testing */}
      {onQuickSwitch && (
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-slate-400">Testing accounts:</span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onQuickSwitch("laxus@test.com")}
              className={`text-xs px-2.5 py-1 rounded-full font-medium border transition-colors ${
                userEmail.toLowerCase() === "laxus@test.com"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              Demo Seller (Stripe Ready)
            </button>
            <button
              type="button"
              onClick={() => {
                const randomNum = Math.floor(100 + Math.random() * 900);
                onQuickSwitch(`seller${randomNum}@test.com`);
              }}
              className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              + Fresh Test Seller
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
