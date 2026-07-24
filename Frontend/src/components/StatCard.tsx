"use client";

import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  colorClass: string;
  delay?: number;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  colorClass,
  delay = 0,
}: StatCardProps) {
  return (
    <div
      className="glass-card rounded-2xl p-5 animate-slide-up group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-4">
        <div
          className={`p-2.5 rounded-xl ${colorClass} shadow-lg group-hover:scale-110 transition-transform duration-200`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-0.5 truncate">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
