"use client";

import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-4 py-12 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-indigo-400/20 animate-ping" />
        <div className="relative p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-lg">
          <Loader2 className="h-8 w-8 text-white animate-spin-slow" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
          Analyzing website...
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Fetching page content and running audit checks
        </p>
      </div>
    </div>
  );
}
