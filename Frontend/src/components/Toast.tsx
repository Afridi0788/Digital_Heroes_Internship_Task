"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

let addToastGlobal: ((type: ToastType, message: string) => void) | null = null;

export function showToast(type: ToastType, message: string) {
  if (addToastGlobal) {
    addToastGlobal(type, message);
  }
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    addToastGlobal = addToast;
    return () => {
      addToastGlobal = null;
    };
  }, [addToast]);

  function removeToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  const iconMap = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
  };

  const colorMap = {
    success: "border-l-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
    error: "border-l-red-500 bg-red-50 dark:bg-red-900/20",
    info: "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20",
  };

  const iconColorMap = {
    success: "text-emerald-500",
    error: "text-red-500",
    info: "text-blue-500",
  };

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-sm">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type];
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 p-4 rounded-xl border-l-4 shadow-lg ${colorMap[toast.type]} animate-slide-up`}
          >
            <Icon className={`h-5 w-5 flex-shrink-0 ${iconColorMap[toast.type]}`} />
            <p className="text-sm text-slate-700 dark:text-slate-200 flex-1">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5"
            >
              <X className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
