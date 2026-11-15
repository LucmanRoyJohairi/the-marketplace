"use client";

import { AdvancedFilters, SortOption } from "@/types/marketplace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

const CONDITIONS = ["New", "Like New", "Good", "Used"];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

interface MoreFiltersPopoverProps {
  filters: AdvancedFilters;
  onChange: (next: AdvancedFilters) => void;
}

export function MoreFiltersPopover({
  filters,
  onChange,
}: MoreFiltersPopoverProps) {
  // Count active filters to show a badge on the button
  const activeCount =
    filters.conditions.length +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    (filters.sortBy !== "newest" ? 1 : 0);

  const toggleCondition = (cond: string) => {
    const exists = filters.conditions.includes(cond);
    const nextConditions = exists
      ? filters.conditions.filter((c) => c !== cond)
      : [...filters.conditions, cond];
    onChange({ ...filters, conditions: nextConditions });
  };

  const resetAdvanced = () => {
    onChange({
      conditions: [],
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
    });
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={`rounded-full h-8 text-xs ml-auto gap-1.5 transition-colors ${
              activeCount > 0
                ? "border-blue-300 bg-blue-50/70 text-blue-700 hover:bg-blue-100/70"
                : "bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>More filters</span>
            {activeCount > 0 && (
              <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                {activeCount}
              </span>
            )}
          </Button>
        }
      />


      <PopoverContent
        align="end"
        className="w-80 p-4 rounded-2xl bg-white border-slate-200 shadow-lg space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <span className="text-sm font-bold text-slate-900">Filters</span>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={resetAdvanced}
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              <RotateCcw className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>

        {/* Condition Multi-Select Pills */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Condition
          </label>
          <div className="flex flex-wrap gap-1.5">
            {CONDITIONS.map((cond) => {
              const isSelected = filters.conditions.includes(cond);
              return (
                <button
                  key={cond}
                  type="button"
                  onClick={() => toggleCondition(cond)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {cond}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Price Range */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Price range ($)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              min="0"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) =>
                onChange({ ...filters, minPrice: e.target.value })
              }
              className="h-8 text-xs bg-slate-50 focus-visible:bg-white rounded-lg"
            />
            <Input
              type="number"
              min="0"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) =>
                onChange({ ...filters, maxPrice: e.target.value })
              }
              className="h-8 text-xs bg-slate-50 focus-visible:bg-white rounded-lg"
            />
          </div>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Sort by
          </label>
          <div className="flex flex-col gap-1">
            {SORT_OPTIONS.map((option) => {
              const isSelected = filters.sortBy === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    onChange({ ...filters, sortBy: option.value })
                  }
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
