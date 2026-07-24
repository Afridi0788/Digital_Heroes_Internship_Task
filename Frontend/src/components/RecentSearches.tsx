"use client";

import { History, ExternalLink, AlertCircle } from "lucide-react";
import type { AuditHistoryItem } from "@/lib/types";

interface RecentSearchesProps {
  history: AuditHistoryItem[];
  onSelect: (url: string) => void;
}

export default function RecentSearches({ history, onSelect }: RecentSearchesProps) {
  if (history.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-5 w-5 text-indigo-500" />
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
          Recent Searches
        </h2>
      </div>
      <div className="space-y-2">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.url)}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group"
          >
            <div
              className={`p-1.5 rounded-lg ${
                item.error
                  ? "bg-red-100 dark:bg-red-900/30"
                  : "bg-emerald-100 dark:bg-emerald-900/30"
              }`}
            >
              {item.error ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
              ) : (
                <ExternalLink className="h-4 w-4 text-emerald-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                {item.url}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {item.error
                  ? item.error.slice(0, 50)
                  : `Status: ${item.status} · ${item.responseTime}ms · ${item.wordCount} words`}
                {" · "}
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
            <ExternalLink className="h-4 w-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
