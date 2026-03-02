"use client";

import { useState, useEffect } from "react";
import { decodeMorphology } from "@/lib/morphology";

/* ─── Hide app chrome (header nav) and force light background ─── */
function useReportMode() {
  useEffect(() => {
    // Hide the app header nav
    const header = document.querySelector("header");
    if (header) (header as HTMLElement).style.display = "none";

    // Force light mode for the report
    document.documentElement.removeAttribute("data-theme");
    document.body.style.background = "#fff";
    document.body.style.color = "#1a1a1a";

    return () => {
      // Restore on unmount (if navigating back in same tab)
      if (header) (header as HTMLElement).style.display = "";
      document.body.style.background = "";
      document.body.style.color = "";
    };
  }, []);
}

/* ─── Theme detection (mirrors SentenceList.tsx) ─── */
const THEMES: Record<string, string[]> = {
  creation: ["create", "make", "beginning", "first", "work", "complete"],
  covenant: ["covenant", "sign", "mark", "seal", "promise", "oath", "cross"],
  redemption: ["save", "deliver", "cross", "sacrifice", "blood", "destroy", "consume"],
  family: ["father", "mother", "son", "house", "family", "seed", "offspring", "heir"],
  authority: ["leader", "chief", "head", "ruler", "king", "authority", "shepherd", "guide"],
  divine: ["god", "strength", "power", "spirit", "breath", "mighty", "fire"],
};

interface LetterBreakdown {
  letter: string;
  name: string;
  paleoUnicode: string;
  pictograph: string;
  chosenMeaning: string;
  role: string;
  allMeanings: { text: string; role: string; primary: boolean }[];
}

interface Interpretation {
  sentence: string;
  score: number;
  letterBreakdown: LetterBreakdown[];
  pattern: string;
  themes?: string[];
  curated?: boolean;
}

interface LetterDetail {
  letter: string;
  name: string;
  paleoUnicode: string;
  pictograph: string;
  chosenMeaning: string;
  role: string;
  allMeanings: { text: string; role: string; primary: boolean }[];
}

interface ReportData {
  word: {
    text: string;
    textNiqqud: string;
    lemma: string;
    morph: string;
    position: number;
  };
  verseRef: {
    book: string;
    bookHe: string;
    chapter: number;
    verse: number;
  } | null;
  decoded: {
    rootLetters: string[];
    paleoHebrew: string;
    gematria: number;
    translit: string;
    letterDetails: LetterDetail[];
    interpretations: Interpretation[];
  };
  gloss: {
    id: string;
    gloss: string;
    translit: string;
  } | null;
  generatedAt: string;
}

function detectThemes(sentence: Interpretation): string[] {
  const words = [
    ...sentence.sentence.toLowerCase().split(/[\s,;:.]+/),
    ...sentence.letterBreakdown.map(lb => lb.chosenMeaning.toLowerCase().replace(/^to /, "")),
  ];
  const matched: string[] = [];
  for (const [theme, keywords] of Object.entries(THEMES)) {
    for (const kw of keywords) {
      if (words.some(w => w.includes(kw) || kw.includes(w))) {
        matched.push(theme);
        break;
      }
    }
  }
  return matched;
}

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 70 ? "#2d7d46" : score >= 45 ? "#b8860b" : "#9e4a4a";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "120px" }}>
      <div
        style={{
          width: "80px",
          height: "8px",
          backgroundColor: "#e5e7eb",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: "100%",
            backgroundColor: color,
            borderRadius: "4px",
          }}
        />
      </div>
      <span style={{ fontSize: "13px", fontWeight: 600, color }}>{score}%</span>
    </div>
  );
}

export default function ReportPage() {
  useReportMode();
  const [data, setData] = useState<ReportData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("wordReportData");
      if (raw) {
        setData(JSON.parse(raw));
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  }, []);

  // Auto-trigger print after render
  useEffect(() => {
    if (data) {
      const timer = setTimeout(() => window.print(), 800);
      return () => clearTimeout(timer);
    }
  }, [data]);

  if (error) {
    return (
      <div style={{ padding: "60px", textAlign: "center", fontFamily: "Georgia, serif" }}>
        <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>No Report Data</h1>
        <p style={{ color: "#666" }}>
          Please generate a report from the Torah Decoder by clicking a word and selecting
          &ldquo;Generate Report&rdquo;.
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: "60px", textAlign: "center", fontFamily: "Georgia, serif" }}>
        <p style={{ color: "#666" }}>Loading report...</p>
      </div>
    );
  }

  const { word, verseRef, decoded, gloss, generatedAt } = data;
  const morphDecoded = word.morph ? decodeMorphology(word.morph) : "";
  const timestamp = new Date(generatedAt).toLocaleString();

  return (
    <div className="report-page">
      <style>{`
        .report-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 48px;
          font-family: Georgia, "Times New Roman", serif;
          color: #1a1a1a;
          background: #fff;
          line-height: 1.6;
        }
        .report-page h1 { font-size: 18px; font-weight: 700; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 2px; color: #333; }
        .report-page h2 { font-size: 15px; font-weight: 700; margin: 24px 0 12px 0; text-transform: uppercase; letter-spacing: 1.5px; color: #444; border-bottom: 2px solid #1a1a1a; padding-bottom: 4px; }
        .report-page h3 { font-size: 13px; font-weight: 700; margin: 16px 0 8px 0; color: #555; }
        .report-page p { margin: 0 0 8px 0; font-size: 13px; }
        .report-page table { width: 100%; border-collapse: collapse; margin: 8px 0 16px 0; font-size: 12px; }
        .report-page th { text-align: left; padding: 6px 10px; border-bottom: 2px solid #333; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #555; }
        .report-page td { padding: 6px 10px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
        .report-page .hebrew-large { font-size: 42px; font-family: "SBL Hebrew", "Times New Roman", serif; direction: rtl; }
        .report-page .paleo-large { font-size: 28px; direction: rtl; color: #555; }
        .report-page .tag { display: inline-block; font-size: 10px; padding: 2px 8px; border-radius: 10px; background: #f0f0f0; color: #555; margin: 2px 2px; font-weight: 600; text-transform: capitalize; }
        .report-page .curated-tag { background: #e8f0fe; color: #1a56db; }
        .report-page .meaning-primary { font-weight: 700; }
        .report-page .meaning-secondary { color: #888; }
        .report-page .sentence-card { margin-bottom: 16px; padding: 12px 16px; border: 1px solid #e5e7eb; border-radius: 6px; page-break-inside: avoid; }
        .report-page .sentence-text { font-size: 15px; font-style: italic; margin-bottom: 6px; line-height: 1.5; }
        .report-page .letter-tag { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; background: #f5f5f5; border-radius: 4px; padding: 2px 6px; margin: 2px; }
        .report-page .letter-tag .he { font-family: "SBL Hebrew", "Times New Roman", serif; font-weight: 700; font-size: 13px; }
        .report-page .divider { border: none; border-top: 1px solid #ddd; margin: 24px 0; }
        .report-page .footer { margin-top: 32px; padding-top: 16px; border-top: 2px solid #1a1a1a; font-size: 11px; color: #888; }
        .print-btn { display: block; margin: 0 auto 24px auto; padding: 10px 28px; font-size: 14px; font-family: system-ui, sans-serif; border: 2px solid #333; border-radius: 6px; background: #fff; cursor: pointer; }
        .print-btn:hover { background: #f5f5f5; }
        @media print {
          .print-btn { display: none !important; }
          .report-page { padding: 0; max-width: 100%; }
          body { margin: 0; }
          @page { margin: 0.75in; size: letter; }
        }
      `}</style>

      {/* Print button (hidden during print) */}
      <button className="print-btn" onClick={() => window.print()}>
        Print Report
      </button>

      {/* ═══ HEADER ═══ */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <h1>Paleo-Hebrew Word Analysis</h1>
        <div className="hebrew-large" lang="he">
          {word.textNiqqud || word.text}
        </div>
        <div className="paleo-large">{decoded.paleoHebrew}</div>
        <p style={{ fontSize: "16px", fontStyle: "italic", marginTop: "4px" }}>
          {decoded.translit}
          {gloss && <> &mdash; &ldquo;{gloss.gloss}&rdquo;</>}
        </p>
        <div style={{ fontSize: "12px", color: "#666", marginTop: "6px" }}>
          <span>Gematria: {decoded.gematria}</span>
          {verseRef && (
            <>
              <span> &bull; </span>
              <span>
                {verseRef.book} {verseRef.chapter}:{verseRef.verse}, Word {word.position + 1}
              </span>
            </>
          )}
        </div>
      </div>

      {/* ═══ SECTION 1: LEXICAL DATA ═══ */}
      <h2>Lexical Definition</h2>
      <table>
        <tbody>
          {gloss && (
            <tr>
              <td style={{ width: "140px", fontWeight: 700 }}>English Gloss</td>
              <td>{gloss.gloss}</td>
            </tr>
          )}
          {word.lemma && (
            <tr>
              <td style={{ fontWeight: 700 }}>Lexicon ID</td>
              <td>{word.lemma}</td>
            </tr>
          )}
          {gloss?.translit && (
            <tr>
              <td style={{ fontWeight: 700 }}>Transliteration</td>
              <td>{gloss.translit} (lexical) / {decoded.translit} (phonetic)</td>
            </tr>
          )}
          {morphDecoded && (
            <tr>
              <td style={{ fontWeight: 700 }}>Morphology</td>
              <td>
                {morphDecoded}
                <br />
                <span style={{ fontSize: "11px", color: "#888" }}>Code: {word.morph}</span>
              </td>
            </tr>
          )}
          <tr>
            <td style={{ fontWeight: 700 }}>Gematria Value</td>
            <td>{decoded.gematria}</td>
          </tr>
        </tbody>
      </table>
      <p style={{ fontSize: "11px", color: "#888" }}>
        Source: Open Scriptures Hebrew Bible (OSHB), CC BY 4.0
      </p>

      {/* ═══ SECTION 2: PICTOGRAPHIC LETTER ANALYSIS ═══ */}
      <h2>Pictographic Letter Analysis</h2>
      <p style={{ fontSize: "12px", marginBottom: "12px" }}>
        Each Hebrew letter was originally a pictograph &mdash; a simple picture representing a concrete object
        and its associated concepts. The root letters of this word, read pictographically:
      </p>
      <table>
        <thead>
          <tr>
            <th>Letter</th>
            <th>Name</th>
            <th>Pictograph</th>
            <th>Value</th>
            <th>Meanings</th>
          </tr>
        </thead>
        <tbody>
          {decoded.letterDetails.map((detail, idx) => {
            const primaryMeanings = detail.allMeanings.filter(m => m.primary);
            const secondaryMeanings = detail.allMeanings.filter(m => !m.primary);
            return (
              <tr key={idx}>
                <td>
                  <span style={{ fontFamily: "'SBL Hebrew', serif", fontSize: "20px", fontWeight: 700 }} lang="he">
                    {detail.letter}
                  </span>
                </td>
                <td style={{ fontWeight: 600 }}>{detail.name}</td>
                <td>{detail.pictograph}</td>
                <td style={{ textAlign: "center" }}>
                  {/* Gematria per letter - derive from allMeanings context or show dash */}
                  &mdash;
                </td>
                <td>
                  {primaryMeanings.map((m, i) => (
                    <span key={i} className="meaning-primary">
                      {i > 0 && ", "}
                      {m.text}
                    </span>
                  ))}
                  {secondaryMeanings.length > 0 && (
                    <>
                      {primaryMeanings.length > 0 && "; "}
                      {secondaryMeanings.map((m, i) => (
                        <span key={i} className="meaning-secondary">
                          {i > 0 && ", "}
                          {m.text}
                        </span>
                      ))}
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ═══ SECTION 3: INTERPRETIVE SENTENCES ═══ */}
      <h2>Pictographic Interpretations</h2>
      <p style={{ fontSize: "12px", marginBottom: "12px" }}>
        The following interpretive sentences are formed by combining the pictographic
        meanings of each root letter. Each sentence is scored on a 100-point scale
        based on four factors: primary meaning usage, lexical alignment,
        grammatical naturalness, and theological coherence.
      </p>

      {decoded.interpretations.map((interp, idx) => {
        const themes = interp.themes && interp.themes.length > 0
          ? interp.themes
          : detectThemes(interp);

        return (
          <div key={idx} className="sentence-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#888" }}>
                #{idx + 1}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {interp.curated && <span className="tag curated-tag">Curated</span>}
                <ScoreBar score={interp.score} />
              </div>
            </div>

            <p className="sentence-text">&ldquo;{interp.sentence}&rdquo;</p>

            {/* Letter breakdown */}
            <div style={{ marginBottom: "4px" }}>
              {interp.letterBreakdown.map((lb, lbIdx) => (
                <span key={lbIdx} className="letter-tag">
                  <span className="he">{lb.letter}</span>
                  <span style={{ color: "#999" }}>=</span>
                  <span style={{ fontWeight: 600 }}>{lb.chosenMeaning}</span>
                  <span style={{ color: "#aaa", fontSize: "10px" }}>({lb.role})</span>
                </span>
              ))}
            </div>

            {/* Themes */}
            {themes.length > 0 && (
              <div>
                {themes.map(t => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            )}

            {/* Source */}
            <p style={{ fontSize: "10px", color: "#aaa", marginTop: "4px" }}>
              Source: {interp.curated ? "Hand-crafted scholarly reading" : `Algorithmic generation (Template ${interp.pattern})`}
            </p>
          </div>
        );
      })}

      <hr className="divider" />

      {/* ═══ SECTION 4: SCORING METHODOLOGY ═══ */}
      <h2>Scoring Methodology</h2>
      <p style={{ fontSize: "12px" }}>
        Each interpretive sentence is scored on a 100-point scale using four equally
        weighted factors (25 points each):
      </p>
      <table>
        <thead>
          <tr>
            <th>Factor</th>
            <th>Max</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ fontWeight: 600 }}>Primary Meaning Usage</td>
            <td style={{ textAlign: "center" }}>25</td>
            <td>Higher scores when the most widely attested meaning of each letter is used.</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 600 }}>Lexical Alignment</td>
            <td style={{ textAlign: "center" }}>25</td>
            <td>Rewards sentences whose keywords overlap with the lexical definition.</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 600 }}>Grammatical Naturalness</td>
            <td style={{ textAlign: "center" }}>25</td>
            <td>Favors natural clause structures over flat noun chains.</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 600 }}>Theological Coherence</td>
            <td style={{ textAlign: "center" }}>25</td>
            <td>Rewards alignment with six major biblical themes: creation, covenant, redemption, family, authority, and divine nature.</td>
          </tr>
        </tbody>
      </table>

      {/* ═══ SECTION 5: HISTORICAL CONTEXT ═══ */}
      <h2>About Paleo-Hebrew Pictographs</h2>
      <p style={{ fontSize: "12px" }}>
        Before Hebrew used the square Aramaic script seen in modern Torah scrolls, each
        letter was a pictograph &mdash; a simple drawing of an everyday object like an ox
        head (Aleph), a house (Bet), or a door (Dalet). This ancient writing system,
        sometimes called Proto-Sinaitic or Paleo-Hebrew, dates to roughly 1800&ndash;1000 BCE.
      </p>
      <p style={{ fontSize: "12px" }}>
        When the pictographic meanings of each letter in a Hebrew word are read together,
        they often reveal a deeper conceptual layer that illuminates the word&apos;s core
        meaning. This form of analysis is not a replacement for traditional lexicography,
        but offers a complementary devotional and scholarly lens through which to study
        the Hebrew scriptures.
      </p>
      <p style={{ fontSize: "12px" }}>
        The word <span lang="he" style={{ fontFamily: "'SBL Hebrew', serif", fontSize: "15px" }}>{word.textNiqqud || word.text}</span> ({decoded.translit})
        is composed of {decoded.rootLetters.length} root letter{decoded.rootLetters.length !== 1 ? "s" : ""}:
        {" "}
        {decoded.letterDetails.map((d, i) => (
          <span key={i}>
            {i > 0 && ", "}
            <strong>{d.name}</strong> ({d.pictograph})
          </span>
        ))}.
        {" "}Read together as pictures, these letters paint a composite image that resonates
        with the word&apos;s traditional meaning
        {gloss && <> of &ldquo;{gloss.gloss}&rdquo;</>}.
      </p>

      {/* ═══ FOOTER ═══ */}
      <div className="footer">
        <p>
          Generated by <strong>The Aleph Tav Project</strong>, paleo-hebrew-decoder.vercel.app
        </p>
        <p>
          Data sources: Open Scriptures Hebrew Bible (CC BY 4.0)
        </p>
        <p>Generated on {timestamp}</p>
        <p style={{ marginTop: "8px", fontStyle: "italic" }}>
          Pictographic analysis represents one interpretive approach to Hebrew. These
          readings are devotional study aids, not replacements for lexical definitions
          or established scholarship.
        </p>
      </div>
    </div>
  );
}
