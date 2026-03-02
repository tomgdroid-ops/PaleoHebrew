"use client";

import { useState } from "react";
import { prophecies, type ProphecyCategory } from "@/data/prophecies";
import CategoryFilter from "@/components/prophecies/CategoryFilter";
import ProphecyCard from "@/components/prophecies/ProphecyCard";

export default function PropheciesGrid() {
  const [activeCategory, setActiveCategory] = useState<
    ProphecyCategory | "all"
  >("all");

  const filtered =
    activeCategory === "all"
      ? prophecies
      : prophecies.filter((p) => p.category === activeCategory);

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <CategoryFilter active={activeCategory} onChange={setActiveCategory} />

      <div className="prophecy-grid">
        {filtered.map((prophecy) => (
          <ProphecyCard key={prophecy.id} prophecy={prophecy} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted py-12">
          No prophecies found in this category.
        </p>
      )}
    </section>
  );
}
