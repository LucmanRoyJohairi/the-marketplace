"use client";

import { Package, Eye, TrendingUp, Star } from "lucide-react";

interface ProfileStatsCardProps {
  totalListings: number;
  activeListings: number;
}

export function ProfileStatsCard({
  totalListings,
  activeListings,
}: ProfileStatsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-4 w-4 text-blue-600" />
        <h3 className="text-base font-bold text-slate-900">
          Profile Statistics
        </h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <span className="inline-flex items-center gap-2.5 text-sm text-slate-600">
            <Package className="h-4 w-4 text-blue-600" />
            Total Listings
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800">
            {totalListings}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <span className="inline-flex items-center gap-2.5 text-sm text-slate-600">
            <Eye className="h-4 w-4 text-emerald-600" />
            Active Listings
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
            {activeListings}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <span className="inline-flex items-center gap-2.5 text-sm text-slate-600">
            <TrendingUp className="h-4 w-4 text-indigo-600" />
            Profile Views
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
            {totalListings * 42}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="inline-flex items-center gap-2.5 text-sm text-slate-600">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            Rating
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
            5.0 / 5
          </span>
        </div>
      </div>
    </div>
  );
}
