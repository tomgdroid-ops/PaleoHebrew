"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Meaning = { text: string; role: string; primary: boolean };

interface LetterEntry {
  letter: string;
  name: string;
  paleoUnicode: string;
  pictograph: string;
  gematria: number;
  meanings: Meaning[];
}

interface AlphabetContentProps {
  letters: LetterEntry[];
  svgNameMap: Record<string, string>;
  cardBgMap: Record<string, string>;
}

function groupByRole(meanings: Meaning[]) {
  const groups: Record<string, Meaning[]> = {};
  for (const m of meanings) {
    const label =
      m.role === "noun" ? "Nouns" :
      m.role === "verb" ? "Verbs" :
      m.role === "adjective" ? "Adjectives" :
      m.role === "adverb" ? "Adverbs" :
      m.role === "preposition" ? "Prepositions" :
      m.role === "conjunction" ? "Conjunctions" :
      m.role === "article" ? "Articles" :
      "Other";
    if (!groups[label]) groups[label] = [];
    groups[label].push(m);
  }
  return groups;
}

export default function AlphabetContent({
  letters,
  svgNameMap,
  cardBgMap,
}: AlphabetContentProps) {
  const [activeLetter, setActiveLetter] = useState<string>(letters[0]?.name.toLowerCase() ?? "");
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const isClickScrolling = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;
        let best: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!best || entry.boundingClientRect.top < best.boundingClientRect.top) {
              best = entry;
            }
          }
        }
        if (best) {
          const id = (best.target as HTMLElement).id.replace("letter-", "");
          setActiveLetter(id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 },
    );
    for (const [, el] of cardRefs.current) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mobileNavRef.current) return;
    const activeBtn = mobileNavRef.current.querySelector(
      `[data-letter="${activeLetter}"]`
    );
    if (activeBtn) {
      (activeBtn as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeLetter]);

  const scrollToLetter = useCallback((name: string) => {
    const el = cardRefs.current.get(name);
    if (!el) return;
    isClickScrolling.current = true;
    setActiveLetter(name);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      isClickScrolling.current = false;
    }, 800);
  }, []);

  const setCardRef = useCallback((name: string, el: HTMLDivElement | null) => {
    if (el) {
      cardRefs.current.set(name, el);
    } else {
      cardRefs.current.delete(name);
    }
  }, []);

  return (
    <>
      {/* ===== Mobile quick-jump strip (below lg) ===== */}
      <div
        ref={mobileNavRef}
        className="lg:hidden sticky top-[57px] z-30 bg-background border-b border-border overflow-x-auto scrollbar-hide"
      >
        <div className="flex items-center gap-1 px-3 py-2 min-w-max">
          {letters.map((entry) => {
            const id = entry.name.toLowerCase();
            const isActive = activeLetter === id;
            return (
              <button
                key={entry.letter}
                data-letter={id}
                onClick={() => scrollToLetter(id)}
                className={`shrink-0 w-8 h-8 rounded-md flex items-center justify-center text-base transition-colors ${
                  isActive
                    ? "bg-accent text-white font-bold"
                    : "text-muted hover:text-foreground"
                }`}
                aria-label={`Jump to ${entry.name}`}
                title={entry.name}
              >
                {entry.letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* ===== Main layout: sidebar + cards ===== */}
      <div className="lg:flex lg:gap-6 max-w-6xl mx-auto px-4">
        {/* Desktop sidebar (lg+) */}
        <nav
          className="hidden lg:flex flex-col gap-1 sticky top-20 self-start py-4 shrink-0"
          aria-label="Letter quick-jump"
        >
          {letters.map((entry) => {
            const id = entry.name.toLowerCase();
            const isActive = activeLetter === id;
            return (
              <button
                key={entry.letter}
                onClick={() => scrollToLetter(id)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-colors ${
                  isActive
                    ? "bg-accent text-white font-bold"
                    : "text-muted hover:text-foreground"
                }`}
                aria-label={`Jump to ${entry.name}`}
                title={entry.name}
              >
                {entry.letter}
              </button>
            );
          })}
        </nav>

        {/* Cards column */}
        <div className="flex-1 min-w-0 py-4">
          {/* Legend header box */}
          <div className="rounded-xl border border-border bg-surface p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start mb-4">
            <div className="flex sm:flex-col items-center gap-4 sm:gap-2 shrink-0 sm:w-[160px]">
              <span className="text-sm font-semibold text-primary text-center">Paleo-Hebrew</span>
              <span className="text-sm font-semibold text-center">Modern Hebrew</span>
              <span className="text-sm font-semibold text-accent text-center">Gematria</span>
            </div>
            <div className="flex sm:flex-col items-center gap-2 shrink-0 sm:w-[100px]">
              <span className="text-sm font-semibold text-center">Pictograph</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold">Name &amp; Meanings</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {letters.map((entry) => {
              const svgName = svgNameMap[entry.letter];
              const grouped = groupByRole(entry.meanings);
              const bgFile = cardBgMap[entry.letter];
              const id = entry.name.toLowerCase();

              return (
                <div
                  key={entry.letter}
                  id={`letter-${id}`}
                  ref={(el) => setCardRef(id, el)}
                  className="letter-card rounded-xl border border-border bg-surface p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start scroll-mt-24"
                  style={
                    bgFile
                      ? ({ "--card-bg": `url('/images/alphabet/${bgFile}')` } as React.CSSProperties)
                      : undefined
                  }
                >
                  {/* Left: glyphs & value */}
                  <div className="flex sm:flex-col items-center gap-4 sm:gap-2 shrink-0 sm:w-[160px]">
                    <span
                      className="paleo-glyph text-primary"
                      style={{ fontSize: 56 }}
                      aria-label={`Paleo-Hebrew ${entry.name}`}
                      title={`Paleo-Hebrew ${entry.name}`}
                    >
                      {entry.paleoUnicode}
                    </span>

                    <span
                      className="hebrew-text font-semibold"
                      style={{ fontSize: 40 }}
                      lang="he"
                      title={`Modern Hebrew ${entry.name}`}
                    >
                      {entry.letter}
                    </span>

                    <span className="font-mono font-bold text-accent" style={{ fontSize: 26 }}>
                      {entry.gematria}
                    </span>
                  </div>

                  {/* Center: pictograph SVG */}
                  <div className="flex sm:flex-col items-center gap-2 shrink-0 sm:w-[100px]">
                    {svgName && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={`/glyphs/${svgName}.svg`}
                        alt={`${entry.name} pictograph: ${entry.pictograph}`}
                        width={64}
                        height={64}
                        className="paleo-svg opacity-70"
                      />
                    )}
                    <span className="text-xs text-muted italic text-center leading-tight">
                      {entry.pictograph}
                    </span>
                  </div>

                  {/* Right: name & meanings */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-primary mb-2">{entry.name}</h2>

                    <div className="flex flex-col gap-1.5">
                      {Object.entries(grouped).map(([role, meanings]) => (
                        <div key={role} className="flex flex-wrap items-center gap-1.5">
                          <span className="text-xs font-semibold text-muted uppercase tracking-wide w-[80px] shrink-0">
                            {role}
                          </span>
                          {meanings.map((m) => (
                            <span
                              key={m.text}
                              className={`text-sm px-2 py-0.5 rounded-full ${
                                m.primary
                                  ? "bg-accent-light/30 text-foreground font-medium"
                                  : "bg-surface-hover text-muted"
                              }`}
                            >
                              {m.text}
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="text-center text-xs text-muted mt-10 border-t border-border pt-6">
            <p>
              Pictographic meanings are based on the Proto-Sinaitic and early
              Phoenician forms of the alphabet. Primary meanings are highlighted.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
