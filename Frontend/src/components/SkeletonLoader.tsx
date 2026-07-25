"use client";

export default function SkeletonLoader() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="card-glass rounded-2xl p-6 border border-slate-800 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800" />
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-slate-800 rounded w-48" />
            <div className="h-4 bg-slate-800/60 rounded w-64" />
          </div>
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card-glass rounded-xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-slate-800 animate-shimmer" />
              <div className="h-6 w-16 bg-slate-800 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-800/60 rounded w-24" />
              <div className="h-6 bg-slate-800 rounded w-32" />
              <div className="h-3 bg-slate-800/40 rounded w-40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
