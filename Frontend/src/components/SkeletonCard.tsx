"use client";

export default function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="skeleton h-10 w-10 rounded-lg" />
          <div className="space-y-2 flex-1">
            <div className="skeleton h-4 w-24 rounded" />
            <div className="skeleton h-6 w-32 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonResults() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-card rounded-2xl p-6">
        <div className="skeleton h-6 w-48 rounded mb-4" />
        <div className="skeleton h-4 w-full rounded mb-2" />
        <div className="skeleton h-4 w-3/4 rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
