"use client";

import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  status: "success" | "warning" | "danger";
  subtext?: string;
  delay?: number;
}

export default function StatCard({ icon, label, value, status, subtext, delay = 0 }: StatCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "success":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "warning":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "danger":
        return "bg-red-500/20 text-red-400 border-red-500/30";
    }
  };

  const getIconBackground = () => {
    switch (status) {
      case "success":
        return "from-emerald-500 to-teal-600";
      case "warning":
        return "from-amber-500 to-orange-600";
      case "danger":
        return "from-red-500 to-rose-600";
    }
  };

  return (
    <div
      className="card-glass rounded-xl p-5 border border-slate-700/50 stat-card animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getIconBackground()} flex items-center justify-center shadow-lg`}>
          {icon}
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge()}`}>
          {status.toUpperCase()}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-white mt-1 truncate" title={String(value)}>
          {value}
        </p>
        {subtext && (
          <p className="text-xs text-slate-500 mt-1 truncate" title={subtext}>
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}
