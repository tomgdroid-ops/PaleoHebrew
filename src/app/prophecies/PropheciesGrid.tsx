"use client";

import { useState } from "react";
import Link from "next/link";
import { prophecies, CATEGORY_META, type ProphecyCategory } from "@/data/prophecies";
import CategoryFilter from "@/components/prophecies/CategoryFilter";
import ProphecyCard from "@/components/prophecies/ProphecyCard";

export default function PropheciesGrid() {
  const [activeCategory, setActiveCategory] = useState<
    ProphecyCategory | "all"
  >("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered =
    activeCategory === "all"
      ? prophecies
      : prophecies.filter((p) => p.category === activeCategory);

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <CategoryFilter active={activeCategory} onChange={setActiveCategory} />

      <div className="flex justify-end gap-1 mb-4">
        <button
          onClick={() => setViewMode("grid")}
          className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-accent/15 text-accent" : "text-muted hover:text-foreground"}`}
          aria-label="Grid view"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
          </svg>
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-accent/15 text-accent" : "text-muted hover:text-foreground"}`}
          aria-label="List view"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </button>
      </div>

      {viewMode === "grid" ? (
        <div className="prophecy-grid">
          {filtered.map((prophecy) => (
            <ProphecyCard key={prophecy.id} prophecy={prophecy} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((p) => {
            const meta = CATEGORY_META[p.category];
            return (
              <Link
                key={p.id}
                href={`/prophecies/${p.slug}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-surface hover:bg-surface-hover transition-colors"
              >
                <span
                  className="w-7 h-7 rounded-full border-[1.5px] text-xs font-bold flex items-center justify-center shrink-0"
                  style={{ borderColor: meta.color, color: meta.color }}
                >
                  {p.id}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground truncate">{p.title}</h3>
                  <p className="text-xs text-muted">{p.otReference}</p>
                </div>
                <span
                  className="text-[0.6rem] font-semibold uppercase tracking-wide shrink-0"
                  style={{ color: meta.color }}
                >
                  {p.categoryLabel}
                </span>
              </Link>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <p className="text-center text-muted py-12">
          No prophecies found in this category.
        </p>
      )}
    </section>
  );
}
