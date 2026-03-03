import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContinueExploring from "@/components/ContinueExploring";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Original research exploring the Hebrew Scriptures through computational analysis, ancient language study, and pattern discovery.",
};

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

type ResearchCard = {
  title: string;
  abstract: string;
  href: string;
  status: "Published" | "Coming Soon";
  highlights: string[];
};

const RESEARCH_CARDS: ResearchCard[] = [
  {
    title: "The Aleph Tav (\u05D0\u05EA) Covenant Marker Study",
    status: "Published",
    abstract:
      "A comprehensive computational scan of the Westminster Leningrad Codex tracking the Aleph Tav grammatical marker across all 23,213 verses of the Hebrew Bible. The analysis reveals that the untranslated \u05D0\u05EA appears and disappears before personal names in direct correlation with covenant events.",
    href: "/aleph-tav",
    highlights: ["23,213 verses analyzed", "11 names tracked", "3 covenant patterns"],
  },
  {
    title: "Beyond the Reach of AI: A Computational Case for Divine Authorship",
    status: "Published",
    abstract:
      "Can artificial intelligence create Scripture? An examination of seven simultaneous constraint systems operating in the Hebrew text, including pictographic encoding, Aleph Tav patterns, Equidistant Letter Sequences, chiastic structures, and mathematical encoding. Conservative probability analysis places the odds of all patterns co-occurring by chance at approximately 1 in 10\u00B3\u2078.",
    href: "/research/beyond-ai",
    highlights: ["7 constraint systems", "12 case studies", "1 in 10\u00B3\u2078 probability"],
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function ResearchPage() {
  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="research-hero">
        <div className="research-hero-inner">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Research
          </h1>
          <p className="text-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Original research exploring the Hebrew Scriptures through
            computational analysis, ancient language study, and pattern
            discovery.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 pt-8">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Research" }]} />
      </div>

      {/* ===== CARDS ===== */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="flex flex-col gap-6">
          {RESEARCH_CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group block p-8 rounded-xl border border-border bg-surface hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`text-[0.65rem] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${
                    card.status === "Published"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-accent/20 text-accent"
                  }`}
                  data-status={card.status}
                >
                  {card.status}
                </span>
              </div>
              <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-4">
                {card.title}
              </h2>
              <p className="text-base text-muted leading-relaxed mb-4">
                {card.abstract}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {card.highlights.map((h) => (
                  <span
                    key={h}
                    className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent"
                  >
                    {h}
                  </span>
                ))}
              </div>
              <span className="inline-block text-sm font-medium text-primary group-hover:underline">
                Read more &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      <ContinueExploring
        links={[
          { title: "Aleph Tav Study", description: "Explore how the Aleph Tav covenant marker appears throughout Scripture.", href: "/aleph-tav" },
          { title: "Messianic Prophecies", description: "37 Old Testament prophecies examined with manuscript and historical evidence.", href: "/prophecies" },
        ]}
      />
    </div>
  );
}
