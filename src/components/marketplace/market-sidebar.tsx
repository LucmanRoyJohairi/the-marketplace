"use client";

import { Category } from "@/types/marketplace";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Store,
  Car,
  Home,
  Shirt,
  Laptop,
  Gamepad2,
  Gift,
  Trees,
  Sofa,
  Guitar,
  Bike,
  Blocks,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Store,
  Car,
  Home,
  Shirt,
  Laptop,
  Gamepad2,
  Gift,
  Trees,
  Sofa,
  Guitar,
  Bike,
  Blocks,
};

interface SidebarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function MarketplaceSidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}: SidebarProps) {
  return (
    <aside className="w-72 border-r border-slate-200/80 bg-white p-4 flex flex-col shrink-0 sticky top-0 h-screen">
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 mb-4 px-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg shadow-sm">
          F
        </div>
        <span className="text-xl font-bold tracking-tight">The Marketplace</span>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search Marketplace"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-slate-100/80 border-transparent focus-visible:bg-white focus-visible:border-blue-500 rounded-full h-9 text-sm"
        />
      </div>

      {/* Primary Action CTA */}
      <Button className="w-full mb-5 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold rounded-lg shadow-none">
        <Plus className="h-4 w-4 mr-1.5" />
        Create new listing
      </Button>

      {/* Categories List */}
      <div className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Categories
      </div>
      <ScrollArea className="flex-1 -mx-2 px-2">
        <nav className="flex flex-col space-y-1">
          {categories.map(({ name, icon }) => {
            const IconComponent = ICON_MAP[icon] || Store;
            const isActive = selectedCategory === name;
            return (
              <button
                key={name}
                onClick={() => onSelectCategory(name)}
                className={`flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                </span>
                <span>{name}</span>
              </button>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
