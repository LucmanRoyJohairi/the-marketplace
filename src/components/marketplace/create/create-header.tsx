"use client";

import { Mail, Bell, User } from "lucide-react";

export function CreateHeader() {
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
        aria-label="Account"
        className="h-10 w-10 rounded-full bg-white border border-slate-200/80 hover:bg-slate-100 flex items-center justify-center text-slate-700 shadow-2xs transition-colors"
      >
        <User className="h-4 w-4" />
      </button>
    </header>
  );
}
