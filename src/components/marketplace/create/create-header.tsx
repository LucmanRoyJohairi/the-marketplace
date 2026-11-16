"use client";

import { Mail, Bell, User } from "lucide-react";

interface CreateHeaderProps {
  isProfileActive?: boolean;
  onOpenProfile: () => void;
}

export function CreateHeader({
  isProfileActive = false,
  onOpenProfile,
}: CreateHeaderProps) {
  return (
    <header className="flex items-center justify-end gap-2.5 p-5">
      <button
        aria-label="Messages"
        className="h-10 w-10 rounded-full bg-white border border-slate-200/80 hover:bg-slate-100 flex items-center justify-center text-slate-700 shadow-2xs transition-colors"
      >
        <Mail className="h-4 w-4" />
      </button>
      <button
        aria-label="Notifications"
        className="h-10 w-10 rounded-full bg-white border border-slate-200/80 hover:bg-slate-100 flex items-center justify-center text-slate-700 shadow-2xs transition-colors"
      >
        <Bell className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onOpenProfile}
        aria-label="Account"
        className={`h-10 w-10 rounded-full border flex items-center justify-center shadow-2xs transition-colors ${
          isProfileActive
            ? "bg-blue-600 border-blue-600 text-white"
            : "bg-white border-slate-200/80 hover:bg-slate-100 text-slate-700"
        }`}
      >
        <User className="h-4 w-4" />
      </button>
    </header>
  );
}
