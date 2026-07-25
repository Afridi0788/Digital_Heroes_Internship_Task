"use client";

import type { AuditResponse } from "@/lib/types";
import StatCard from "./StatCard";

interface ResultCardProps {
  result: AuditResponse;
  url: string;
  onCopyJson?: () => void;
  onDownloadJson?: () => void;
}

function getStatusInfo(status: number): { status: "success" | "warning" | "danger"; text: string } {
  if (status >= 200 && status < 300) return { status: "success", text: "Success" };
  if (status >= 300 && status < 400) return { status: "warning", text: "Redirect" };
  return { status: "danger", text: "Error" };
}

function getSpeedInfo(ms: number): { status: "success" | "warning" | "danger"; text: string } {
  if (ms < 500) return { status: "success", text: "Fast" };
  if (ms < 2000) return { status: "warning", text: "Moderate" };
  return { status: "danger", text: "Slow" };
}

export default function ResultCard({ result, url, onCopyJson, onDownloadJson }: ResultCardProps) {
  const statusInfo = getStatusInfo(result.status);
  const speedInfo = getSpeedInfo(result.responseTime);

  const handleCopy = () => {
    if (onCopyJson) {
      onCopyJson();
    } else {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    }
  };

  const handleDownload = () => {
    if (onDownloadJson) {
      onDownloadJson();
    } else {
      const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `audit-report-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="card-glass rounded-2xl p-6 border border-emerald-500/20 glow-success animate-bounce-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-emerald-400 blur-lg opacity-30" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Audit Complete</h2>
              <p className="text-sm text-slate-400 truncate max-w-xs sm:max-w-md">{url}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/30 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="HTTP Status"
          value={result.status}
          status={statusInfo.status}
          subtext={statusInfo.text}
          delay={100}
        />

        <StatCard
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Response Time"
          value={`${result.responseTime}ms`}
          status={speedInfo.status}
          subtext={speedInfo.text}
          delay={150}
        />

        <StatCard
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>}
          label="Page Title"
          value={result.title || "Not found"}
          status={result.title ? "success" : "danger"}
          delay={200}
        />

        <StatCard
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          label="Meta Description"
          value={result.metaDescription ? `${result.metaDescription.length} chars` : "Missing"}
          status={result.metaDescription ? "success" : "danger"}
          subtext={result.metaDescription ? result.metaDescription.substring(0, 50) + "..." : "Add a meta description for SEO"}
          delay={250}
        />

        <StatCard
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>}
          label="H1 Tags"
          value={result.h1Count}
          status={result.h1Count === 1 ? "success" : result.h1Count === 0 ? "danger" : "warning"}
          subtext={result.h1Count === 1 ? "Perfect!" : result.h1Count === 0 ? "Add an H1 tag" : "Use only one H1"}
          delay={300}
        />

        <StatCard
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          label="Missing ALT"
          value={result.missingAltImages}
          status={result.missingAltImages === 0 ? "success" : "danger"}
          subtext={result.missingAltImages === 0 ? "All images accessible" : "Add ALT attributes"}
          delay={350}
        />
      </div>

      {/* Word Count Card */}
      <div className="card-glass rounded-xl p-6 border border-slate-700/50 animate-slide-up" style={{ animationDelay: "400ms" }}>
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Word Count</p>
            <p className="text-3xl font-bold text-white">{result.wordCount.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-1">Visible body text (scripts & styles excluded)</p>
          </div>
        </div>
      </div>

      {/* Summary Pills */}
      <div className="card-glass rounded-xl p-5 border border-slate-700/50 animate-slide-up" style={{ animationDelay: "450ms" }}>
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Quick Summary</h3>
        <div className="flex flex-wrap gap-2">
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${statusInfo.status === "success" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
            Status: {result.status}
          </span>
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${speedInfo.status === "success" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : speedInfo.status === "warning" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
            {result.responseTime}ms
          </span>
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${result.title ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
            Title: {result.title ? "✓" : "✗"}
          </span>
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${result.metaDescription ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
            Meta: {result.metaDescription ? "✓" : "✗"}
          </span>
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${result.h1Count === 1 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"}`}>
            H1: {result.h1Count}
          </span>
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${result.missingAltImages === 0 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
            Missing ALT: {result.missingAltImages}
          </span>
        </div>
      </div>
    </div>
  );
}
