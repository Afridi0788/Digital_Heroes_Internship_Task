"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Search, Globe, RotateCcw, Loader2 } from "lucide-react";

interface AuditFormProps {
  onSubmit: (url: string) => void;
  onReset: () => void;
  isLoading: boolean;
}

export default function AuditForm({ onSubmit, onReset, isLoading }: AuditFormProps) {
  const [url, setUrl] = useState("");
  const [validationError, setValidationError] = useState("");

  function validateInput(value: string): string {
    if (!value.trim()) {
      return "Please enter a URL";
    }
    const withProtocol = /^https?:\/\//i.test(value.trim())
      ? value.trim()
      : `https://${value.trim()}`;
    try {
      const parsed = new URL(withProtocol);
      if (!parsed.hostname.includes(".")) {
        return "Please enter a valid domain (e.g., example.com)";
      }
    } catch {
      return "Please enter a valid URL (e.g., https://example.com)";
    }
    return "";
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const error = validateInput(url);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError("");
    const finalUrl = /^https?:\/\//i.test(url.trim())
      ? url.trim()
      : `https://${url.trim()}`;
    onSubmit(finalUrl);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSubmit(e as unknown as FormEvent);
    }
  }

  function handleReset() {
    setUrl("");
    setValidationError("");
    onReset();
  }

  function handleChange(value: string) {
    setUrl(value);
    if (validationError) {
      setValidationError("");
    }
  }

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 animate-fade-in">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-4">
          <Globe className="h-4 w-4" />
          Website Auditor
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white">
          Audit Any Website
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
          Enter a URL to analyze page structure, SEO elements, accessibility, and performance metrics.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter website URL (e.g., example.com)"
            className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 text-base bg-white dark:bg-slate-800 transition-all duration-200 ${
              validationError
                ? "border-red-300 dark:border-red-600 focus:border-red-400"
                : "border-slate-200 dark:border-slate-700 focus:border-indigo-400 dark:focus:border-indigo-500"
            } text-slate-800 dark:text-slate-100 placeholder:text-slate-400`}
            disabled={isLoading}
            aria-label="Website URL"
            aria-invalid={!!validationError}
            aria-describedby={validationError ? "url-error" : undefined}
            autoFocus
          />
        </div>

        {validationError && (
          <p
            id="url-error"
            className="mt-2 text-sm text-red-500 dark:text-red-400 flex items-center gap-1 animate-fade-in"
            role="alert"
          >
            <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
            {validationError}
          </p>
        )}

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-lg active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Auditing...
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                Audit Website
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="py-3.5 px-4 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 active:scale-[0.98]"
            aria-label="Reset form"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
