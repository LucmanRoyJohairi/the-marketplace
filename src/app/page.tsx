"use client";

import { useState } from "react";
import { CATEGORIES, LISTINGS } from "@/lib/data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Left Sidebar */}
      <aside className="w-64 border-r bg-muted/20 p-4 flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xl">
            F
          </div>
          <span className="text-xl font-bold tracking-tight">Marketplace</span>
        </div>

        {/* Categories List */}
        <h2 className="px-2 mb-2 text-lg font-semibold">Categories</h2>
        <ScrollArea className="flex-1">
          <nav className="flex flex-col space-y-1">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "secondary" : "ghost"}
                className="justify-start font-normal text-sm h-9 px-2"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">
            {selectedCategory ? selectedCategory : "Today's picks"}
          </h1>

          {/* 5-Column Responsive Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {LISTINGS.map((item) => (
              <div
                key={item.id}
                className="group cursor-pointer flex flex-col space-y-2"
              >
                {/* Square Image Placeholder */}
                <div className="aspect-square w-full rounded-xl border bg-blue-50/50 overflow-hidden relative flex items-center justify-center transition-transform group-hover:scale-[1.02]">
                  {/* Crosshatch SVG Pattern matching your wireframe */}
                  <svg
                    className="h-full w-full text-blue-300/60"
                    fill="none"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <pattern
                      id="hatch"
                      width="8"
                      height="8"
                      patternTransform="rotate(45 0 0)"
                      patternUnits="userSpaceOnUse"
                    >
                      <line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </pattern>
                    <rect width="100" height="100" fill="url(#hatch)" />
                  </svg>
                </div>

                {/* Item Details */}
                <div className="pt-1">
                  <p className="font-bold text-base leading-none">
                    {item.price}
                  </p>
                  <p className="text-sm text-foreground mt-1 truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
