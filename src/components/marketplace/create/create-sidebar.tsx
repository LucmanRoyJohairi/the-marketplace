"use client";

import { X, Tag, HelpCircle, PlusCircle } from "lucide-react";

interface CreateSidebarProps {
  activeTab: "create" | "your-listings";
  onChangeTab: (tab: "create" | "your-listings") => void;
  hasSelectedType: boolean;
  userListingsCount: number;
  location: string;
  onClose: () => void;
}

export function CreateSidebar({
  activeTab,
  onChangeTab,
  hasSelectedType,
  userListingsCount,
  location,
  onClose,
}: CreateSidebarProps) {
  return (
    <aside className="w-80 border-r border-slate-200/80 bg-white p-5 flex flex-col justify-between shrink-0">
      <div>
        {/* Top Close + Brand Logo */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onClose}
            aria-label="Close seller studio"
            className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg shadow-xs">
            F
          </div>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-3">
          {activeTab === "create" ? "Create new listing" : "Seller dashboard"}
        </h1>

        {/* Active Step Pill (only shown during creation) */}
        {activeTab === "create" && (
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-100 text-slate-500 text-xs font-medium mb-6">
            <Tag className="h-3.5 w-3.5 text-slate-400" />
            <span>
              {hasSelectedType ? "Listing details" : "Choose listing type"}
            </span>
          </div>
        )}

        {/* Seller Navigation Links */}
        <nav className="space-y-1.5 border-t border-slate-100 pt-4">
          <button
            onClick={() => onChangeTab("create")}
            className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "create"
                ? "bg-blue-50 text-blue-700"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full ${
                activeTab === "create"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <PlusCircle className="h-4 w-4" />
            </span>
            <span>Create listing</span>
          </button>

          <button
            onClick={() => onChangeTab("your-listings")}
            className={`w-full flex items-center justify-between px-2.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "your-listings"
                ? "bg-blue-50 text-blue-700"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full ${
                  activeTab === "your-listings"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <Tag className="h-4 w-4" />
              </span>
              <span>Your listings</span>
            </div>
            {userListingsCount > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {userListingsCount}
              </span>
            )}
          </button>

          <button className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <HelpCircle className="h-4 w-4" />
            </span>
            <span>Seller help</span>
          </button>
        </nav>
      </div>

      <p className="text-xs text-slate-400 px-2">
        Listings are public and visible to buyers near {location}.
      </p>
    </aside>
  );
}
