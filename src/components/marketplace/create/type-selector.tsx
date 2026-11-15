"use client";

import { LISTING_TYPES } from "./listing-types";

interface TypeSelectorProps {
  onSelectType: (typeId: string) => void;
}

export function TypeSelector({ onSelectType }: TypeSelectorProps) {
  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-6">
        Choose listing type
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {LISTING_TYPES.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => onSelectType(type.id)}
              className="group flex flex-col items-center text-center bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md hover:border-blue-300 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div
                className={`h-14 w-14 rounded-full ${type.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 leading-snug mb-1.5">
                {type.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {type.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
