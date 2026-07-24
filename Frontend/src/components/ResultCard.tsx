"use client";

import {
  Globe,
  Clock,
  FileText,
  Tag,
  Heading1,
  ImageOff,
  LetterText,
  Copy,
  Download,
  CheckCircle,
} from "lucide-react";
import StatCard from "./StatCard";
import { showToast } from "./Toast";
import type { AuditResponse } from "@/lib/types";
import { useState } from "react";

interface ResultCardProps {
  result: AuditResponse;
  url: string;
}

function getStatusColor(status: number): string {
  if (status >= 200 && status < 300) return "bg-emerald-500";
  if (status >= 300 && status < 400) return "bg-yellow-500";
  if (status >= 400 && status < 500) return "bg-orange-500";
  return "bg-red-500";
}

function getStatusLabel(status: number): string {
  if (status >= 200 && status < 300) return "Success";
  if (status >= 300 && status < 400) return "Redirect";
  if (status >= 400 && status < 500) return "Client Error";
  return "Server Error";
}

function getResponseTimeColor(ms: number): string {
  if (ms < 500) return "bg-emerald-500";
  if (ms < 1500) return "bg-yellow-500";
  return "bg-red-500";
}

export default function ResultCard({ result, url }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const report = {
    url,
    ...result,
    auditedAt: new Date().toISOString(),
  };

  function copyJson() {
    navigator.clipboard
      .writeText(JSON.stringify(report, null, 2))
      .then(() => {
        setCopied(true);
        showToast("success", "Report copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        showToast("error", "Failed to copy to clipboard");
      });
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    const hostname = new URL(url).hostname.replace(/\./g, "-");
    a.download = `page-pulse-report-${hostname}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
    showToast("success", "Report downloaded!");
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white truncate">
              {result.title}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-1">
              {url}
            </p>
            {result.metaDescription !== "No meta description found" && (
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                {result.metaDescription}
              </p>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={copyJson}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              title="Copy JSON Report"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={downloadJson}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all"
              title="Download JSON Report"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={Globe}
          label="HTTP Status"
          value={result.status}
          subtitle={getStatusLabel(result.status)}
          colorClass={getStatusColor(result.status)}
          delay={0}
        />
        <StatCard
          icon={Clock}
          label="Response Time"
          value={`${result.responseTime}ms`}
          subtitle={
            result.responseTime < 500
              ? "Fast"
              : result.responseTime < 1500
                ? "Moderate"
                : "Slow"
          }
          colorClass={getResponseTimeColor(result.responseTime)}
          delay={50}
        />
        <StatCard
          icon={FileText}
          label="Page Title"
          value={result.title.length > 20 ? result.title.slice(0, 20) + "…" : result.title}
          subtitle={`${result.title.length} characters`}
          colorClass="bg-blue-500"
          delay={100}
        />
        <StatCard
          icon={Tag}
          label="Meta Description"
          value={
            result.metaDescription === "No meta description found"
              ? "Missing"
              : result.metaDescription.length > 20
                ? result.metaDescription.slice(0, 20) + "…"
                : result.metaDescription
          }
          subtitle={
            result.metaDescription === "No meta description found"
              ? "Not set"
              : `${result.metaDescription.length} characters`
          }
          colorClass={
            result.metaDescription === "No meta description found"
              ? "bg-amber-500"
              : "bg-teal-500"
          }
          delay={150}
        />
        <StatCard
          icon={Heading1}
          label="H1 Tags"
          value={result.h1Count}
          subtitle={
            result.h1Count === 0
              ? "Missing — add one for SEO"
              : result.h1Count === 1
                ? "Perfect — one H1 tag"
                : "Multiple — consider using only one"
          }
          colorClass={
            result.h1Count === 1
              ? "bg-emerald-500"
              : result.h1Count === 0
                ? "bg-red-500"
                : "bg-amber-500"
          }
          delay={200}
        />
        <StatCard
          icon={ImageOff}
          label="Images Missing ALT"
          value={result.missingAltImages}
          subtitle={
            result.missingAltImages === 0
              ? "All images have alt text"
              : `${result.missingAltImages} image(s) need alt text`
          }
          colorClass={result.missingAltImages === 0 ? "bg-emerald-500" : "bg-red-500"}
          delay={250}
        />
        <StatCard
          icon={LetterText}
          label="Word Count"
          value={result.wordCount.toLocaleString()}
          subtitle={
            result.wordCount < 300
              ? "Thin content"
              : result.wordCount < 1000
                ? "Average content"
                : "Rich content"
          }
          colorClass={
            result.wordCount < 300
              ? "bg-amber-500"
              : result.wordCount < 1000
                ? "bg-blue-500"
                : "bg-emerald-500"
          }
          delay={300}
        />
      </div>
    </div>
  );
}
