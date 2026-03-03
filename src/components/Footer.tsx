import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    title: "Study Tools",
    links: [
      { href: "/torah/genesis/1", label: "Torah Decoder" },
      { href: "/alphabet", label: "Hebrew Alphabet" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/stone-to-script", label: "Stone to Script" },
      { href: "/guide", label: "Getting Started" },
    ],
  },
  {
    title: "Research",
    links: [
      { href: "/research", label: "All Research" },
      { href: "/aleph-tav", label: "Aleph Tav Study" },
      { href: "/prophecies", label: "Prophecies" },
      { href: "/research/beyond-ai", label: "Beyond the Reach of AI" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand column */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-2">
              <span className="paleo-glyph text-accent text-xl">𐤀𐤕</span>
              <span className="text-sm font-semibold text-foreground">
                The Aleph Tav Project
              </span>
            </Link>
            <p className="text-xs text-muted leading-relaxed">
              Exploring the pictographic meanings hidden within the ancient
              Hebrew words of the Torah.
            </p>
            <Link
              href="/about"
              className="inline-block mt-3 text-xs text-muted hover:text-foreground transition-colors"
            >
              About the Project
            </Link>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Attribution + Copyright */}
        <div className="text-center text-xs text-muted border-t border-border pt-6 space-y-1">
          <p>
            Data powered by{" "}
            <a
              href="https://www.sefaria.org"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sefaria
            </a>
            {" and "}
            <a
              href="https://hb.openscriptures.org"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OSHB
            </a>
            {" (CC BY 4.0)"}
          </p>
          <p>&copy; {new Date().getFullYear()} The Aleph Tav Project. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
