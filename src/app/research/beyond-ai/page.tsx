import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Beyond the Reach of AI",
  description:
    "A computational case for divine authorship of the Hebrew Scriptures, examining seven simultaneous constraint systems that no AI could reproduce.",
};

/* ------------------------------------------------------------------ */
/*  CONSTRAINT DATA                                                    */
/* ------------------------------------------------------------------ */

const CONSTRAINTS = [
  {
    number: 1,
    title: "Pictographic Sentence Encoding",
    body: "Every Hebrew word can be decomposed into its Paleo-Hebrew pictographic letters, and the combined meanings form coherent interpretive sentences. This is not isolated to a handful of theological terms; it operates across all ~2,000 unique roots in the Torah simultaneously. An author working in this system would need to choose every word such that its consonantal spelling, when read as a sequence of pictographs, produces a meaningful sentence that reinforces the narrative context.",
    stat: "~2,000 roots simultaneously encoded",
  },
  {
    number: 2,
    title: "The Aleph Tav (\u05D0\u05EA) Covenant Marker",
    body: "The untranslated direct object marker \u05D0\u05EA appears and disappears before personal names in correlation with covenant standing. Computational scanning across all 23,213 verses of the Hebrew Bible confirms consistent patterns: Cain loses the marker after murder, Esau after despising his birthright, Ruth gains it after redemption. These patterns hold across books attributed to different authors and time periods.",
    stat: "23,213 verses scanned with consistent patterns",
  },
  {
    number: 3,
    title: "Equidistant Letter Sequences (ELS)",
    body: 'Statistically significant letter patterns appear at fixed intervals throughout the Torah text. When the entire text is arranged as a continuous string and sampled at regular skip intervals, meaningful words and phrases emerge at rates that exceed what random letter distributions would produce. These structural patterns persist across books traditionally attributed to different authors writing centuries apart.',
    stat: "Patterns span across multiple books",
  },
  {
    number: 4,
    title: "Chiastic Literary Structures",
    body: "The Torah contains nested chiasms (ABCBA mirror patterns) at the verse, passage, book, and cross-book levels simultaneously. A single chiasm is a common literary device. But nested, interlocking chiasms that operate at multiple scales, where the center of a passage-level chiasm aligns with the turning point of a book-level chiasm, require architectural planning that spans thousands of verses.",
    stat: "Multi-scale nesting across thousands of verses",
  },
  {
    number: 5,
    title: "Mathematical Encoding",
    body: "Hebrew letters carry numerical values (gematria), and key words and phrases throughout the Torah form consistent numerical patterns. Heptadic (seven-based) structures appear throughout the text at rates that exceed random chance. The number of words, letters, and vocabulary items in structured passages frequently resolve to multiples of seven.",
    stat: "Heptadic patterns exceed random probability",
  },
  {
    number: 6,
    title: "Cross-Millennial Consistency",
    body: "The Torah was composed across multiple centuries by different authors in different circumstances, yet all encoding layers remain internally consistent. The pictographic meanings do not contradict the covenant marker patterns. The ELS structures do not break at the seams between books. The chiastic structures span editorial boundaries. This would require coordination across authors who could not have communicated with each other.",
    stat: "Consistency spans centuries of authorship",
  },
  {
    number: 7,
    title: "Statistical Probability",
    body: "When conservative probability estimates for each independent layer are combined, the compound probability of all seven patterns co-occurring by chance becomes vanishingly small. Even using generous assumptions that favor random occurrence, the odds land at approximately 1 in 10\u00B3\u2078. For reference, the estimated number of atoms in the observable universe is approximately 10\u2078\u2070.",
    stat: "~1 in 10\u00B3\u2078 probability of chance occurrence",
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

const ARTICLE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Beyond the Reach of AI",
  description:
    "A computational case for divine authorship of the Hebrew Scriptures, examining seven simultaneous constraint systems that no AI could reproduce.",
  author: { "@type": "Person", name: "Tom Guadagno" },
  publisher: { "@type": "Organization", name: "The Aleph Tav Project" },
};

export default function BeyondAIPage() {
  return (
    <div>
      <JsonLd data={ARTICLE_JSONLD} />
      {/* ===== HERO ===== */}
      <section className="research-hero">
        <div className="research-hero-inner">
          <Link
            href="/research"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6"
          >
            &larr; Back to Research
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Beyond the Reach of AI
          </h1>
          <p className="text-lg sm:text-xl text-muted mb-3">
            A Computational Case for Divine Authorship of the Hebrew Scriptures
          </p>
          <p className="text-sm text-muted">By Tom Guadagno</p>
          <div className="mt-6 h-px w-24 mx-auto bg-accent/50" />
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 pt-8">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Research", href: "/research" }, { label: "Beyond the Reach of AI" }]} />
      </div>

      {/* ===== ARTICLE BODY ===== */}
      <article className="research-article">
        {/* Introduction */}
        <section className="mb-12">
          <p className="mb-4">
            What if the Hebrew Scriptures contain not one layer of meaning, but
            seven? And what if those layers operate simultaneously across the
            entire text, interlocking in ways that no single human author could
            have coordinated? These are not hypothetical questions. Computational
            analysis of the Torah reveals multiple independent encoding systems
            running in parallel: pictographic meanings embedded in every word,
            covenant markers that track across thousands of verses, mathematical
            patterns woven into the letter counts, and literary structures that
            mirror themselves at every scale from single verses to entire books.
          </p>
          <p className="mb-4">
            The question this research asks is straightforward: could modern
            artificial intelligence, the most powerful text-generation technology
            ever created, reproduce this feat? Could a large language model
            generate text that simultaneously satisfies all seven constraint
            systems while remaining coherent, narratively compelling, and
            theologically consistent?
          </p>
          <p>
            The answer, based on the computational analysis presented here, is
            no. Not because AI lacks sophistication, but because the
            architecture of these encoding layers requires a kind of
            multi-dimensional optimization that no existing model is designed to
            perform.
          </p>
        </section>

        {/* Seven Constraints */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            The Seven Constraint Systems
          </h2>

          <div className="space-y-8">
            {CONSTRAINTS.map((c) => (
              <div key={c.number} className="research-constraint">
                <div className="research-constraint-badge">{c.number}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {c.title}
                  </h3>
                  <p className="text-muted leading-relaxed mb-3">{c.body}</p>
                  <p className="text-sm font-semibold text-primary">
                    {c.stat}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Limitation */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            The AI Limitation
          </h2>
          <p className="mb-4">
            Current AI architectures, including the most advanced large language
            models, optimize for a single objective function: predicting the
            next token in a sequence based on statistical patterns in training
            data. They excel at producing fluent, contextually appropriate text
            in one language at a time, optimizing for one measure of quality at a
            time. Generating text that simultaneously satisfies pictographic
            encoding at the letter level, maintains ELS patterns at fixed skip
            intervals across the entire corpus, preserves nested chiastic
            structures at multiple scales, embeds consistent gematria values, and
            tracks covenant markers across personal names would require
            multi-dimensional optimization across at least seven independent
            constraint spaces.
          </p>
          <p>
            No existing model architecture supports this. Attempts to satisfy
            one constraint would violate others. The Torah text satisfies all
            of them at once.
          </p>
        </section>

        {/* Conclusion */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Conclusion
          </h2>
          <p>
            This analysis is offered not as a polemical argument but as an
            invitation. The Hebrew Scriptures contain layers of structure that
            reward close, careful examination. Whether one reads these patterns
            as evidence of divine authorship or as remarkable artifacts of an
            ancient literary tradition, they deserve serious attention. The tools
            on this site are built to help you explore them for yourself.
          </p>
        </section>

        {/* Download */}
        <section className="text-center py-8 border-t border-border">
          <p className="text-sm text-muted mb-4">
            Want to read the full 31-page research paper?
          </p>
          <span className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-lg font-medium border border-primary/20">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Full PDF Coming Soon
          </span>
        </section>

        {/* Bottom nav */}
        <div className="pt-8 border-t border-border">
          <Link
            href="/research"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
          >
            &larr; Back to Research
          </Link>
        </div>
      </article>
    </div>
  );
}
