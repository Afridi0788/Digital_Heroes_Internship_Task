export default function Footer() {
  return (
    <footer className="border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-semibold text-slate-300">Page Pulse</span>
          </div>

          {/* Credit */}
          <p className="text-sm text-slate-400 text-center">
            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2"
            >
              Built for Digital Heroes Training Task
            </a>
          </p>

          {/* Tech stack */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Powered by</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs font-medium bg-slate-800 rounded text-slate-400">Next.js</span>
              <span className="px-2 py-1 text-xs font-medium bg-slate-800 rounded text-slate-400">React</span>
              <span className="px-2 py-1 text-xs font-medium bg-slate-800 rounded text-slate-400">TypeScript</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-800/50 text-center">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Page Pulse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
