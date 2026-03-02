import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/torah/genesis/1", label: "Torah Decoder" },
  { href: "/alphabet", label: "Hebrew Alphabet" },
  { href: "/guide", label: "Getting Started" },
  { href: "/stone-to-script", label: "Stone to Script" },
  { href: "/aleph-tav", label: "Aleph Tav Study" },
  { href: "/research", label: "Research" },
  { href: "/about", label: "About" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Brand */}
        <div className="text-center mb-6">
          <span className="paleo-glyph text-accent text-xl">𐤀𐤕</span>
          <p className="text-sm font-semibold text-foreground mt-1">
            The Aleph Tav Project
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted mb-6">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Attribution + Copyright */}
        <div className="text-center text-xs text-muted space-y-1">
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
          <p>&copy; 2025 The Aleph Tav Project. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
