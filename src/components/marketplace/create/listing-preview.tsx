"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Clock, Star, ImageIcon } from "lucide-react";

interface ListingPreviewProps {
  title: string;
  price: string;
  category: string;
  condition: string;
  location: string;
  description: string;
  previewImage: string | null;
  sellerName?: string;
  sellerRating?: string;
  joinedYear?: string;
}

export function ListingPreview({
  title,
  price,
  category,
  condition,
  location,
  description,
  previewImage,
  sellerName = "You",
  sellerRating = "5.0",
  joinedYear = "2024",
}: ListingPreviewProps) {
  const formattedPrice =
    price === ""
      ? "Price"
      : Number(price) === 0
      ? "Free"
      : `$${Number(price).toLocaleString()}`;

  const displayName = sellerName.trim() || "You";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Main Preview Card with integrated top header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Integrated Preview Header Bar */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
          <span className="text-sm font-bold tracking-tight text-slate-800">
            Preview
          </span>
          <span className="text-xs text-slate-400">Live buyer view</span>
        </div>

        {/* Top Media Area */}
        <div className="aspect-[16/10] w-full bg-blue-50/60 relative flex items-center justify-center overflow-hidden border-b border-slate-100">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Listing preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center text-blue-400">
              <div className="relative z-10 flex flex-col items-center gap-1.5 bg-white/80 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-blue-100 shadow-2xs">
                <ImageIcon className="h-5 w-5 text-blue-500" />
                <span className="text-xs font-medium text-slate-600">
                  Your listing photo will appear here
                </span>
              </div>
            </div>
          )}

          {/* Condition & Category Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <Badge className="bg-white/90 text-slate-800 hover:bg-white backdrop-blur-xs shadow-2xs">
              {condition}
            </Badge>
            <Badge
              variant="secondary"
              className="bg-slate-900/75 text-white hover:bg-slate-900/75 backdrop-blur-xs"
            >
              {category}
            </Badge>
          </div>
        </div>

        {/* Bottom Details Area */}
        <div className="p-6 space-y-5">
          <div>
            <h3
              className={`text-xl font-bold leading-snug ${
                title.trim() ? "text-slate-900" : "text-slate-400"
              }`}
            >
              {title.trim() || "Title"}
            </h3>
            <p
              className={`text-lg font-extrabold mt-1 ${
                price !== "" ? "text-slate-900" : "text-slate-400"
              }`}
            >
              {formattedPrice}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2.5">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                Listed just now
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                in {location.trim() || "Palo Alto, CA"}
              </span>
            </div>
          </div>

          {/* Description Preview */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Description
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {description.trim() ||
                "Description will appear here as you type..."}
            </p>
          </div>

          {/* Dynamic Seller Information */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Seller Information
            </h4>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-slate-200">
                <AvatarFallback className="bg-blue-50 text-blue-700 font-semibold text-sm">
                  {initials || "YO"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {displayName}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-0.5 text-amber-600 font-medium">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    {sellerRating}
                  </span>
                  <span>·</span>
                  <span>Joined {joinedYear}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
