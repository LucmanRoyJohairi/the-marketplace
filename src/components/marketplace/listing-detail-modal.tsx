"use client";

import { useState, useEffect } from "react";
import { Listing } from "@/types/marketplace";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Heart,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Star,
  Share2,
} from "lucide-react";

interface ListingDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent, id: number) => void;
}

export function ListingDetailModal({
  listing,
  onClose,
  isSaved,
  onToggleSave,
}: ListingDetailModalProps) {
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);

  // Pre-fill a contextual message whenever a new listing is opened
  useEffect(() => {
    if (listing) {
      setMessage(`Hi ${listing.seller.name.split(" ")[0]}, is this still available?`);
      setIsSent(false);
    }
  }, [listing]);

  if (!listing) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSent(true);
  };

  const initials = listing.seller.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Dialog open={!!listing} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl sm:max-w-5xl w-[95vw] p-0 overflow-hidden bg-white border-slate-200 rounded-2xl gap-0">

        {/* Accessible hidden title for screen readers */}
        <DialogTitle className="sr-only">{listing.title}</DialogTitle>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[90vh]">
          {/* Left Panel: Large Image Showcase (matches your wireframe's big blue box) */}
          <div className="md:col-span-7 lg:col-span-8 bg-slate-950 flex items-center justify-center relative min-h-[300px] md:min-h-[560px]">
            <img
              src={listing.image}
              alt={listing.title}
              className="w-full h-full max-h-[85vh] object-contain"
            />
            <Badge className="absolute top-4 left-4 bg-white/90 text-slate-900 hover:bg-white backdrop-blur-xs shadow-sm">
              {listing.condition}
            </Badge>
          </div>

          {/* Right Panel: Details, Seller Info & Message Form */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col justify-between p-6 overflow-y-auto bg-white">
            <div className="space-y-5">
              {/* Header: Title, Price & Quick Actions */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-bold text-slate-900 leading-snug">
                    {listing.title}
                  </h2>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={(e) => onToggleSave(e, listing.id)}
                      className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                      aria-label="Save item"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isSaved
                            ? "fill-rose-500 text-rose-500"
                            : "text-slate-700"
                        }`}
                      />
                    </button>
                    <button
                      className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                      aria-label="Share item"
                    >
                      <Share2 className="h-4 w-4 text-slate-700" />
                    </button>
                  </div>
                </div>

                <p className="text-2xl font-extrabold text-slate-900 mt-1.5">
                  {listing.price === 0
                    ? "Free"
                    : `$${listing.price.toLocaleString()}`}
                </p>

                {/* Timestamp & Location */}
                <div className="flex flex-col gap-1 text-xs text-slate-500 mt-2.5">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    Listed {listing.timeAgo}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {listing.location}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Details
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {listing.description}
                </p>
              </div>

              {/* Seller Information */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Seller Information
                </h3>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-slate-200">
                    <AvatarFallback className="bg-blue-50 text-blue-700 font-semibold text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {listing.seller.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-0.5 text-amber-600 font-medium">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        {listing.seller.rating}
                      </span>
                      <span>·</span>
                      <span>Joined {listing.seller.joinedYear}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Send Seller a Message Box (matches your wireframe's bottom right CTA) */}
            <div className="pt-5 mt-6 border-t border-slate-100">
              <label
                htmlFor="seller-message"
                className="block text-xs font-semibold text-slate-700 mb-2"
              >
                Send seller a message
              </label>

              {isSent ? (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center space-y-1.5">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto" />
                  <p className="text-sm font-semibold text-emerald-900">
                    Message sent to {listing.seller.name}!
                  </p>
                  <p className="text-xs text-emerald-700">
                    You&apos;ll be notified when they reply.
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSent(false)}
                    className="text-xs text-emerald-700 hover:text-emerald-900 mt-1 h-7"
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-3">
                  <Textarea
                    id="seller-message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a message to the seller..."
                    className="resize-none bg-slate-50 border-slate-200 focus-visible:bg-white focus-visible:border-blue-500 text-sm rounded-xl"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl h-10 shadow-xs"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
