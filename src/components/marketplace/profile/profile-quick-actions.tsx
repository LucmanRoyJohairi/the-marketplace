"use client";

interface ProfileQuickActionsProps {
  onCreateNew: () => void;
  onViewListings: () => void;
  onEditSettings: () => void;
}

export function ProfileQuickActions({
  onCreateNew,
  onViewListings,
  onEditSettings,
}: ProfileQuickActionsProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
      <h3 className="text-base font-bold text-slate-900 mb-3.5">
        Quick Actions
      </h3>

      <div className="space-y-2.5">
        <button
          type="button"
          onClick={onCreateNew}
          className="w-full text-left p-3.5 rounded-xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-100 transition-colors"
        >
          <p className="text-sm font-bold text-blue-700">Create New Listing</p>
          <p className="text-xs text-blue-600/80 mt-0.5">
            Add a new item to sell locally
          </p>
        </button>

        <button
          type="button"
          onClick={onViewListings}
          className="w-full text-left p-3.5 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-100 transition-colors"
        >
          <p className="text-sm font-bold text-emerald-700">View My Listings</p>
          <p className="text-xs text-emerald-600/80 mt-0.5">
            Manage your active and sold items
          </p>
        </button>

        <button
          type="button"
          onClick={onEditSettings}
          className="w-full text-left p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors"
        >
          <p className="text-sm font-bold text-slate-800">Account Settings</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Update your seller email and location
          </p>
        </button>
      </div>
    </div>
  );
}
