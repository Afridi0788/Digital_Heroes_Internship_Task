"use client";

import {
  AlertTriangle,
  Clock,
  ServerCrash,
  WifiOff,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import type { ErrorResponse } from "@/lib/types";

interface ErrorCardProps {
  error: ErrorResponse;
  onDismiss?: () => void;
}

function getErrorConfig(error: ErrorResponse) {
  const status = error.status;
  const errorType = error.error.toLowerCase();

  if (status === 400 || errorType.includes("invalid") || errorType.includes("validation")) {
    return {
      icon: AlertTriangle,
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      borderColor: "border-amber-200 dark:border-amber-800",
      iconColor: "text-amber-500",
      titleColor: "text-amber-800 dark:text-amber-300",
    };
  }

  if (status === 408 || errorType.includes("timeout")) {
    return {
      icon: Clock,
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800",
      iconColor: "text-orange-500",
      titleColor: "text-orange-800 dark:text-orange-300",
    };
  }

  if (
    errorType.includes("host") ||
    errorType.includes("unreachable") ||
    errorType.includes("unknown")
  ) {
    return {
      icon: WifiOff,
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
      iconColor: "text-red-500",
      titleColor: "text-red-800 dark:text-red-300",
    };
  }

  if (errorType.includes("ssl")) {
    return {
      icon: ShieldAlert,
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      iconColor: "text-purple-500",
      titleColor: "text-purple-800 dark:text-purple-300",
    };
  }

  if (status >= 500) {
    return {
      icon: ServerCrash,
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
      iconColor: "text-red-500",
      titleColor: "text-red-800 dark:text-red-300",
    };
  }

  return {
    icon: XCircle,
    bgColor: "bg-slate-50 dark:bg-slate-800/50",
    borderColor: "border-slate-200 dark:border-slate-700",
    iconColor: "text-slate-500",
    titleColor: "text-slate-800 dark:text-slate-300",
  };
}

export default function ErrorCard({ error, onDismiss }: ErrorCardProps) {
  const config = getErrorConfig(error);
  const Icon = config.icon;

  return (
    <div
      className={`rounded-2xl border-2 ${config.bgColor} ${config.borderColor} p-6 animate-slide-up`}
      role="alert"
    >
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-lg ${config.bgColor}`}>
          <Icon className={`h-6 w-6 ${config.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-lg ${config.titleColor}`}>
            {error.error}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {error.message}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            Status: {error.status} · {new Date(error.timestamp).toLocaleString()}
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Dismiss error"
          >
            <XCircle className="h-5 w-5 text-slate-400" />
          </button>
        )}
      </div>
    </div>
  );
}
