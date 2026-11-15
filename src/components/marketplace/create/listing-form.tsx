"use client";

import { useState } from "react";
import { Listing } from "@/types/marketplace";
import { CATEGORIES } from "@/lib/data";
import { LISTING_TYPES } from "./listing-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ImagePlus } from "lucide-react";

interface ListingFormProps {
  selectedType: string;
  defaultLocation: string;
  onLocationChange: (loc: string) => void;
  onBack: () => void;
  onCancel: () => void;
  onSubmitListing: (newListing: Listing) => void;
}

export function ListingForm({
  selectedType,
  defaultLocation,
  onLocationChange,
  onBack,
  onCancel,
  onSubmitListing,
}: ListingFormProps) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [condition, setCondition] = useState("Like New");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const typeTitle =
    LISTING_TYPES.find((t) => t.id === selectedType)?.title || "New listing";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const created: Listing = {
      id: Date.now(),
      title: title.trim(),
      price: Number(price) || 0,
      category:
        selectedType === "vehicle"
          ? "Vehicles"
          : selectedType === "home"
          ? "Property Rentals"
          : category,
      condition,
      location: defaultLocation.trim() || "Palo Alto, CA",
      timeAgo: "Just now",
      description:
        description.trim() || "Newly listed item available for local pickup.",
      image:
        imageUrl.trim() ||
        "https://unsplash.com",
      seller: {
        name: "You",
        joinedYear: "2024",
        rating: "5.0",
      },
    };

    onSubmitListing(created);
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to listing types
      </button>

      <h2 className="text-xl font-bold text-slate-900 mb-5">{typeTitle}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Title
          </label>
          <Input
            required
            placeholder="What are you selling?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Price ($)
            </label>
            <Input
              type="number"
              min="0"
              placeholder="0 for Free"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Condition
            </label>
            <Select
                value={condition}
                onValueChange={(value) => {
                    if (value) setCondition(value);
                }}
                >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Like New">Like New</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Used">Used</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Category
            </label>
            <Select
                value={category}
                onValueChange={(value) => {
                    if (value) setCategory(value);
                }}
                >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.filter((c) => c.name !== "Browse all").map(
                  (cat) => (
                    <SelectItem key={cat.name} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Location
            </label>
            <Input
              value={defaultLocation}
              onChange={(e) => onLocationChange(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Photo URL (Optional)
          </label>
          <div className="relative">
            <ImagePlus className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Description
          </label>
          <Textarea
            rows={3}
            placeholder="Describe your item's condition, features, or pickup details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6"
          >
            Publish Listing
          </Button>
        </div>
      </form>
    </div>
  );
}
