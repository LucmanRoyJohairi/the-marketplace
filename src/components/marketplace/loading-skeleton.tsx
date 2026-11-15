export function ListingSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col bg-white rounded-xl border border-slate-200/75 overflow-hidden animate-pulse"
        >
          <div className="aspect-square w-full bg-slate-200/80" />
          <div className="p-3 space-y-2.5">
            <div className="h-5 w-20 bg-slate-200 rounded" />
            <div className="h-4 w-full bg-slate-200/80 rounded" />
            <div className="h-4 w-2/3 bg-slate-200/80 rounded" />
            <div className="pt-2 border-t border-slate-100 flex justify-between">
              <div className="h-3 w-24 bg-slate-100 rounded" />
              <div className="h-3 w-12 bg-slate-100 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
