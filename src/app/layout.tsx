import type { Metadata } from 'next';
import './globals.css';
import { Figtree } from "next/font/google";
import { cn } from "@/lib/utils";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Cross-Unity',
  description: 'Home Services Directory + Provider Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", figtree.variable)}>
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4">
          <header className="flex items-center justify-between py-4">
            <a href="/" className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white">
                CU
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold">Cross-Unity</div>
                <div className="text-xs text-slate-500">Home Services Directory</div>
              </div>
            </a>

            <nav className="flex items-center gap-3">
              <a
                href="/hello"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Hello
              </a>
              <a
                href="/provider/login"
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Provider Login
              </a>
            </nav>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t py-6 text-sm text-slate-500">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>© {new Date().getFullYear()} Cross-Unity</div>
              <div className="flex gap-4">
                <a className="hover:text-slate-700" href="#">
                  Privacy
                </a>
                <a className="hover:text-slate-700" href="#">
                  Terms
                </a>
                <a className="hover:text-slate-700" href="#">
                  Contact
                </a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}