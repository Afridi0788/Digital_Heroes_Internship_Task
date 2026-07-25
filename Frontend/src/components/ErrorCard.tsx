"use client";

import type { ErrorResponse } from "@/lib/types";

interface ErrorCardProps {
  error: ErrorResponse;
  onDismiss?: () => void;
}

export default function ErrorCard({ error, onDismiss }: ErrorCardProps) {
  const formatTimestamp = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleTimeString();
    } catch {
      return isoString;
    }
  };

  return (
    <div className="card-glass rounded-2xl p-6 border border-red-500/30 glow-danger animate-bounce-in">
      <div className="flex items-start gap-4">
        {/* Error Icon */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="absolute inset-0 rounded-xl bg-red-500 blur-lg opacity-40" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                {error.status ? `HTTP ${error.status}` : "ERROR"}
              </span>
              <span className="text-xs text-slate-500">{formatTimestamp(error.timestamp)}</span>
            </div>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Dismiss error"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <h3 className="text-lg font-bold text-white mb-2">{error.error || "Audit Failed"}</h3>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/50 rounded-xl p-3 border border-slate-800">
            {error.message}
          </p>

          {/* Solution Suggestions */}
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <p className="text-xs font-semibold text-slate-400 mb-2">Troubleshooting suggestions:</p>
            <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li>Check if the URL is publicly accessible</li>
              <li>Verify the website starts with http:// or https://</li>
              <li>Ensure the server isn't blocking bot requests</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
