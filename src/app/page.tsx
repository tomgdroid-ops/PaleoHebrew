import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Frame from "@/components/home/Frame";
import PivotStage from "@/components/home/PivotStage";
import Reveal from "@/components/home/Reveal";
import JsonLd from "@/components/JsonLd";
import { plate } from "@/lib/plates";

import "./romans.css";

export const metadata: Metadata = {
  title: {
    absolute: "The Aleph Tav Project — There Is Therefore Now No Condemnation",
  },
  description:
    "Romans 8:1, read slowly. A cinematic descent from accusation into grace — and the mark the Hebrew Scriptures were already using for the same thing.",
  openGraph: {
    title: "There Is Therefore Now No Condemnation — Romans 8:1",
    description:
      "Romans 8:1, read slowly. A cinematic descent from accusation into grace — and the mark the Hebrew Scriptures were already using for the same thing.",
  },
};

/* Each voice sits at its own depth in the room. */
const WHISPERS = [
  { text: "not enough.", x: 0 },
  { text: "too far gone.", x: 22 },
  { text: "you knew better.", x: 7 },
  { text: "again.", x: 34 },
];

/**
 * Genesis 1:1, pointed, straight from this project's own OSHB data
 * (data/torah/genesis.json). Positions 3 and 5 carry lemma H0853 — the
 * particle no English Bible renders.
 */
const GENESIS_1_1 = [
  { position: 0, he: "בְּרֵאשִׁ֖ית", mark: false },
  { position: 1, he: "בָּרָ֣א", mark: false },
  { position: 2, he: "אֱלֹהִ֑ים", mark: false },
  { position: 3, he: "אֵ֥ת", mark: true },
  { position: 4, he: "הַשָּׁמַ֖יִם", mark: false },
  { position: 5, he: "וְאֵ֥ת", mark: true },
  { position: 6, he: "הָאָֽרֶץ", mark: false },
];

/** The mark, standing in the English where nothing else does. */
function Et() {
  return (
    <span className="r81-et" dir="rtl" role="img" aria-label="aleph tav, untranslated">
      &#x10900;&#x10915;
    </span>
  );
}

const DOORS = [
  {
    href: "/torah/genesis/1",
    title: "The Torah, word by word",
    desc: "Open Genesis and take the text apart one Hebrew word at a time — pictograph, root, and gloss, side by side.",
  },
  {
    href: "/alphabet",
    title: "Twenty-two letters",
    desc: "Every Hebrew letter began as a picture of a thing. See where each one came from and what it still carries.",
  },
  {
    href: "/aleph-tav",
    title: "The mark nobody translates",
    desc: "Aleph and Tav, tracked across 23,213 verses — where the mark stands, and where it goes missing.",
  },
];

const PAGE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "There Is Therefore Now No Condemnation — Romans 8:1",
  url: "https://alephtavproject.com",
  description:
    "Romans 8:1 read as a five-act descent from accusation into grace, and the covenant mark the Hebrew Scriptures use for the same idea.",
  isPartOf: {
    "@type": "WebSite",
    name: "The Aleph Tav Project",
    url: "https://alephtavproject.com",
  },
  about: {
    "@type": "Quotation",
    text: "There is therefore now no condemnation for those who are in Christ Jesus.",
    citation: "Romans 8:1",
  },
};

/* A flat plain, one hairline of first light, and haze. Act I and Act V share
   it exactly: the page ends where it began, in daylight. */
function Valley() {
  return (
    <>
      <div className="glow" />
      <div className="ground" />
      <div className="haze" />
      <div className="horizon-line" />
    </>
  );
}

/* A beam angled into the right third, and the pool it makes on the floor. */
function Chamber() {
  return (
    <>
      <div className="shaft" />
      <div className="pool" />
    </>
  );
}

/* Act III stacks two of these and cross-fades them, so it needs the light
   field wrapper rather than just the geometry. */
function ChamberLight({ warm = false }: { warm?: boolean }) {
  return (
    <div className={`frame__light lf-chamber${warm ? " lf-chamber--warm" : ""}`}>
      <Chamber />
    </div>
  );
}

function Arrow() {
  return (
    <svg
      className="r81-door__arrow"
      width="26"
      height="10"
      viewBox="0 0 26 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      <path d="M0 5h24M20 1l4 4-4 4" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Marks the document before first paint, so the reveal system may hide
          things it is certain it can bring back. No JS, nothing hidden. */}
      <script
        dangerouslySetInnerHTML={{
          __html: "document.documentElement.classList.add('r81-js')",
        }}
      />
      <JsonLd data={PAGE_JSONLD} />
      <Reveal />

      <div className="r81">
        {/* ============================================================
            ACT I — THE UNFINISHED SENTENCE
            An hour before dawn. The verse begins and does not finish.
            ============================================================ */}
        <section className="r81-hero">
          <Frame light="lf-void" plateKey="void" priority>
            <Valley />
          </Frame>

          <div className="act">
            <p className="label r81-hero__label">Romans 8:1</p>
            <h1 className="display r81-hero__line">
              There is therefore now
              <span className="r81-caret" aria-hidden="true" />
            </h1>
          </div>

          <div className="r81-hero__foot">
            <span className="r81-thread" aria-hidden="true" />
            <span className="r81-hero__cue" aria-hidden="true">
              The sentence continues
            </span>
            <span className="sr-only">Scroll to continue reading.</span>
          </div>
        </section>

        {/* ============================================================
            ACT II — THE WEIGHT
            The voice, not the verdict. The verdict belongs to Act III.
            ============================================================ */}
        <section className="r81-weight" aria-labelledby="r81-weight-heading">
          <Frame light="lf-chamber" plateKey="chamberCold">
            <Chamber />
          </Frame>

          <div className="act">
            <p className="label" data-reveal>
              I — The Weight
            </p>
            <h2
              className="r81-weight__line"
              id="r81-weight-heading"
              data-reveal
              style={{ "--d": 1 } as React.CSSProperties}
            >
              You know the voice. It uses your own name.
            </h2>

            <ul
              className="r81-whispers"
              data-reveal
              style={{ "--d": 2 } as React.CSSProperties}
            >
              {WHISPERS.map((whisper, i) => (
                <li
                  key={whisper.text}
                  style={{ "--i": i, "--x": whisper.x } as React.CSSProperties}
                >
                  {whisper.text}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ============================================================
            ACT III — THE WORD
            One word arrives and the room changes temperature. The old word
            is never struck through; it simply stops being the brightest
            thing on the screen.
            ============================================================ */}
        <PivotStage className="r81-pivot">
          <div className="r81-stage">
            <div className="frame grain" aria-hidden="true">
              <ChamberLight />
              <PivotPlate which="cold" />
              <ChamberLight warm />
              <PivotPlate which="warm" />
              <div className="frame__grade grade-chamber" />
            </div>
            <div className="r81-bloom" aria-hidden="true" />

            <div className="act">
              <p className="label">II — The Word</p>
              <h2 className="display r81-pivot__line">
                <span className="r81-no">No</span>{" "}
                <span className="r81-cond">condemnation</span>
              </h2>
              <p className="r81-pivot__coda">
                Not softened. Not suspended. <em>Removed.</em>
              </p>
            </div>
          </div>
        </PivotStage>

        {/* ============================================================
            ACT IV — THE WELCOME
            The page turns to paper. After five screens of night, the absence
            of an image is the strongest image available.
            ============================================================ */}
        <section className="r81-welcome" aria-labelledby="r81-welcome-heading">
          <div className="r81-welcome__wash">
            <div className="frame grain" aria-hidden="true">
              <div className="frame__light lf-wash" />
            </div>
          </div>

          <div className="act r81-welcome__body">
            <p className="label" data-reveal>
              III — The Welcome
            </p>
            <h2
              className="display r81-welcome__phrase"
              id="r81-welcome-heading"
              data-reveal
              style={{ "--d": 1 } as React.CSSProperties}
            >
              for those who are
            </h2>

            <p
              className="prose"
              data-reveal
              style={{ "--d": 2 } as React.CSSProperties}
            >
              Not <em>for those who managed it</em>. Not{" "}
              <em>for those who finally got it right</em>. The sentence closes
              the condition before it can open.
            </p>

            <div className="r81-mark">
              <p className="prose" data-reveal>
                Long before Paul wrote that line, the Hebrew text was already
                carrying a mark that nobody translates — two letters, the first
                and the last of the alphabet. It stands in the very first
                sentence of the Bible. Twice.
              </p>

              <figure
                className="r81-specimen"
                data-reveal
                style={{ "--d": 1 } as React.CSSProperties}
              >
                <p className="r81-specimen__he" lang="he" dir="rtl">
                  {GENESIS_1_1.map((word) => (
                    <span
                      key={word.position}
                      className={word.mark ? "is-mark" : undefined}
                    >
                      {word.he}
                    </span>
                  ))}
                </p>

                <p className="r81-specimen__en">
                  In the beginning God created <Et /> the heavens and <Et /> the
                  earth.
                </p>

                <figcaption>
                  Genesis 1:1 — twice in the Hebrew, twice absent in English
                </figcaption>
              </figure>

              <div data-reveal style={{ "--d": 2 } as React.CSSProperties}>
                <p className="prose" style={{ marginTop: "clamp(2rem,5vh,3rem)" }}>
                  This project follows that mark through the text. Where it
                  stands, and where it goes missing.
                </p>
                <Link href="/aleph-tav" className="r81-link">
                  Follow the mark through the text
                  <svg
                    width="18"
                    height="8"
                    viewBox="0 0 18 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    aria-hidden="true"
                  >
                    <path d="M0 4h16M13 1l3 3-3 3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            ACT V — THE MORNING
            The same valley as Act I, and the sentence, whole, for the
            first time.
            ============================================================ */}
        <section className="r81-morning" aria-labelledby="r81-morning-heading">
          <Frame light="lf-morning" grade="grade-warm" plateKey="morning">
            <Valley />
          </Frame>

          <div className="act">
            <p className="label" data-reveal>
              IV — The Morning
            </p>
            <h2
              className="display r81-verse"
              id="r81-morning-heading"
              data-reveal
              style={{ "--d": 1 } as React.CSSProperties}
            >
              There is therefore now <b>no condemnation</b> for those who are in
              Christ Jesus.
            </h2>
            <p
              className="r81-morning__ref"
              data-reveal
              style={{ "--d": 2 } as React.CSSProperties}
            >
              Romans 8:1
            </p>
            <p
              className="r81-morning__close"
              data-reveal
              style={{ "--d": 3 } as React.CSSProperties}
            >
              The sentence is finished. It was finished before you arrived.
            </p>
          </div>
        </section>

        {/* ============================================================
            EXIT — three doors, set as an index rather than a card grid
            ============================================================ */}
        <section className="r81-exit" aria-labelledby="r81-exit-heading">
          <Frame light="lf-doorway" plateKey="threshold" />

          <div className="act">
            <h2 className="r81-exit__intro" id="r81-exit-heading" data-reveal>
              Begin anywhere.
            </h2>

            <div className="r81-doors">
              {DOORS.map((door, i) => (
                <Link
                  key={door.href}
                  href={door.href}
                  className="r81-door"
                  data-reveal
                  style={{ "--d": i + 1 } as React.CSSProperties}
                >
                  <span className="r81-door__n" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="r81-door__title">{door.title}</h3>
                  <Arrow />
                  <p className="r81-door__desc">{door.desc}</p>
                </Link>
              ))}
            </div>

            <div className="r81-sign" data-reveal>
              <span className="r81-sign__glyph" dir="rtl" aria-hidden="true">
                &#x10900;&#x10915;
              </span>
              <span className="r81-sign__name">The Aleph Tav Project</span>
            </div>

            <p className="r81-note">
              This project reads the Hebrew Scriptures through pictographic,
              structural, and covenantal lenses. Scholars differ on how far
              those readings can be pressed. Everything here is offered as
              study, alongside the standard lexicons — never in place of them.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

/** The pivot cross-fades one room against itself, so its plates are paired. */
function PivotPlate({ which }: { which: "cold" | "warm" }) {
  const photo = plate(which === "cold" ? "chamberCold" : "chamberWarm");
  if (!photo) return null;
  return (
    <Image
      className={`frame__plate plate-${which}`}
      src={photo.file}
      alt=""
      fill
      sizes="100vw"
    />
  );
}
