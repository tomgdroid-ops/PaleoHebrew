import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about The Aleph Tav Project, its mission, tools, data sources, and the researcher behind it.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />

      <h2 className="text-3xl font-bold mb-10">About The Aleph Tav Project</h2>

      {/* Section 1: The Mission */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary">The Mission</h3>
        <p className="leading-relaxed mb-4">
          The Aleph Tav Project is an ongoing effort to explore the Hebrew
          Scriptures through their ancient language, combining interactive study
          tools, computational analysis, and original research. It is built on
          the conviction that the Hebrew text contains layers of meaning far
          beyond what surface-level translation can reveal, and that modern
          technology can help us see what has been embedded in the text for
          thousands of years.
        </p>
        <p className="leading-relaxed mb-4">
          The name comes from the Aleph (&#x05D0;) and Tav (&#x05EA;), the
          first and last letters of the Hebrew alphabet. Throughout the Hebrew
          Scriptures, the untranslated marker{" "}
          <span className="hebrew-text" lang="he">&#x05D0;&#x05EA;</span>{" "}
          appears thousands of times as a grammatical particle that most
          translations skip entirely. This project explores the possibility that
          its placement is not random but purposeful, part of a larger pattern
          woven through the entire text.
        </p>
        <p className="leading-relaxed">
          Every tool and study on this site is designed to help readers engage
          with the Hebrew Scriptures more deeply: through the pictographic
          meanings of ancient letters, through patterns hidden in the
          text&apos;s mathematical structure, and through the covenant markers
          that track God&apos;s relationship with His people.
        </p>
      </section>

      {/* Section 2: What You'll Find Here */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary">
          What You&apos;ll Find Here
        </h3>
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-border bg-surface">
            <h4 className="font-semibold mb-1">
              <Link href="/torah/genesis/1" className="text-primary hover:underline">
                Torah Decoder
              </Link>
            </h4>
            <p className="text-sm text-muted leading-relaxed">
              An interactive interlinear Torah reader that lets you click any
              Hebrew word to see its Paleo-Hebrew pictographs, letter-by-letter
              meanings, and algorithmically generated interpretive sentences
              ranked by scholarly consensus.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-surface">
            <h4 className="font-semibold mb-1">
              <Link href="/alphabet" className="text-primary hover:underline">
                The Ancient Alphabet
              </Link>
            </h4>
            <p className="text-sm text-muted leading-relaxed">
              A complete reference for all 22 Hebrew letters, showing their
              pictographic origins, ideographic meanings, gematria values, and
              how they evolved from carved stone to modern script.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-surface">
            <h4 className="font-semibold mb-1">
              <Link href="/stone-to-script" className="text-primary hover:underline">
                From Stone to Script
              </Link>
            </h4>
            <p className="text-sm text-muted leading-relaxed">
              An educational journey through the history of the Hebrew alphabet,
              from Proto-Sinaitic inscriptions through the Babylonian Exile to
              the square script used in Torah scrolls today.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-surface">
            <h4 className="font-semibold mb-1">
              <Link href="/aleph-tav" className="text-primary hover:underline">
                The Aleph Tav Study
              </Link>
            </h4>
            <p className="text-sm text-muted leading-relaxed">
              Original research tracking the{" "}
              <span className="hebrew-text" lang="he">&#x05D0;&#x05EA;</span>{" "}
              covenant marker across the entire Hebrew Bible, revealing how it
              appears and disappears before personal names in correlation with
              covenant events.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-surface">
            <h4 className="font-semibold mb-1">
              <Link href="/research" className="text-primary hover:underline">
                Research Papers
              </Link>
            </h4>
            <p className="text-sm text-muted leading-relaxed">
              A growing collection of original research exploring computational
              patterns, statistical analysis, and structural evidence within the
              Hebrew Scriptures.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: About the Author */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary">
          About the Author
        </h3>
        <p className="leading-relaxed mb-4">
          Tom Guadagno is the creator and researcher behind The Aleph Tav
          Project. His work combines a deep reverence for the Hebrew Scriptures
          with modern computational tools to uncover patterns and structures
          that traditional study methods can miss. The project began with a
          single question: what do the ancient pictographic letters reveal about
          the words they form? That question led to the Torah Decoder, which led
          to the Aleph Tav covenant marker study, which led to a broader
          investigation of the multi-layered encoding in the Hebrew text.
        </p>
        <p className="leading-relaxed">
          Tom&apos;s approach is rooted in his faith in Christ and a commitment
          to letting the text speak for itself. Every tool on this site is
          designed to bring readers closer to the original Hebrew, not to
          replace careful study but to enhance it with capabilities that were
          not possible before the digital age.
        </p>
      </section>

      {/* Section 4: Sources and Attribution */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary">
          Sources and Attribution
        </h3>
        <div className="space-y-3">
          <div className="p-4 rounded-lg border border-border bg-surface">
            <h4 className="font-semibold">Sefaria</h4>
            <p className="text-sm text-muted">
              Torah Hebrew text and English translations. Sefaria is a free,
              open-source library of Jewish texts.
            </p>
            <a
              href="https://www.sefaria.org"
              className="text-sm text-primary underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by Sefaria
            </a>
          </div>
          <div className="p-4 rounded-lg border border-border bg-surface">
            <h4 className="font-semibold">
              Open Scriptures Hebrew Bible (OSHB)
            </h4>
            <p className="text-sm text-muted">
              Word-level morphological data with lexical annotations. Licensed
              CC BY 4.0.
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
            <h4 className="font-semibold">
              Strong&apos;s Hebrew Concordance
            </h4>
            <p className="text-sm text-muted">
              Hebrew dictionary mapping words to definitions, transliterations,
              and parts of speech. Public domain.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-surface">
            <h4 className="font-semibold">
              Paleo-Hebrew Letter Meanings
            </h4>
            <p className="text-sm text-muted">
              Compiled from multiple scholarly sources including the Ancient
              Hebrew Research Center, Father&apos;s Alphabet, and
              Hebrew4Christians.
            </p>
          </div>
          <p className="text-sm text-muted italic leading-relaxed">
            The pictographic letter meaning matrix used in the Torah Decoder is
            an original compilation cross-referenced from multiple academic and
            popular sources. It is not a reproduction of any single
            author&apos;s work.
          </p>
        </div>
      </section>

      {/* Section 5: Contact */}
      <section className="mb-4">
        <h3 className="text-xl font-semibold mb-4 text-primary">
          Feedback
        </h3>
        <p className="leading-relaxed text-muted">
          This project is a labor of love and an ongoing work in progress. If
          you have feedback, corrections, or suggestions, feel free to reach
          out.
        </p>
      </section>

      <div className="text-center pt-8 border-t border-border">
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
