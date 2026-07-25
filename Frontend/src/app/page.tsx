"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuditForm from "@/components/AuditForm";
import ResultCard from "@/components/ResultCard";
import ErrorCard from "@/components/ErrorCard";
import SkeletonLoader from "@/components/SkeletonLoader";
import RecentSearches from "@/components/RecentSearches";
import Toast from "@/components/Toast";
import API_ENDPOINTS from "@/lib/api";
import type { AuditResponse, ErrorResponse, AuditHistoryItem } from "@/lib/types";

export default function HomePage() {
  const [result, setResult] = useState<AuditResponse | null>(null);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [auditedUrl, setAuditedUrl] = useState("");
  const [history, setHistory] = useState<AuditHistoryItem[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(API_ENDPOINTS.history);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch {
      // Silently fail - history is optional
    }
  }, []);

  useEffect(() => {
    void fetchHistory();
  }, [fetchHistory]);

  async function handleAudit(url: string) {
    setLoading(true);
    setResult(null);
    setError(null);
    setAuditedUrl(url);

    try {
      const res = await fetch(API_ENDPOINTS.audit, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const contentType = res.headers.get("content-type");
      let data: any = null;

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (res.ok) {
        setResult(data as AuditResponse);
        setToast({ message: "Audit completed successfully!", type: "success" });
      } else {
        const errorData: ErrorResponse = data || {
          timestamp: new Date().toISOString(),
          status: res.status,
          error: "Audit Error",
          message: res.statusText || "Failed to analyze website",
        };
        setError(errorData);
        setToast({ message: errorData.error || "Audit failed", type: "error" });
      }
    } catch {
      setError({
        timestamp: new Date().toISOString(),
        status: 0,
        error: "Network Error",
        message: "Unable to connect to the server. Please check your network or backend connection.",
      });
      setToast({ message: "Network error occurred", type: "error" });
    } finally {
      setLoading(false);
      void fetchHistory();
    }
  }

  function handleReset() {
    setResult(null);
    setError(null);
    setAuditedUrl("");
    setToast({ message: "Results cleared", type: "info" });
  }

  const handleCopyJson = () => {
    if (result) {
      navigator.clipboard
        .writeText(JSON.stringify(result, null, 2))
        .then(() => setToast({ message: "JSON copied to clipboard!", type: "success" }))
        .catch(() => setToast({ message: "Failed to copy JSON", type: "error" }));
    }
  };

  const handleDownloadJson = () => {
    if (result) {
      const blob = new Blob([JSON.stringify(result, null, 2)], {
        type: "application/json",
      });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `page-pulse-report-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
      setToast({ message: "Report downloaded!", type: "success" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Hero Section */}
        <section className="text-center py-4 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            Instant Website Analysis
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            <span className="gradient-text">Page Pulse</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Audit any website in seconds. Get detailed insights on{" "}
            <span className="text-indigo-400 font-medium">SEO</span>,{" "}
            <span className="text-purple-400 font-medium">accessibility</span>, and{" "}
            <span className="text-pink-400 font-medium">performance</span>.
          </p>
        </section>

        {/* Audit Form */}
        <section aria-label="Audit form" className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <AuditForm
            onSubmit={handleAudit}
            onReset={handleReset}
            loading={loading}
            hasResult={!!result || !!error}
          />
        </section>

        {/* Loading State */}
        {loading && (
          <section aria-label="Loading">
            <SkeletonLoader />
          </section>
        )}

        {/* Error State */}
        {error && !loading && (
          <section aria-label="Error">
            <ErrorCard error={error} onDismiss={() => setError(null)} />
          </section>
        )}

        {/* Results State */}
        {result && !loading && (
          <section aria-label="Audit results">
            <ResultCard
              result={result}
              url={auditedUrl}
              onCopyJson={handleCopyJson}
              onDownloadJson={handleDownloadJson}
            />
          </section>
        )}

        {/* Recent Searches */}
        {history.length > 0 && !loading && (
          <section aria-label="Recent searches" className="animate-slide-up" style={{ animationDelay: "200ms" }}>
            <RecentSearches history={history} onSelect={handleAudit} />
          </section>
        )}

        {/* Empty State */}
        {!result && !error && !loading && history.length === 0 && (
          <div className="text-center py-16 animate-slide-up" style={{ animationDelay: "300ms" }}>
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/20">
              <svg className="w-10 h-10 text-indigo-400 animate-float" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Ready to Analyze</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              Enter a website URL above to get started with your first audit
            </p>
          </div>
        )}
      </main>

      <Footer />

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
