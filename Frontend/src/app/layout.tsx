import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page Pulse — Website Audit Tool",
  description:
    "Audit any public website URL. Analyze page title, meta description, H1 tags, missing alt images, word count, and more.",
  keywords: ["website audit", "SEO", "page analysis", "web performance"],
  authors: [{ name: "Page Pulse" }],
  openGraph: {
    title: "Page Pulse — Website Audit Tool",
    description: "Audit any public website URL instantly.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('theme');
                  if (mode === 'dark' || (!mode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 text-slate-900 dark:text-slate-100 antialiased transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
