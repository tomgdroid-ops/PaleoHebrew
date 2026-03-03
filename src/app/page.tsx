import Link from "next/link";
import Image from "next/image";
import BookHero from "@/components/BookHero";

const SECTION_CARDS = [
  {
    title: "Torah Decoder",
    icon: (
      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    description:
      "Navigate the five books of the Torah. Click any Hebrew word to see its Paleo-Hebrew pictographs, letter meanings, and generated interpretive sentences.",
    href: "/torah/genesis/1",
    gradient: "from-amber-900/80 via-amber-800/60 to-yellow-900/80",
    gradientLight: "from-amber-200/80 via-amber-100/60 to-yellow-200/80",
  },
  {
    title: "The Ancient Alphabet",
    icon: (
      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16M15 11l2 5 2-5" />
      </svg>
    ),
    description:
      "Explore all 22 letters of the Hebrew alphabet with their pictographic origins, meanings, gematria values, and how they evolved over 3,000 years.",
    href: "/alphabet",
    gradient: "from-stone-900/80 via-stone-800/60 to-amber-900/80",
    gradientLight: "from-stone-200/80 via-stone-100/60 to-amber-200/80",
  },
  {
    title: "From Stone to Script",
    icon: (
      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    description:
      "Trace the journey of the Hebrew alphabet from Proto-Sinaitic carvings through the Babylonian Exile to the script used today.",
    href: "/stone-to-script",
    gradient: "from-yellow-900/80 via-stone-800/60 to-stone-900/80",
    gradientLight: "from-yellow-200/80 via-stone-100/60 to-stone-200/80",
  },
  {
    title: "The Aleph Tav (את) Study",
    icon: (
      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    description:
      "Discover how the untranslated Aleph Tav marker appears and disappears before names in the Hebrew Bible, tracking covenant standing across Scripture.",
    href: "/aleph-tav",
    gradient: "from-indigo-900/80 via-slate-800/60 to-amber-900/80",
    gradientLight: "from-indigo-200/80 via-slate-100/60 to-amber-200/80",
  },
  {
    title: "Messianic Prophecies",
    icon: (
      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    description:
      "37 Old Testament prophecies examined alongside their New Testament fulfillment and the historical evidence from the Dead Sea Scrolls, ancient codices, and archaeology.",
    href: "/prophecies",
    gradient: "from-purple-900/80 via-amber-900/60 to-stone-900/80",
    gradientLight: "from-purple-200/80 via-amber-100/60 to-stone-200/80",
  },
  {
    title: "Beyond the Reach of AI",
    icon: (
      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
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
                <div className="flex items-center gap-2 mb-3">
                  {card.icon}
                  <h3 className="text-xl font-bold">{card.title}</h3>
                </div>
                <p className="text-sm leading-relaxed opacity-90">
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
          <div className="text-center relative">
            <div className="w-14 h-14 rounded-full bg-accent/15 text-accent font-bold text-xl flex items-center justify-center mx-auto mb-4">
              1
            </div>
            <h4 className="font-semibold mb-2">Navigate</h4>
            <p className="text-sm text-muted leading-relaxed">
              Browse any verse in the five books of the Torah
            </p>
            <div className="hidden md:block absolute top-7 left-[calc(50%+2rem)] right-[calc(-50%+2rem)] h-px bg-border" />
          </div>
          <div className="text-center relative">
            <div className="w-14 h-14 rounded-full bg-accent/15 text-accent font-bold text-xl flex items-center justify-center mx-auto mb-4">
              2
            </div>
            <h4 className="font-semibold mb-2">Click a Word</h4>
            <p className="text-sm text-muted leading-relaxed">
              Tap any Hebrew word to decompose it into its root consonants
            </p>
            <div className="hidden md:block absolute top-7 left-[calc(50%+2rem)] right-[calc(-50%+2rem)] h-px bg-border" />
          </div>
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-accent/15 text-accent font-bold text-xl flex items-center justify-center mx-auto mb-4">
              3
            </div>
            <h4 className="font-semibold mb-2">Decode</h4>
            <p className="text-sm text-muted leading-relaxed">
              See Paleo-Hebrew pictographs, letter meanings, and generated
              interpretive sentences
            </p>
          </div>
        </div>
      </section>


      {/* ===== NEW HERE CTA ===== */}
      <section className="max-w-3xl mx-auto px-4 pb-16 text-center">
        <div className="p-8 rounded-xl border border-accent/30 bg-surface">
          <h2 className="text-xl font-semibold mb-3">New Here?</h2>
          <p className="text-sm text-muted mb-6 max-w-md mx-auto leading-relaxed">
            Start with our Getting Started guide to understand how ancient
            Hebrew pictographs reveal hidden meanings in every word of Scripture.
          </p>
          <Link
            href="/guide"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors"
          >
            Read the Getting Started Guide
          </Link>
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
