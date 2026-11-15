"use client";

import { Listing } from "@/types/marketplace";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";

interface ListingCardProps {
  item: Listing;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent, id: number) => void;
  onSelect: (item: Listing) => void;
}

export function ListingCard({ item, isSaved, onToggleSave, onSelect }: ListingCardProps) {
  return (
    <div  onClick={() => onSelect(item)} className="group cursor-pointer flex flex-col bg-white rounded-xl border border-slate-200/75 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200">
      {/* Image Container */}
      <div className="aspect-square w-full bg-slate-100 overflow-hidden relative">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Condition Badge */}
        <Badge
          variant="secondary"
          className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-slate-800 text-[11px] font-medium px-2 py-0.5 shadow-xs"
        >
          {item.condition}
        </Badge>

        {/* Save / Favorite Heart Button */}
        <button
          onClick={(e) => onToggleSave(e, item.id)}
          aria-label="Save listing"
          className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs hover:scale-110 transition-transform"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isSaved ? "fill-rose-500 text-rose-500" : "text-slate-700"
            }`}
          />
        </button>
      </div>

      {/* Item Details */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <p className="font-bold text-lg text-slate-900 leading-tight">
            {item.price === 0 ? "Free" : `$${item.price.toLocaleString()}`}
          </p>
          <h3 className="text-sm text-slate-700 font-medium mt-1 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            {item.title}
          </h3>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2 border-t border-slate-100">
          <span className="truncate">{item.location}</span>
          <span className="shrink-0 ml-2">{item.timeAgo}</span>
        </div>
      </div>
    </div>
  );
}
