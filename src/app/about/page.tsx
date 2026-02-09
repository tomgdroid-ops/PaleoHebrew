import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About - Paleo-Hebrew Torah Decoder",
  description:
    "Learn about the Paleo-Hebrew Torah Decoder, its data sources, methodology, and scholarly context.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-6">About This Project</h2>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-3">What Is This?</h3>
        <p className="text-muted leading-relaxed">
          The Paleo-Hebrew Torah Decoder is an interactive tool for exploring the
          pictographic origins of Hebrew letters within the Torah text. Each
          Hebrew letter descends from an ancient pictograph — Aleph from an ox
          head (meaning strength/leader), Bet from a house floor plan (meaning
          family/dwelling), and so on. This app decomposes every Hebrew word in
          the Torah into its constituent letters, shows their ancient pictographic
          forms, and generates interpretive sentences by combining the pictographic
          meanings of each letter.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Scholarly Context</h3>
        <p className="text-muted leading-relaxed mb-3">
          Pictographic analysis represents one interpretive lens for Hebrew words.
          The Hebrew alphabet evolved from Proto-Sinaitic/Proto-Canaanite
          pictographs through Phoenician into the square script (Ktav Ashuri)
          used today. While the pictographic origins of the letters are well
          established by epigraphy and comparative Semitics, scholars debate the
          extent to which pictographic meanings should be read into fully
          alphabetic Hebrew text.
        </p>
        <p className="text-muted leading-relaxed">
          This app presents pictographic readings as an enrichment tool and study
          aid, not as a replacement for standard lexical definitions. The
          generated interpretive sentences are algorithmic combinations of letter
          meanings, not authoritative translations. Always consult standard
          Hebrew lexicons (BDB, HALOT) and scholarly commentaries for
          definitive word meanings.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Data Sources</h3>
        <div className="space-y-3">
          <div className="p-4 rounded-lg border border-border bg-surface">
            <h4 className="font-semibold">Sefaria</h4>
            <p className="text-sm text-muted">
              Torah Hebrew text and English translations.
              Sefaria is a free, open-source library of Jewish texts.
            </p>
            <a
              href="https://www.sefaria.org"
              className="text-sm text-primary underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              sefaria.org
            </a>
          </div>
          <div className="p-4 rounded-lg border border-border bg-surface">
            <h4 className="font-semibold">
              Open Scriptures Hebrew Bible (OSHB)
            </h4>
            <p className="text-sm text-muted">
              Word-level morphological data with Strong&apos;s number
              annotations. Licensed CC BY 4.0.
            </p>
            <a
              href="https://hb.openscriptures.org"
              className="text-sm text-primary underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              hb.openscriptures.org
            </a>
          </div>
          <div className="p-4 rounded-lg border border-border bg-surface">
            <h4 className="font-semibold">Strong&apos;s Concordance</h4>
            <p className="text-sm text-muted">
              Hebrew dictionary mapping Strong&apos;s numbers to definitions,
              transliterations, and parts of speech. Public domain (originally
              published 1890).
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-surface">
            <h4 className="font-semibold">Letter Meanings Matrix</h4>
            <p className="text-sm text-muted">
              The 22-letter pictographic meaning dataset was compiled from
              multiple sources including the Ancient Hebrew Research Center,
              academic Semitic linguistics references, and cross-referenced
              Proto-Sinaitic scholarship.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-3">How the Decoder Works</h3>
        <ol className="list-decimal list-inside space-y-2 text-muted">
          <li>The Hebrew word is decomposed into individual consonant letters</li>
          <li>Vowel points (nikkud) are stripped and final letter forms normalized</li>
          <li>Each consonant is mapped to its Paleo-Hebrew (Phoenician) pictograph</li>
          <li>The pictographic meanings for each letter are retrieved from the dataset</li>
          <li>A sentence engine generates combinations using grammatical templates</li>
          <li>Sentences are scored by scholarly frequency, grammatical naturalness, and relevance</li>
          <li>The top-ranked interpretive sentences are displayed to the user</li>
        </ol>
      </section>

      <div className="text-center pt-6 border-t border-border">
        <Link
          href="/torah/genesis/1"
          className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors"
        >
          Start Exploring
        </Link>
      </div>
    </div>
  );
}
