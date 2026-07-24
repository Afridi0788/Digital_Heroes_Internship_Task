"use client";

import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto py-8 text-center">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-center gap-1 text-sm text-slate-500 dark:text-slate-400">
          <span>Built for</span>
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors underline underline-offset-2"
          >
            Digital Heroes
          </a>
          <span>Training Task</span>
          <Heart className="h-3.5 w-3.5 text-red-400 ml-1" />
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
          © {new Date().getFullYear()} Page Pulse. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
