"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";

interface AuditFormProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
  loading?: boolean;
  onReset: () => void;
  hasResult?: boolean;
}

function validateUrlClient(url: string): string | null {
  if (!url.trim()) return "Please enter a URL";
  if (!/^https?:\/\//i.test(url.trim())) return "URL must start with http:// or https://";
  try {
    new URL(url.trim());
    return null;
  } catch {
    return "Please enter a valid URL";
  }
}

export default function AuditForm({ onSubmit, isLoading, loading, onReset, hasResult }: AuditFormProps) {
  const isSubmitting = isLoading || loading || false;
  const [url, setUrl] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const error = validateUrlClient(url);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);
    onSubmit(url.trim());
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e as unknown as FormEvent);
    }
  };

  const handleReset = () => {
    setUrl("");
    setValidationError(null);
    onReset();
  };

  return (
    <div className="relative">
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-xl transition-opacity duration-500 ${focused ? 'opacity-100' : 'opacity-0'}`} />
      
      <div className="relative card-glass rounded-2xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Section */}
          <div>
            <label htmlFor="url-input" className="block text-sm font-medium text-slate-300 mb-3">
              Website URL
            </label>
            <div className="relative">
              {/* Globe Icon */}
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <div className={`p-2 rounded-lg transition-colors ${focused ? 'bg-indigo-500/20' : 'bg-slate-800'}`}>
                  <svg className={`w-5 h-5 transition-colors ${focused ? 'text-indigo-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
              </div>
              
              <input
                id="url-input"
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="https://example.com"
                disabled={isSubmitting}
                className={`w-full pl-16 pr-4 py-4 rounded-xl input-dark text-white placeholder-slate-500 text-lg
                  ${validationError ? 'border-red-500/50 focus:border-red-500' : ''}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                aria-invalid={!!validationError}
              />
            </div>
            
            {validationError && (
              <div className="mt-3 flex items-center gap-2 text-red-400 animate-slide-up">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{validationError}</span>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-white btn-primary focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin-slow w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span>Audit Website</span>
                </>
              )}
            </button>

            {hasResult && (
              <button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting}
                className="px-6 py-4 rounded-xl font-semibold text-slate-400 bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:text-white transition-all disabled:opacity-50"
              >
                Reset
              </button>
            )}
          </div>
        </form>

        {/* Quick tips */}
        <div className="mt-6 pt-6 border-t border-slate-800/50">
          <p className="text-xs text-slate-500 text-center">
            💡 Tip: Enter any public website URL to get instant SEO and accessibility insights
          </p>
        </div>
      </div>
    </div>
  );
}
