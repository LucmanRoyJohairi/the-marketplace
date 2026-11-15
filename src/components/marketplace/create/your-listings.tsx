"use client";

import { Listing } from "@/types/marketplace";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  CheckCircle2,
  RotateCcw,
  PackageOpen,
  MapPin,
} from "lucide-react";

interface YourListingsProps {
  listings: Listing[];
  onCreateNew: () => void;
  onToggleSold: (id: number) => void;
  onDelete: (id: number) => void;
}

export function YourListings({
  listings,
  onCreateNew,
  onToggleSold,
  onDelete,
}: YourListingsProps) {
  return (
    <div className="w-full max-w-4xl">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Your listings
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage items you have listed for sale ({listings.length})
          </p>
        </div>

        <Button
          onClick={onCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Create new listing
        </Button>
      </div>

      {/* Empty State if user hasn't created anything yet */}
      {listings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
          <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <PackageOpen className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            You haven&apos;t listed anything yet
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            When you create a listing, it will appear here so you can track
            views, mark it as sold, or remove it.
          </p>
          <Button
            onClick={onCreateNew}
            className="mt-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
          >
            Create your first listing
          </Button>
        </div>
      ) : (
        /* Seller's Personal Listings List */
        <div className="space-y-3">
          {listings.map((item) => {
            const isSold = item.status === "sold";
            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs"
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`h-20 w-20 rounded-xl object-cover bg-slate-100 shrink-0 ${
                      isSold ? "opacity-50 grayscale" : ""
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900 line-clamp-1">
                        {item.title}
                      </h3>
                      <Badge
                        variant={isSold ? "secondary" : "default"}
                        className={
                          isSold
                            ? "bg-slate-100 text-slate-600"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                        }
                      >
                        {isSold ? "Sold" : "Active"}
                      </Badge>
                    </div>

                    <p className="font-bold text-sm text-slate-800 mt-0.5">
                      {item.price === 0
                        ? "Free"
                        : `$${item.price.toLocaleString()}`}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {item.location}
                      </span>
                      <span>·</span>
                      <span>Listed {item.timeAgo}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Seller Management Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleSold(item.id)}
                    className="rounded-lg text-xs gap-1.5"
                  >
                    {isSold ? (
                      <>
                        <RotateCcw className="h-3.5 w-3.5" />
                        Relist item
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Mark as sold
                      </>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(item.id)}
                    aria-label="Delete listing"
                    className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
