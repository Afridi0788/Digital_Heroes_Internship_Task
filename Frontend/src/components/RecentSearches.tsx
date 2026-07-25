"use client";

import type { AuditHistoryItem } from "@/lib/types";

interface RecentSearchesProps {
  history?: AuditHistoryItem[];
  searches?: Array<{ url: string; timestamp?: string }>;
  onSelect: (url: string) => void;
}

export default function RecentSearches({ history, searches, onSelect }: RecentSearchesProps) {
  const items = history || searches || [];

  if (items.length === 0) return null;

  return (
    <div className="card-glass rounded-2xl p-6 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-slate-300">Recent Audits</h3>
        </div>
        <span className="text-xs text-slate-500">{items.length} searches</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => {
          const itemUrl = typeof item === "string" ? item : item.url;
          return (
            <button
              key={index}
              onClick={() => onSelect(itemUrl)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-300 hover:text-indigo-400 hover:border-indigo-500/40 hover:bg-slate-800 transition-all cursor-pointer group"
            >
              <svg className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span className="truncate max-w-[200px]">{itemUrl}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
