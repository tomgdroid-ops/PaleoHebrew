"use client";

import { type ProphecyCategory, CATEGORY_META } from "@/data/prophecies";

const CATEGORIES: (ProphecyCategory | "all")[] = [
  "all",
  "lineage",
  "ministry",
  "servant",
  "suffering",
  "resurrection",
  "kingdom",
];

export default function CategoryFilter({
  active,
  onChange,
}: {
  active: ProphecyCategory | "all";
  onChange: (cat: ProphecyCategory | "all") => void;
}) {
  return (
    <div className="prophecy-filter-bar">
      {CATEGORIES.map((cat) => {
        const isActive = active === cat;
        const label = cat === "all" ? "All" : CATEGORY_META[cat].label;
        const color = cat === "all" ? "#c4a35a" : CATEGORY_META[cat].color;

        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`prophecy-filter-pill ${isActive ? "active" : ""}`}
            style={
              isActive
                ? ({ "--pill-color": color } as React.CSSProperties)
                : undefined
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
