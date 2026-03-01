import letterMeanings from "../../../data/letter-meanings.json";

const SVG_NAME_MAP: Record<string, string> = {
  "א": "aleph", "ב": "bet", "ג": "gimel", "ד": "dalet",
  "ה": "hey", "ו": "vav", "ז": "zayin", "ח": "chet",
  "ט": "tet", "י": "yod", "כ": "kaf", "ל": "lamed",
  "מ": "mem", "נ": "nun", "ס": "samekh", "ע": "ayin",
  "פ": "pey", "צ": "tsade", "ק": "qof", "ר": "resh",
  "ש": "shin", "ת": "tav",
};

type Meaning = { text: string; role: string; primary: boolean };

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

export default function AlphabetPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">The Paleo-Hebrew Alphabet</h1>
        <p className="text-muted max-w-2xl mx-auto">
          The 22 letters of the Hebrew alphabet, each tracing back to an ancient
          pictograph. Every letter carries concrete meanings rooted in its
          original picture.
        </p>
      </div>

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
        {letterMeanings.map((entry) => {
          const svgName = SVG_NAME_MAP[entry.letter];
          const grouped = groupByRole(entry.meanings as Meaning[]);

          return (
            <div
              key={entry.letter}
              className="rounded-xl border border-border bg-surface p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start"
            >
              {/* Left: glyphs & value */}
              <div className="flex sm:flex-col items-center gap-4 sm:gap-2 shrink-0 sm:w-[160px]">
                {/* Paleo glyph (Unicode font) */}
                <span
                  className="paleo-glyph text-primary"
                  style={{ fontSize: 56 }}
                  aria-label={`Paleo-Hebrew ${entry.name}`}
                  title={`Paleo-Hebrew ${entry.name}`}
                >
                  {entry.paleoUnicode}
                </span>

                {/* Modern Hebrew */}
                <span
                  className="hebrew-text font-semibold"
                  style={{ fontSize: 40 }}
                  lang="he"
                  title={`Modern Hebrew ${entry.name}`}
                >
                  {entry.letter}
                </span>

                {/* Gematria value */}
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
                <h2 className="text-lg font-bold text-primary mb-2">
                  {entry.name}
                </h2>

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
  );
}
