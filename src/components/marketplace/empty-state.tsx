"use client";

import { Button } from "@/components/ui/button";
import { SearchX, Store, RotateCcw, Plus } from "lucide-react";

interface EmptyStateProps {
  hasActiveFilters: boolean;
  searchQuery?: string;
  selectedCategory?: string;
  onReset: () => void;
  onCreateNew: () => void;
}

export function MarketplaceEmptyState({
  hasActiveFilters,
  searchQuery,
  selectedCategory,
  onReset,
  onCreateNew,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
      {/* Soft Circular Icon Badge */}
      <div className="h-14 w-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 ring-8 ring-blue-50/50">
        {hasActiveFilters ? (
          <SearchX className="h-6 w-6" />
        ) : (
          <Store className="h-6 w-6" />
        )}
      </div>

      {/* Headline */}
      <h3 className="text-lg font-bold tracking-tight text-slate-900">
        {hasActiveFilters
          ? "No matching listings found"
          : "No listings in Marketplace yet"}
      </h3>

      {/* Contextual Subtitle */}
      <p className="text-sm text-slate-500 mt-1.5 max-w-md leading-relaxed">
        {hasActiveFilters ? (
          <>
            We couldn&apos;t find anything matching{" "}
            {searchQuery ? (
              <span className="font-semibold text-slate-700">
                &ldquo;{searchQuery}&rdquo;
              </span>
            ) : (
              "your current filters"
            )}
            {selectedCategory && selectedCategory !== "Browse all" && (
              <>
                {" "}
                in{" "}
                <span className="font-semibold text-slate-700">
                  {selectedCategory}
                </span>
              </>
            )}
            . Try adjusting your search or clearing filters.
          </>
        ) : (
          "Be the first to list an item for sale in your area. It only takes a minute to publish."
        )}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={onReset}
            className="rounded-xl gap-1.5 font-semibold"
          >
            <RotateCcw className="h-4 w-4" />
            Reset all filters
          </Button>
        )}

        <Button
          onClick={onCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-1.5 font-semibold shadow-xs"
        >
          <Plus className="h-4 w-4" />
          Create new listing
        </Button>
      </div>
    </div>
  );
}
