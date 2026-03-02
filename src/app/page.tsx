import Link from "next/link";
import Image from "next/image";
import BookHero from "@/components/BookHero";

const SECTION_CARDS = [
  {
    title: "Torah Decoder",
    description:
      "Navigate the five books of the Torah. Click any Hebrew word to see its Paleo-Hebrew pictographs, letter meanings, and generated interpretive sentences.",
    href: "/torah/genesis/1",
    gradient: "from-amber-900/80 via-amber-800/60 to-yellow-900/80",
    gradientLight: "from-amber-200/80 via-amber-100/60 to-yellow-200/80",
  },
  {
    title: "The Ancient Alphabet",
    description:
      "Explore all 22 letters of the Hebrew alphabet with their pictographic origins, meanings, gematria values, and how they evolved over 3,000 years.",
    href: "/alphabet",
    gradient: "from-stone-900/80 via-stone-800/60 to-amber-900/80",
    gradientLight: "from-stone-200/80 via-stone-100/60 to-amber-200/80",
  },
  {
    title: "From Stone to Script",
    description:
      "Trace the journey of the Hebrew alphabet from Proto-Sinaitic carvings through the Babylonian Exile to the script used today.",
    href: "/stone-to-script",
    gradient: "from-yellow-900/80 via-stone-800/60 to-stone-900/80",
    gradientLight: "from-yellow-200/80 via-stone-100/60 to-stone-200/80",
  },
  {
    title: "The Aleph Tav (\u05D0\u05EA) Study",
    description:
      "Discover how the untranslated Aleph Tav marker appears and disappears before names in the Hebrew Bible, tracking covenant standing across Scripture.",
    href: "/aleph-tav",
    gradient: "from-indigo-900/80 via-slate-800/60 to-amber-900/80",
    gradientLight: "from-indigo-200/80 via-slate-100/60 to-amber-200/80",
  },
  {
    title: "Messianic Prophecies",
    description:
      "37 Old Testament prophecies examined alongside their New Testament fulfillment and the historical evidence from the Dead Sea Scrolls, ancient codices, and archaeology.",
    href: "/prophecies",
    gradient: "from-purple-900/80 via-amber-900/60 to-stone-900/80",
    gradientLight: "from-purple-200/80 via-amber-100/60 to-stone-200/80",
  },
  {
    title: "Beyond the Reach of AI",
    description:
      "Can artificial intelligence create Scripture? A computational analysis of the seven simultaneous constraint systems operating in the Hebrew text that no AI could reproduce.",
    href: "/research/beyond-ai",
    gradient: "from-slate-900/80 via-indigo-900/60 to-stone-900/80",
    gradientLight: "from-slate-200/80 via-indigo-100/60 to-stone-200/80",
  },
];

const SAMPLE_WORDS = [
  {
    modern: "\u05D0\u05D1",
    paleo: "\uD802\uDD00\uD802\uDD01",
    name: "Av (Father)",
    meaning: "The strength of the house",
  },
  {
    modern: "\u05D0\u05DD",
    paleo: "\uD802\uDD00\uD802\uDD0C",
    name: "Em (Mother)",
    meaning: "The strength of the waters",
  },
  {
    modern: "\u05D1\u05DF",
    paleo: "\uD802\uDD01\uD802\uDD0D",
    name: "Ben (Son)",
    meaning: "The house of the seed",
  },
  {
    modern: "\u05EA\u05D5\u05E8\u05D4",
    paleo: "\uD802\uDD15\uD802\uDD05\uD802\uDD12\uD802\uDD04",
    name: "Torah (Instruction)",
    meaning: "The sign secured by the head who reveals",
  },
  {
    modern: "\u05D1\u05E8\u05D0\u05E9\u05D9\u05EA",
    paleo: "\uD802\uDD01\uD802\uDD12\uD802\uDD00\uD802\uDD14\uD802\uDD09\uD802\uDD15",
    name: "Bereshit (In the Beginning)",
    meaning:
      "The Son of the house, the Head of God, consumed by His own hand on a cross",
    featured: true,
  },
];

const BOOKS = [
  { name: "Genesis", nameHe: "\u05D1\u05E8\u05D0\u05E9\u05D9\u05EA", slug: "genesis" },
  { name: "Exodus", nameHe: "\u05E9\u05DE\u05D5\u05EA", slug: "exodus" },
  { name: "Leviticus", nameHe: "\u05D5\u05D9\u05E7\u05E8\u05D0", slug: "leviticus" },
  { name: "Numbers", nameHe: "\u05D1\u05DE\u05D3\u05D1\u05E8", slug: "numbers" },
  { name: "Deuteronomy", nameHe: "\u05D3\u05D1\u05E8\u05D9\u05DD", slug: "deuteronomy" },
];

const LATEST_ITEMS = [
  {
    title: "Aleph Tav Covenant Marker Study",
    description:
      "Track how the untranslated Aleph Tav marks covenant standing throughout Genesis.",
    href: "/aleph-tav",
  },
  {
    title: "Beyond the Reach of AI",
    description:
      "A computational analysis of the seven constraint systems in the Hebrew text.",
    href: "/research/beyond-ai",
  },
  {
    title: "From Stone to Script: Alphabet History",
    description:
      "The journey of Hebrew letters from Proto-Sinaitic carvings to modern script.",
    href: "/stone-to-script",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="homepage-hero">
        <div className="homepage-hero-bg">
          <Image
            src="/images/homepage-hero.png"
            alt="Ancient study with Torah scrolls and golden light"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="homepage-hero-overlay" />
        <div className="homepage-hero-inner">
          {/* Decorative Aleph Tav watermark */}
          <span
            className="paleo-glyph homepage-hero-watermark"
            aria-hidden="true"
            dir="rtl"
          >
            {"\uD802\uDD00\uD802\uDD15"}
          </span>

          <h1 className="homepage-hero-title">The Aleph Tav Project</h1>
          <p className="homepage-hero-subtitle">
            Exploring the Hebrew Scriptures Through Their Ancient Letters
          </p>
          <p className="homepage-hero-desc">
            From the pictographic meanings hidden in every Hebrew letter to the
            covenant patterns woven through the Torah, we use interactive tools
            and original research to uncover what has been there since the
            beginning.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              href="/torah/genesis/1"
              className="homepage-hero-cta-primary"
            >
              Start Reading the Torah
            </Link>
            <Link
              href="/research"
              className="homepage-hero-cta-secondary"
            >
              Explore Our Research
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SECTION CARDS ===== */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SECTION_CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="section-card group"
            >
              {/* Gradient background */}
              <div
                className={`section-card-bg bg-gradient-to-br ${card.gradient}`}
                data-gradient-light={card.gradientLight}
              />
              <div className="section-card-content">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold">{card.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed opacity-90">
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== READ THE TORAH ===== */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-semibold text-center mb-6">
          Read the Torah
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {BOOKS.map((book) => (
            <Link
              key={book.slug}
              href={`/torah/${book.slug}/1`}
              className="book-card-hero"
            >
              <BookHero bookSlug={book.slug} variant="card" />
              <div className="card-content">
                <div className="hebrew-name hebrew-text" lang="he" dir="rtl">
                  {book.nameHe}
                </div>
                <div className="english-name">{book.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== EXAMPLE WORD DECODINGS ===== */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-semibold text-center mb-6">
          Example Word Decodings
        </h2>

        {/* Featured: Bereshit */}
        {SAMPLE_WORDS.filter((w) => w.featured).map((word) => (
          <div
            key={word.modern}
            className="p-6 rounded-xl border-2 border-accent/40 bg-surface mb-6 text-center"
          >
            <div className="flex items-center justify-center gap-6 mb-3">
              <span
                className="hebrew-text text-3xl font-semibold"
                lang="he"
                dir="rtl"
              >
                {word.modern}
              </span>
              <span className="paleo-glyph text-3xl text-primary" dir="rtl">
                {word.paleo}
              </span>
            </div>
            <p className="font-semibold text-base">{word.name}</p>
            <p className="text-sm text-muted mt-1 italic max-w-lg mx-auto">
              &ldquo;{word.meaning}&rdquo;
            </p>
          </div>
        ))}

        {/* Standard examples */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SAMPLE_WORDS.filter((w) => !w.featured).map((word) => (
            <div
              key={word.modern}
              className="p-5 rounded-xl border border-border bg-surface hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="hebrew-text text-2xl font-semibold"
                  lang="he"
                  dir="rtl"
                >
                  {word.modern}
                </span>
                <span className="paleo-glyph text-2xl text-primary" dir="rtl">
                  {word.paleo}
                </span>
              </div>
              <p className="font-medium text-sm">{word.name}</p>
              <p className="text-sm text-muted mt-1 italic">
                &ldquo;{word.meaning}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW THE TORAH DECODER WORKS ===== */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-semibold text-center mb-6">
          How the Torah Decoder Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">1</div>
            <h4 className="font-semibold mb-1">Navigate</h4>
            <p className="text-sm text-muted">
              Browse any verse in the five books of the Torah
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">2</div>
            <h4 className="font-semibold mb-1">Click a Word</h4>
            <p className="text-sm text-muted">
              Tap any Hebrew word to decompose it into its root consonants
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">3</div>
            <h4 className="font-semibold mb-1">Decode</h4>
            <p className="text-sm text-muted">
              See Paleo-Hebrew pictographs, letter meanings, and generated
              interpretive sentences
            </p>
          </div>
        </div>
      </section>

      {/* ===== LATEST FROM THE PROJECT ===== */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-semibold text-center mb-6">
          Latest from the Project
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {LATEST_ITEMS.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="p-5 rounded-xl border border-border bg-surface hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== DISCLAIMER ===== */}
      <div className="max-w-4xl mx-auto px-4 pb-8 text-center text-xs text-muted border-t border-border pt-6">
        <p>
          Pictographic analysis represents one interpretive lens for Hebrew
          words. Scholars debate the validity of reading pictographic meanings
          into fully alphabetic Hebrew text. This app presents these readings as
          enrichment and study aids, not as replacement for lexical definitions.
        </p>
      </div>
    </div>
  );
}
