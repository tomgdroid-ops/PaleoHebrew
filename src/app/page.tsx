import Link from "next/link";
import BookHero from "@/components/BookHero";

const SAMPLE_WORDS = [
  {
    modern: "אב",
    paleo: "𐤀𐤁",
    name: "Av (Father)",
    meaning: "The strength of the house",
  },
  {
    modern: "אם",
    paleo: "𐤀𐤌",
    name: "Em (Mother)",
    meaning: "The strength of the waters",
  },
  {
    modern: "בן",
    paleo: "𐤁𐤍",
    name: "Ben (Son)",
    meaning: "The house of the seed",
  },
  {
    modern: "תורה",
    paleo: "𐤕𐤅𐤓𐤄",
    name: "Torah (Instruction)",
    meaning: "The sign secured by the head who reveals",
  },
];

const BOOKS = [
  { name: "Genesis", nameHe: "בראשית", slug: "genesis" },
  { name: "Exodus", nameHe: "שמות", slug: "exodus" },
  { name: "Leviticus", nameHe: "ויקרא", slug: "leviticus" },
  { name: "Numbers", nameHe: "במדבר", slug: "numbers" },
  { name: "Deuteronomy", nameHe: "דברים", slug: "deuteronomy" },
];

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <p className="paleo-glyph text-6xl text-primary mb-4" dir="rtl">
          𐤁𐤓𐤀𐤔𐤉𐤕
        </p>
        <h2 className="text-3xl font-bold mb-3">
          Discover the Ancient Pictures in Every Hebrew Word
        </h2>
        <p className="text-lg text-muted max-w-2xl mx-auto">
          Each Hebrew letter was once a pictograph. Aleph was an ox head meaning
          &ldquo;strength.&rdquo; Bet was a house floor plan meaning &ldquo;family.&rdquo;
          Click any word in the Torah to see the ancient pictures that form it.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Link
            href="/torah/genesis/1"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors"
          >
            Start Reading Genesis 1:1
          </Link>
          <Link
            href="/alphabet"
            className="inline-block px-6 py-3 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
          >
            View the Alphabet
          </Link>
          <Link
            href="/stone-to-script"
            className="inline-block px-6 py-3 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors text-center"
          >
            <span className="block">From Stone to Script</span>
            <span className="block text-xs font-normal opacity-75 mt-0.5">
              The Journey of the Hebrew Alphabet
            </span>
          </Link>
          <Link
            href="/aleph-tav"
            className="inline-block px-6 py-3 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors text-center"
          >
            <span className="block">The Aleph Tav (את) Study</span>
            <span className="block text-xs font-normal opacity-75 mt-0.5">
              Covenant Marker in Scripture
            </span>
          </Link>
        </div>
      </div>

      {/* Sample word cards */}
      <div className="mb-16">
        <h3 className="text-xl font-semibold text-center mb-6">
          Example Word Decodings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SAMPLE_WORDS.map((word) => (
            <div
              key={word.modern}
              className="p-5 rounded-xl border border-border bg-surface hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="hebrew-text text-2xl font-semibold" lang="he" dir="rtl">
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
      </div>

      {/* Book links with hero images */}
      <div className="mb-16">
        <h3 className="text-xl font-semibold text-center mb-6">
          Browse the Torah
        </h3>
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
      </div>

      {/* How it works */}
      <div className="mb-16">
        <h3 className="text-xl font-semibold text-center mb-6">
          How It Works
        </h3>
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
              See Paleo-Hebrew pictographs, letter meanings, and generated interpretive sentences
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-center text-xs text-muted border-t border-border pt-6">
        <p>
          Pictographic analysis represents one interpretive lens for Hebrew words.
          Scholars debate the validity of reading pictographic meanings into fully
          alphabetic Hebrew text. This app presents these readings as enrichment
          and study aids, not as replacement for lexical definitions.
        </p>
        <p className="mt-2">
          Data powered by{" "}
          <a href="https://www.sefaria.org" className="underline" target="_blank" rel="noopener noreferrer">
            Sefaria
          </a>
          ,{" "}
          <a href="https://hb.openscriptures.org" className="underline" target="_blank" rel="noopener noreferrer">
            OSHB
          </a>
          .
        </p>
      </div>
    </div>
  );
}
