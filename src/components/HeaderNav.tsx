"use client";

import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";

export default function HeaderNav() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-border bg-surface">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="paleo-glyph text-accent text-2xl">𐤀𐤁</span>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Torah Decoder
            </h1>
            <p className="text-xs text-muted">
              Pictographic Word Analysis
            </p>
          </div>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/torah/genesis/1"
            className="text-muted hover:text-foreground transition-colors hidden sm:inline"
          >
            Read Torah
          </Link>
          <Link
            href="/guide"
            className="text-muted hover:text-foreground transition-colors hidden sm:inline"
          >
            How It Works
          </Link>
          <Link
            href="/about"
            className="text-muted hover:text-foreground transition-colors hidden sm:inline"
          >
            About
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-surface-hover hover:bg-border transition-colors"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
