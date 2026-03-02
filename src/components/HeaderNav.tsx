"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";

/* ------------------------------------------------------------------ */
/*  NAV DATA                                                           */
/* ------------------------------------------------------------------ */

type NavItem = { href: string; label: string };
type NavGroup = { label: string; items: NavItem[] };
type NavEntry = NavGroup | (NavItem & { standalone: true });

const NAV_ENTRIES: NavEntry[] = [
  {
    label: "Study Tools",
    items: [
      { href: "/torah/genesis/1", label: "Torah Decoder" },
      { href: "/alphabet", label: "Alphabet" },
    ],
  },
  {
    label: "Learn",
    items: [
      { href: "/stone-to-script", label: "Stone to Script" },
      { href: "/guide", label: "Getting Started" },
    ],
  },
  {
    label: "Research",
    items: [
      { href: "/research", label: "All Research" },
      { href: "/aleph-tav", label: "Aleph Tav Study" },
      { href: "/prophecies", label: "Messianic Prophecies" },
      { href: "/research/beyond-ai", label: "Beyond the Reach of AI" },
    ],
  },
  { href: "/about", label: "About", standalone: true as const },
];

function isGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry;
}

/* ------------------------------------------------------------------ */
/*  CHEVRON SVG                                                        */
/* ------------------------------------------------------------------ */

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
    >
      <path d="M2 4 L5 7 L8 4" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  HEADER NAV                                                         */
/* ------------------------------------------------------------------ */

export default function HeaderNav() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close desktop dropdowns on click outside
  useEffect(() => {
    if (!openDropdown) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-nav-dropdown]")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [openDropdown]);

  function handleDropdownEnter(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(label);
  }

  function handleDropdownLeave() {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 150);
  }

  /* ---- THEME TOGGLE BUTTON ---- */
  const themeButton = (
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
  );

  return (
    <header className="border-b border-border bg-surface relative z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="paleo-glyph text-accent text-2xl shrink-0">𐤀𐤕</span>
          <h1 className="text-base sm:text-lg font-semibold text-foreground leading-tight truncate">
            The Aleph Tav Project
          </h1>
        </Link>

        {/* Desktop nav + theme toggle + hamburger */}
        <nav className="flex items-center gap-1 text-sm shrink-0">
          {/* Desktop links (hidden below lg) */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ENTRIES.map((entry) => {
              if (!isGroup(entry)) {
                return (
                  <Link
                    key={entry.href}
                    href={entry.href}
                    className="px-3 py-2 text-muted hover:text-foreground transition-colors rounded-md"
                  >
                    {entry.label}
                  </Link>
                );
              }
              const isOpen = openDropdown === entry.label;
              return (
                <div
                  key={entry.label}
                  className="relative"
                  data-nav-dropdown
                  onMouseEnter={() => handleDropdownEnter(entry.label)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : entry.label)}
                    className="px-3 py-2 text-muted hover:text-foreground transition-colors rounded-md flex items-center gap-1.5"
                  >
                    {entry.label}
                    <Chevron open={isOpen} />
                  </button>
                  {isOpen && (
                    <div className="absolute top-full left-0 mt-1 py-1 min-w-[180px] bg-surface border border-border rounded-lg shadow-lg z-50">
                      {entry.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Theme toggle */}
          {themeButton}

          {/* Mobile hamburger (hidden on lg+) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg bg-surface-hover hover:bg-border transition-colors lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-border bg-surface max-h-[70vh] overflow-y-auto">
          <div className="px-4 py-3">
            {NAV_ENTRIES.map((entry) => {
              if (!isGroup(entry)) {
                return (
                  <Link
                    key={entry.href}
                    href={entry.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-3 text-sm text-muted hover:text-foreground transition-colors border-b border-border/50"
                  >
                    {entry.label}
                  </Link>
                );
              }
              return (
                <div key={entry.label} className="py-3 border-b border-border/50 last:border-b-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-1">
                    {entry.label}
                  </p>
                  {entry.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="block py-2 pl-3 text-sm text-muted hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
