"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuditForm from "@/components/AuditForm";
import ResultCard from "@/components/ResultCard";
import ErrorCard from "@/components/ErrorCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import RecentSearches from "@/components/RecentSearches";
import ToastContainer from "@/components/Toast";
import API_ENDPOINTS from "@/lib/api";
import type { AuditResponse, ErrorResponse, AuditHistoryItem } from "@/lib/types";

export default function HomePage() {
  const [result, setResult] = useState<AuditResponse | null>(null);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [auditedUrl, setAuditedUrl] = useState("");
  const [history, setHistory] = useState<AuditHistoryItem[]>([]);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(API_ENDPOINTS.history);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch {
      // Silently fail - history is a nice-to-have
    }
  }, []);

  useEffect(() => {
    fetchHistory();
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

      const data = await res.json();

      if (res.ok) {
        setResult(data as AuditResponse);
      } else {
        setError(data as ErrorResponse);
      }
    } catch {
      setError({
        timestamp: new Date().toISOString(),
        status: 0,
        error: "Network Error",
        message: "Unable to connect to the server. Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
      fetchHistory();
    }
  }

  function handleReset() {
    setResult(null);
    setError(null);
    setAuditedUrl("");
  }

  function handleHistorySelect(url: string) {
    handleAudit(url);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center py-4">
          <div className="inline-block mb-4">
            <span className="text-6xl" role="img" aria-label="Pulse">
              📊
            </span>
          </div>
          <h1 className="sr-only">Page Pulse - Website Audit Tool</h1>
        </section>

        {/* Audit Form */}
        <section aria-label="Audit form">
          <AuditForm
            onSubmit={handleAudit}
            onReset={handleReset}
            isLoading={loading}
          />
        </section>

        {/* Loading State */}
        {loading && (
          <section aria-label="Loading">
            <LoadingSpinner />
          </section>
        )}

        {/* Error State */}
        {error && !loading && (
          <section aria-label="Error">
            <ErrorCard error={error} onDismiss={() => setError(null)} />
          </section>
        )}

        {/* Results */}
        {result && !loading && (
          <section aria-label="Audit results">
            <ResultCard result={result} url={auditedUrl} />
          </section>
        )}

        {/* Recent Searches */}
        {!loading && (
          <section aria-label="Recent searches">
            <RecentSearches history={history} onSelect={handleHistorySelect} />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
