import Link from "next/link";
import Image from "next/image";
import FadeInSection from "@/components/FadeInSection";

const SECTION_CARDS = [
  {
    title: "Torah Decoder",
    icon: (
      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    description:
      'Before Hebrew was an alphabet, it was pictographs carved in stone. The word for "father" - aleph bet - reads "the strength of the house." The word for "son" - bet nun - reads "the house of the seed." Navigate the Torah word by word and see what the ancient letters reveal.',
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
      "All 22 letters of the Hebrew alphabet traced from their Proto-Sinaitic pictographic origins to the modern square script. See each letter's pictograph, name, meaning, gematria value, and how it evolved across 3,000 years.",
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
      "Trace the evolution of all 22 Hebrew letters from Proto-Sinaitic inscriptions through Phoenician, Paleo-Hebrew, and Aramaic transitions to the modern square script - and understand why the letter forms changed but the meanings endured.",
    href: "/stone-to-script",
    gradient: "from-yellow-900/80 via-stone-800/60 to-stone-900/80",
    gradientLight: "from-yellow-200/80 via-stone-100/60 to-stone-200/80",
  },
  {
    title: "The Aleph Tav (\u05D0\u05EA) Study",
    icon: (
      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    description:
      "The Aleph Tav (\u05D0\u05EA) is not translated in any English Bible. Yet it appears and disappears before names across the Hebrew text in a pattern that tracks covenant standing with precision. When someone walks with God, the marker is present. When they fall away, it vanishes.",
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
      "From the method of death described a thousand years before crucifixion existed to the birthplace named seven centuries in advance - each prophecy examined alongside its New Testament fulfillment and verified against the Dead Sea Scrolls, ancient codices, and archaeology.",
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
      "The Torah operates under seven simultaneous constraint systems - equidistant letter sequences, pictographic root meanings, gematria relationships, chiastic literary structures, prophetic typology, covenant markers, and intertextual weaving. No AI, no human committee, and no editorial process could satisfy all seven at once.",
    href: "/research/beyond-ai",
    gradient: "from-slate-900/80 via-indigo-900/60 to-stone-900/80",
    gradientLight: "from-slate-200/80 via-indigo-100/60 to-stone-200/80",
  },
];

const SAMPLE_WORDS = [
  {
    modern: "\u05D1\u05E8\u05D0\u05E9\u05D9\u05EA",
    paleo:
      "\uD802\uDD01\uD802\uDD12\uD802\uDD00\uD802\uDD14\uD802\uDD09\uD802\uDD15",
    name: "Bereshit (In the Beginning)",
    meaning:
      "The Son of the house, the Head of God, consumed by His own hand on a cross",
  },
  {
    modern: "\u05EA\u05D5\u05E8\u05D4",
    paleo: "\uD802\uDD15\uD802\uDD05\uD802\uDD12\uD802\uDD04",
    name: "Torah (Instruction)",
    meaning: "The sign secured by the head who reveals",
  },
  {
    modern: "\u05D0\u05D1",
    paleo: "\uD802\uDD00\uD802\uDD01",
    name: "Av (Father)",
    meaning: "The strength of the house",
  },
];

const BOOKS = [
  {
    name: "Genesis",
    nameHe: "\u05D1\u05E8\u05D0\u05E9\u05D9\u05EA",
    slug: "genesis",
  },
  { name: "Exodus", nameHe: "\u05E9\u05DE\u05D5\u05EA", slug: "exodus" },
  {
    name: "Leviticus",
    nameHe: "\u05D5\u05D9\u05E7\u05E8\u05D0",
    slug: "leviticus",
  },
  {
    name: "Numbers",
    nameHe: "\u05D1\u05DE\u05D3\u05D1\u05E8",
    slug: "numbers",
  },
  {
    name: "Deuteronomy",
    nameHe: "\u05D3\u05D1\u05E8\u05D9\u05DD",
    slug: "deuteronomy",
  },
];

const STATS = [
  { number: "23,213", label: "Verses Analyzed for Aleph Tav Markers" },
  { number: "37", label: "Messianic Prophecies Examined" },
  { number: "7", label: "Simultaneous Constraint Systems" },
  { number: "22", label: "Letters Traced Across 3,000 Years" },
];

export default function HomePage() {
  return (
    <div>
      {/* ===== 1. HERO SECTION ===== */}
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
          <span
            className="paleo-glyph homepage-hero-watermark"
            aria-hidden="true"
            dir="rtl"
          >
            {"\uD802\uDD00\uD802\uDD15"}
          </span>

          <h1 className="homepage-hero-title font-display">
            The Aleph Tav Project
          </h1>
          <p className="homepage-hero-tagline font-serif">
            Uncovering the Divine Architecture of the Hebrew Scriptures
          </p>
          <p className="homepage-hero-desc">
            Covenant markers that track God&apos;s promises across 23,000
            verses. Prophecies written centuries apart, fulfilled in one person.
            Structural patterns no human author could have coordinated. Explore
            the evidence through interactive study tools and original research.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href="/research" className="homepage-hero-cta-primary">
              See the Evidence
            </Link>
            <Link
              href="/torah/genesis/1"
              className="homepage-hero-cta-secondary"
            >
              Begin Exploring
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 2. THESIS STATEMENT ===== */}
      <FadeInSection>
        <section className="max-w-3xl mx-auto px-6 py-24 text-center">
          <div className="thesis-divider mb-10" />
          <p className="font-serif text-lg leading-relaxed text-foreground/70 italic">
            The Hebrew Scriptures are not a single-layer text. Beneath the
            narrative surface lie interlocking systems of evidence - linguistic,
            structural, prophetic, and mathematical - that span thousands of
            years and dozens of human authors, yet operate with a coherence that
            points to a single divine hand. The Aleph Tav Project makes these
            hidden layers visible and explorable.
          </p>
          <div className="thesis-divider mt-10" />
        </section>
      </FadeInSection>

      {/* ===== 3. SECTION CARDS ===== */}
      <FadeInSection>
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SECTION_CARDS.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="section-card group"
              >
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
      </FadeInSection>

      {/* ===== 4. EVIDENCE AT A GLANCE ===== */}
      <FadeInSection>
        <section className="stats-bar py-16">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-4xl font-bold text-accent mb-2">
                  {stat.number}
                </div>
                <div className="text-xs uppercase tracking-[0.1em] text-muted">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      </FadeInSection>

      {/* ===== 5. WHAT THE ANCIENT LETTERS REVEAL ===== */}
      <FadeInSection>
        <section className="max-w-5xl mx-auto px-4 py-28">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Torah Decoder
            </span>
            <h2 className="text-3xl font-display font-bold mt-2">
              What the Ancient Letters Reveal
            </h2>
            <p className="text-sm text-muted mt-3 max-w-xl mx-auto leading-relaxed">
              Click any word in the Torah to decompose it into Paleo-Hebrew
              pictographs and uncover the meaning embedded in each letter.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SAMPLE_WORDS.map((word) => (
              <div
                key={word.modern}
                className="p-6 rounded-xl border border-border bg-surface text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-center justify-center gap-4 mb-3">
                  <span
                    className="hebrew-text text-2xl font-semibold"
                    lang="he"
                    dir="rtl"
                  >
                    {word.modern}
                  </span>
                  <span className="paleo-glyph text-2xl text-accent" dir="rtl">
                    {word.paleo}
                  </span>
                </div>
                <p className="font-semibold text-sm">{word.name}</p>
                <p className="font-serif text-sm text-muted mt-1 italic">
                  &ldquo;{word.meaning}&rdquo;
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/torah/genesis/1"
              className="inline-block px-6 py-3 border-2 border-accent/50 text-accent font-semibold rounded-lg hover:bg-accent/10 hover:border-accent transition-all duration-300"
            >
              Explore the Full Torah
            </Link>
          </div>
        </section>
      </FadeInSection>

      {/* ===== 6. THE FIVE BOOKS ===== */}
      <FadeInSection>
        <section className="max-w-4xl mx-auto px-4 pb-28">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Read
            </span>
            <h2 className="text-3xl font-display font-bold mt-2">
              The Five Books
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {BOOKS.map((book) => (
              <Link
                key={book.slug}
                href={`/torah/${book.slug}/1`}
                className="book-strip-cell"
              >
                <div
                  className="hebrew-text text-xl font-semibold"
                  lang="he"
                  dir="rtl"
                >
                  {book.nameHe}
                </div>
                <div className="text-[0.7rem] uppercase tracking-[0.08em] text-muted mt-1">
                  {book.name}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </FadeInSection>

      {/* ===== 7. CLOSING CTA ===== */}
      <FadeInSection>
        <section className="text-center py-24 px-4">
          <span
            className="paleo-glyph text-7xl text-accent opacity-20 block mb-6"
            aria-hidden="true"
            dir="rtl"
          >
            {"\uD802\uDD00\uD802\uDD15"}
          </span>
          <p className="font-serif text-xl italic text-muted max-w-lg mx-auto leading-relaxed">
            &ldquo;I am the Aleph and the Tav, the Beginning and the
            End.&rdquo;
          </p>
          <p className="text-sm text-muted mt-2">Revelation 22:13</p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              href="/research"
              className="inline-block px-6 py-3 bg-accent text-[#1a1410] font-semibold rounded-lg hover:bg-[#d4b36a] hover:-translate-y-0.5 transition-all duration-300"
            >
              Explore the Research
            </Link>
            <Link
              href="/guide"
              className="inline-block px-6 py-3 border-2 border-accent/50 text-accent font-semibold rounded-lg hover:bg-accent/10 hover:border-accent transition-all duration-300"
            >
              Getting Started Guide
            </Link>
          </div>
        </section>
      </FadeInSection>

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
