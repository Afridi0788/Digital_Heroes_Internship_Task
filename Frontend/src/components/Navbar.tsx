"use client";

import { useState, useEffect } from "react";
import { Activity, Moon, Sun } from "lucide-react";

export default function Navbar() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <nav className="sticky top-0 z-50 glass">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500 rounded-lg shadow-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Page Pulse
            </span>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white/20 dark:bg-slate-800/50 hover:bg-white/40 dark:hover:bg-slate-700/50 transition-all duration-200 hover:scale-105"
            aria-label="Toggle dark mode"
          >
            {dark ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
