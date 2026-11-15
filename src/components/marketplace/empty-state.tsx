"use client";

import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onReset: () => void;
}

export function MarketplaceEmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
      <p className="text-slate-500 font-medium">
        No listings match your current filters.
      </p>
      <Button variant="link" onClick={onReset}>
        Reset all filters
      </Button>
    </div>
  );
}
