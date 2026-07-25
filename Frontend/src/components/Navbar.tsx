"use client";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 blur-lg opacity-50" />
            </div>
            <div>
              <span className="text-xl font-bold gradient-text">Page Pulse</span>
              <p className="text-xs text-slate-500 -mt-1">Website Auditor</p>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <div className="relative">
              <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            </div>
            <span className="text-xs font-medium text-emerald-400">System Online</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
