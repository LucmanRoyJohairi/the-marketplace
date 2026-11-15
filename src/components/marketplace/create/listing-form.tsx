"use client";

import { useState, useRef } from "react";
import { Listing } from "@/types/marketplace";
import { CATEGORIES } from "@/lib/data";
import { LISTING_TYPES } from "./listing-types";
import { ListingPreview } from "./listing-preview";
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
import { ArrowLeft, Upload, X } from "lucide-react";

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
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState(
    selectedType === "vehicle"
      ? "Vehicles"
      : selectedType === "home"
      ? "Property Rentals"
      : "Electronics"
  );
  const [condition, setCondition] = useState("Like New");
  const [description, setDescription] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const typeTitle =
    LISTING_TYPES.find((t) => t.id === selectedType)?.title || "New listing";

  // Local client-side preview only (ready to hook up to cloud storage later)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
  };

  const clearPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const created: Listing = {
      id: Date.now(),
      title: title.trim(),
      price: Number(price) || 0,
      category,
      condition,
      location: defaultLocation.trim() || "Palo Alto, CA",
      timeAgo: "Just now",
      description:
        description.trim() || "Newly listed item available for local pickup.",
      image:
        previewImage ||
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
    <div className="w-full max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

      {/* Left Column: Form Inputs + Photo Upload Box */}
      <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to listing types
        </button>

        <h2 className="text-lg font-bold text-slate-900 mb-4">{typeTitle}</h2>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Dashed "Add photos" Dropzone (Matches your wireframe) */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  fileInputRef.current?.click();
                }
              }}
              className="group relative h-36 w-full rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-blue-50/40 flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden"
            >
              {previewImage ? (
                <>
                  <img
                    src={previewImage}
                    alt="Selected upload"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearPhoto}
                    aria-label="Remove photo"
                    className="absolute top-2 right-2 h-7 w-7 rounded-full bg-slate-900/75 text-white hover:bg-slate-900 flex items-center justify-center transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center text-center px-4">
                  <div className="h-10 w-10 rounded-full bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center text-slate-600 group-hover:text-blue-600 group-hover:border-blue-200 mb-2 transition-colors">
                    <Upload className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">
                    Add photos
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    Click to select a photo for preview
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <Input
              required
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-50/70 focus-visible:bg-white"
            />
          </div>

          {/* Price */}
          <div>
            <Input
              type="number"
              min="0"
              placeholder="Price ($)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-slate-50/70 focus-visible:bg-white"
            />
          </div>

          {/* Email */}
          <div>
            <Input
              type="email"
              placeholder="Email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-50/70 focus-visible:bg-white"
            />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-2 gap-2.5">
            <Select
              value={category}
              onValueChange={(val) => {
                if (val) setCategory(val);
              }}
            >
              <SelectTrigger className="bg-slate-50/70">
                <SelectValue placeholder="Category" />
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

            <Select
              value={condition}
              onValueChange={(val) => {
                if (val) setCondition(val);
              }}
            >
              <SelectTrigger className="bg-slate-50/70">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Like New">Like New</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Used">Used</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div>
            <Input
              placeholder="Location"
              value={defaultLocation}
              onChange={(e) => onLocationChange(e.target.value)}
              className="bg-slate-50/70 focus-visible:bg-white"
            />
          </div>

          {/* Description */}
          <div>
            <Textarea
              rows={3}
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none bg-slate-50/70 focus-visible:bg-white"
            />
          </div>

          {/* Primary Blue Submit Button (Matches your wireframe's "Next" CTA) */}
          <div className="pt-1 space-y-2">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10 rounded-lg shadow-xs"
            >
              Publish Listing
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="w-full h-8 text-xs text-slate-500"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>

      {/* Right Column: Live Preview Card */}
      <div className="lg:col-span-7 xl:col-span-8">
        <ListingPreview
          title={title}
          price={price}
          category={category}
          condition={condition}
          location={defaultLocation}
          description={description}
          previewImage={previewImage}
        />
      </div>
    </div>
  );
}
