"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Check,
  Copy,
} from "lucide-react";

interface StripeConnectCardProps {
  defaultEmail: string;
  displayName: string;
  location: string;
  stripeAccountId?: string | null;
  stripeOnboarded?: boolean;
}

export function StripeConnectCard({
  defaultEmail,
  displayName,
  location,
  stripeAccountId,
  stripeOnboarded,
}: StripeConnectCardProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (defaultEmail) setEmail(defaultEmail);
  }, [defaultEmail]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          displayName,
          location,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not start Stripe onboarding.");
      }

      // Redirect to Stripe's hosted onboarding flow
      window.location.href = data.url;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to connect Stripe."
      );
      setIsLoading(false);
    }
  };

  // Connected / Ready State
  if (stripeOnboarded || stripeAccountId) {
    const handleCopyId = () => {
      if (!stripeAccountId) return;
      navigator.clipboard.writeText(stripeAccountId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Stripe Payment Setup
              </h3>
              <p className="text-xs text-slate-500">
                Direct buyer checkout &amp; bank payouts
              </p>
            </div>
          </div>

          <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-200 gap-1.5 px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {stripeOnboarded ? "Connected & Active" : "Setup Incomplete"}
          </Badge>
        </div>

        {/* Highlighted Connected Banner */}
        <div
          className={`rounded-xl border p-4 space-y-3 ${
            stripeOnboarded
              ? "bg-emerald-50/50 border-emerald-200/80"
              : "bg-amber-50/60 border-amber-200/80"
          }`}
        >
          <div className="flex items-start gap-3">
            <CheckCircle2
              className={`h-5 w-5 shrink-0 mt-0.5 ${
                stripeOnboarded ? "text-emerald-600" : "text-amber-600"
              }`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900">
                {stripeOnboarded
                  ? "Your Stripe account is connected"
                  : "Finish your Stripe account setup"}
              </p>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {stripeOnboarded
                  ? "Buyers can purchase your items directly with a card, and funds transfer automatically to your linked bank account."
                  : "Complete your remaining verification details in Stripe to enable the Buy Now button on your listings."}
              </p>
            </div>
          </div>

          {/* Capability Pills */}
          {stripeOnboarded && (
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-white text-emerald-800 border border-emerald-200/80 px-2.5 py-1 rounded-full shadow-2xs">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Card Payments Ready
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-white text-emerald-800 border border-emerald-200/80 px-2.5 py-1 rounded-full shadow-2xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Bank Payouts Linked
              </span>
            </div>
          )}
        </div>

        {/* Account ID Row + Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Account ID:</span>
            <code className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-mono text-[11px]">
              {stripeAccountId}
            </code>
            <button
              type="button"
              onClick={handleCopyId}
              aria-label="Copy Stripe Account ID"
              className="p-1 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          {!stripeOnboarded ? (
            <Button
              type="button"
              size="sm"
              onClick={handleConnect}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs gap-1.5 shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ExternalLink className="h-3.5 w-3.5" />
              )}
              Resume Setup
            </Button>
          ) : (
            <a
              href="https://stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              View in Stripe
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    );
  }

  // Unconnected State (Matches your screenshot)
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-slate-800" />
          <h3 className="text-lg font-bold text-slate-900">
            Stripe Payment Setup
          </h3>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Connect your Stripe account to start selling your listings
        </p>
      </div>

      {/* Info Box */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
        <AlertCircle className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
        <span>
          You need to connect a Stripe account to receive payments for your
          listings.
        </span>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleConnect} className="space-y-3">
        <div>
          <label
            htmlFor="stripe-email"
            className="block text-xs font-semibold text-slate-700 mb-1.5"
          >
            Email for Stripe Account
          </label>
          <Input
            id="stripe-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your-email@example.com"
            className="bg-white border-slate-200 rounded-xl h-10 text-sm"
          />
        </div>

        <Button
          type="submit"
          disabled={!email.trim() || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl h-10 shadow-xs"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Redirecting to Stripe...
            </>
          ) : (
            "Connect Stripe Account"
          )}
        </Button>
      </form>
    </div>
  );
}
