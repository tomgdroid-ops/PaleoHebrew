import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Stone to Script",
  description:
    "Explore the fascinating journey from Paleo-Hebrew pictographs to Modern Hebrew square script. Interactive alphabet comparison, word studies, archaeological evidence, and timeline.",
};

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const TIMELINE = [
  {
    date: "~1800\u20131500 BC",
    title: "Proto-Sinaitic Origins",
    description:
      "The earliest ancestor of the Hebrew alphabet emerged in the Sinai Peninsula, likely developed by Semitic-speaking workers influenced by Egyptian hieroglyphics. These simple pictographs worked on a clever principle: the picture of an ox head made the \u201Cah\u201D sound because the word for ox (\u201Caleph\u201D) started with that sound. Each letter was named after the picture it resembled, and the first sound of that name became the letter\u2019s sound. Linguists call this principle \u201Cacrophony\u201D (a fancy way of saying \u201Cthe picture\u2019s name gives you the sound\u201D).",
  },
  {
    date: "~1200\u20131000 BC",
    title: "Early Paleo-Hebrew",
    description:
      "As the Israelites settled in Canaan, the script standardized into what scholars call Paleo-Hebrew. This is the script of the early judges and kings period. The Gezer Calendar (~925 BC) is one of the oldest known examples.",
  },
  {
    date: "~1000\u2013586 BC",
    title: "The First Temple Period",
    description:
      "Paleo-Hebrew was the everyday and official script during the united and divided monarchy. Artifacts like the Siloam Inscription (carved during King Hezekiah\u2019s reign, ~700 BC) and the Lachish Letters show this script in active use. This is the script David and Solomon would have known.",
  },
  {
    date: "586 BC",
    title: "The Babylonian Exile",
    description:
      "When Judah fell to Babylon, the Jewish people were immersed in Aramaic language and culture. Over time, they adopted the Aramaic square script for writing Hebrew. This was not a change in language, only a change in the letters used to write it. Think of it like switching from cursive to print: same words, different shapes.",
  },
  {
    date: "~500\u2013100 BC",
    title: "The Second Temple Transition",
    description:
      "During the Second Temple period, the square Aramaic-style script (sometimes called \u201CAshuri,\u201D meaning \u201CAssyrian,\u201D because of its origins in that region) gradually replaced Paleo-Hebrew for most uses. The Dead Sea Scrolls provide fascinating evidence of this transition: some scrolls use the older Paleo-Hebrew specifically when writing the divine name YHWH, as if the scribes felt the ancient letters were more fitting for God\u2019s name.",
  },
  {
    date: "~132\u2013135 AD",
    title: "Bar Kokhba Revival",
    description:
      "During the Bar Kokhba revolt against Rome, Paleo-Hebrew was briefly revived on coins as a symbol of Jewish national identity and independence, connecting the rebellion to the glory days of ancient Israel.",
  },
  {
    date: "1880s\u2013Present",
    title: "Modern Revival",
    description:
      "Eliezer Ben-Yehuda\u2019s revival of Hebrew as a spoken language used the square Ashuri script, which had been standard for over 2,000 years. This is the script used in Israel today.",
  },
];

const ALPHABET = [
  { name: "Aleph", paleo: "\u{10900}", modern: "\u05D0", pictograph: "Ox head (strength, leader)", sound: "Silent / glottal stop", value: 1, svg: "aleph" },
  { name: "Bet", paleo: "\u{10901}", modern: "\u05D1", pictograph: "House, tent", sound: "B / V", value: 2, svg: "bet" },
  { name: "Gimel", paleo: "\u{10902}", modern: "\u05D2", pictograph: "Camel, foot (to carry, walk)", sound: "G", value: 3, svg: "gimel" },
  { name: "Dalet", paleo: "\u{10903}", modern: "\u05D3", pictograph: "Door", sound: "D", value: 4, svg: "dalet" },
  { name: "Hey", paleo: "\u{10904}", modern: "\u05D4", pictograph: "Man with arms raised (behold, look)", sound: "H", value: 5, svg: "hey" },
  { name: "Vav", paleo: "\u{10905}", modern: "\u05D5", pictograph: "Tent peg, hook (to secure, connect)", sound: "V / W / O / U", value: 6, svg: "vav" },
  { name: "Zayin", paleo: "\u{10906}", modern: "\u05D6", pictograph: "Weapon, plow (to cut, nourish)", sound: "Z", value: 7, svg: "zayin" },
  { name: "Chet", paleo: "\u{10907}", modern: "\u05D7", pictograph: "Fence, enclosure (to protect, separate)", sound: "Ch (guttural)", value: 8, svg: "chet" },
  { name: "Tet", paleo: "\u{10908}", modern: "\u05D8", pictograph: "Snake, basket (to surround)", sound: "T", value: 9, svg: "tet" },
  { name: "Yod", paleo: "\u{10909}", modern: "\u05D9", pictograph: "Hand, arm (to work, deed)", sound: "Y", value: 10, svg: "yod" },
  { name: "Kaf", paleo: "\u{1090A}", modern: "\u05DB / \u05DA", pictograph: "Open palm (to cover, allow)", sound: "K / Kh", value: 20, svg: "kaf" },
  { name: "Lamed", paleo: "\u{1090B}", modern: "\u05DC", pictograph: "Shepherd\u2019s staff, goad (to teach, guide)", sound: "L", value: 30, svg: "lamed" },
  { name: "Mem", paleo: "\u{1090C}", modern: "\u05DE / \u05DD", pictograph: "Water, waves (chaos, mighty)", sound: "M", value: 40, svg: "mem" },
  { name: "Nun", paleo: "\u{1090D}", modern: "\u05E0 / \u05DF", pictograph: "Seed, fish, sprout (to continue, heir)", sound: "N", value: 50, svg: "nun" },
  { name: "Samekh", paleo: "\u{1090E}", modern: "\u05E1", pictograph: "Support, thorn (to protect, support)", sound: "S", value: 60, svg: "samekh" },
  { name: "Ayin", paleo: "\u{1090F}", modern: "\u05E2", pictograph: "Eye (to see, know, experience)", sound: "Silent / guttural", value: 70, svg: "ayin" },
  { name: "Pey", paleo: "\u{10910}", modern: "\u05E4 / \u05E3", pictograph: "Mouth (to speak, word)", sound: "P / F", value: 80, svg: "pey" },
  { name: "Tsade", paleo: "\u{10911}", modern: "\u05E6 / \u05E5", pictograph: "Fishhook, man on side (to hunt, righteous)", sound: "Ts", value: 90, svg: "tsade" },
  { name: "Qof", paleo: "\u{10912}", modern: "\u05E7", pictograph: "Back of the head, sun on horizon (cycle)", sound: "Q (deep K)", value: 100, svg: "qof" },
  { name: "Resh", paleo: "\u{10913}", modern: "\u05E8", pictograph: "Head of a person (chief, beginning)", sound: "R", value: 200, svg: "resh" },
  { name: "Shin", paleo: "\u{10914}", modern: "\u05E9", pictograph: "Teeth (to consume, destroy, sharp)", sound: "Sh / S", value: 300, svg: "shin" },
  { name: "Tav", paleo: "\u{10915}", modern: "\u05EA", pictograph: "Crossed sticks, mark, sign (covenant, seal)", sound: "T", value: 400, svg: "tav" },
];

const ALPHABET_GROUPS = [
  { label: "Letters 1\u20136", start: 0, end: 6 },
  { label: "Letters 7\u201312", start: 6, end: 12 },
  { label: "Letters 13\u201317", start: 12, end: 17 },
  { label: "Letters 18\u201322", start: 17, end: 22 },
];

const EVOLUTION_LETTERS = [
  { name: "Aleph", svg: "aleph", paleo: "\u{10900}", modern: "\u05D0", stage1: "Ox head facing left, two horns on top", stage2: "Simplified ox head, often rotated sideways", stage3: "Horns become diagonal strokes, head abstracts" },
  { name: "Bet", svg: "bet", paleo: "\u{10901}", modern: "\u05D1", stage1: "Simple floor plan of a house or tent", stage2: "Squared-off house shape with opening", stage3: "Corners sharpen, opening closes to a single base line" },
  { name: "Dalet", svg: "dalet", paleo: "\u{10903}", modern: "\u05D3", stage1: "Simple triangular door shape", stage2: "Triangle or fish-like shape", stage3: "Triangle flattens, becomes an angular corner" },
  { name: "Hey", svg: "hey", paleo: "\u{10904}", modern: "\u05D4", stage1: "Stick figure with arms raised", stage2: "Simplified figure, arms become top strokes", stage3: "Figure abstracts into horizontal and vertical lines" },
  { name: "Vav", svg: "vav", paleo: "\u{10905}", modern: "\u05D5", stage1: "Tent peg or hook shape (Y-shaped)", stage2: "Simplified Y or mast shape", stage3: "Straightens into a single vertical stroke with a head" },
  { name: "Yod", svg: "yod", paleo: "\u{10909}", modern: "\u05D9", stage1: "Forearm and hand reaching down", stage2: "Bent arm shape", stage3: "Arm shrinks dramatically into a small stroke" },
  { name: "Mem", svg: "mem", paleo: "\u{1090C}", modern: "\u05DE", stage1: "Wavy water lines (zigzag pattern)", stage2: "Simplified zigzag or M-shape", stage3: "Waves compress into a square with an opening" },
  { name: "Ayin", svg: "ayin", paleo: "\u{1090F}", modern: "\u05E2", stage1: "Simple eye shape (circle with a dot)", stage2: "Circular eye, sometimes with a stem", stage3: "Circle simplifies and abstracts" },
  { name: "Pey", svg: "pey", paleo: "\u{10910}", modern: "\u05E4", stage1: "Open mouth in profile showing teeth", stage2: "Head shape with an open mouth", stage3: "Mouth closes, profile becomes angular" },
  { name: "Shin", svg: "shin", paleo: "\u{10914}", modern: "\u05E9", stage1: "Two or three teeth or peaks", stage2: "W-shape or three-pointed crown", stage3: "Points refine into three upward strokes from a base" },
  { name: "Tav", svg: "tav", paleo: "\u{10915}", modern: "\u05EA", stage1: "Cross mark or X (signature mark)", stage2: "Simple cross or plus sign", stage3: "Cross rotates and one arm extends" },
];

const ALEPH_TO_ALPHABET_FEATURED = [
  { paleo: "\u{10900}", hebrew: "Aleph", greek: "\u0391", greekName: "Alpha", latin: "A" },
  { paleo: "\u{1090C}", hebrew: "Mem", greek: "\u039C", greekName: "Mu", latin: "M" },
  { paleo: "\u{1090F}", hebrew: "Ayin", greek: "\u039F", greekName: "Omicron", latin: "O" },
  { paleo: "\u{10914}", hebrew: "Shin", greek: "\u03A3", greekName: "Sigma", latin: "S" },
];

const ALEPH_TO_ALPHABET_ALL = [
  { paleo: "\u{10900}", hebrew: "Aleph", greek: "\u0391", greekName: "Alpha", latin: "A" },
  { paleo: "\u{10901}", hebrew: "Bet", greek: "\u0392", greekName: "Beta", latin: "B" },
  { paleo: "\u{10902}", hebrew: "Gimel", greek: "\u0393", greekName: "Gamma", latin: "G (and C)" },
  { paleo: "\u{10903}", hebrew: "Dalet", greek: "\u0394", greekName: "Delta", latin: "D" },
  { paleo: "\u{10904}", hebrew: "Hey", greek: "\u0395", greekName: "Epsilon", latin: "E" },
  { paleo: "\u{10905}", hebrew: "Vav", greek: "\u03A5", greekName: "Upsilon", latin: "F, U, V, W, Y" },
  { paleo: "\u{10906}", hebrew: "Zayin", greek: "\u0396", greekName: "Zeta", latin: "Z" },
  { paleo: "\u{10907}", hebrew: "Chet", greek: "\u0397", greekName: "Eta", latin: "H" },
  { paleo: "\u{10909}", hebrew: "Yod", greek: "\u0399", greekName: "Iota", latin: "I, J" },
  { paleo: "\u{1090A}", hebrew: "Kaf", greek: "\u039A", greekName: "Kappa", latin: "K" },
  { paleo: "\u{1090B}", hebrew: "Lamed", greek: "\u039B", greekName: "Lambda", latin: "L" },
  { paleo: "\u{1090C}", hebrew: "Mem", greek: "\u039C", greekName: "Mu", latin: "M" },
  { paleo: "\u{1090D}", hebrew: "Nun", greek: "\u039D", greekName: "Nu", latin: "N" },
  { paleo: "\u{1090F}", hebrew: "Ayin", greek: "\u039F", greekName: "Omicron", latin: "O" },
  { paleo: "\u{10910}", hebrew: "Pey", greek: "\u03A0", greekName: "Pi", latin: "P" },
  { paleo: "\u{10913}", hebrew: "Resh", greek: "\u03A1", greekName: "Rho", latin: "R" },
  { paleo: "\u{10914}", hebrew: "Shin", greek: "\u03A3", greekName: "Sigma", latin: "S" },
  { paleo: "\u{10915}", hebrew: "Tav", greek: "\u03A4", greekName: "Tau", latin: "T" },
];

const WORD_STUDIES = [
  {
    word: "Av",
    english: "Father",
    modern: "\u05D0\u05D1",
    paleo: "\u{10900}\u{10901}",
    letters: "Aleph (ox/strength) + Bet (house)",
    reading: "Strength of the house",
    reflection:
      "The father is the strong one of the household, the protector and provider. This meaning resonates throughout Scripture\u2019s portrayal of both earthly fathers and God as our heavenly Father.",
  },
  {
    word: "Ben",
    english: "Son",
    modern: "\u05D1\u05DF",
    paleo: "\u{10901}\u{1090D}",
    letters: "Bet (house) + Nun (seed/continue)",
    reading: "The one who continues the house",
    reflection:
      "A son carries forward the family line and the household name. Consider how Yeshua (Jesus), the Son, continues and fulfills the house of David and the household of God.",
  },
  {
    word: "YHWH",
    english: "The Name of God",
    modern: "\u05D9\u05D4\u05D5\u05D4",
    paleo: "\u{10909}\u{10904}\u{10905}\u{10904}",
    letters: "Yod (hand) + Hey (behold) + Vav (nail/peg) + Hey (behold)",
    reading: "Behold the hand, behold the nail",
    reflection:
      "Many believers see a profound foreshadowing of the crucifixion in these pictographs. While this is a devotional observation rather than a linguistic argument, it invites us to marvel at the depth woven into God\u2019s revealed name.",
  },
  {
    word: "Emet",
    english: "Truth",
    modern: "\u05D0\u05DE\u05EA",
    paleo: "\u{10900}\u{1090C}\u{10915}",
    letters: "Aleph (ox/first) + Mem (water/chaos) + Tav (mark/sign)",
    reading: "The first and last sign",
    reflection:
      "Emet is spelled with the first letter (Aleph), the middle letter (Mem), and the last letter (Tav) of the Hebrew alphabet, spanning from beginning to end. Jesus declared, \u201CI am the way, the truth, and the life\u201D (John 14:6).",
  },
  {
    word: "Brit",
    english: "Covenant",
    modern: "\u05D1\u05E8\u05D9\u05EA",
    paleo: "\u{10901}\u{10913}\u{10909}\u{10915}",
    letters: "Bet (house) + Resh (head/person) + Yod (hand) + Tav (sign/cross)",
    reading: "The house of a person, by hand, marked with a sign",
    reflection:
      "Covenant in the ancient world was deeply personal. It was sealed by a mark or sign, made by hand. God\u2019s covenants with His people have always been personal and sealed with a sign, from the rainbow to the cross.",
  },
];

const ARTIFACTS = [
  {
    name: "The Gezer Calendar",
    date: "~925 BC",
    location: "Ancient city of Gezer",
    script: "Paleo-Hebrew",
    description:
      "A small limestone tablet listing agricultural seasons in Paleo-Hebrew. One of the oldest known examples of Hebrew writing. Some scholars believe it was a schoolboy\u2019s writing exercise.",
  },
  {
    name: "The Siloam Inscription",
    date: "~700 BC",
    location: "Hezekiah\u2019s Tunnel, Jerusalem",
    script: "Paleo-Hebrew",
    description:
      "Carved in Paleo-Hebrew, it describes the dramatic moment when two teams of miners digging from opposite ends met in the middle. It provides direct evidence of the engineering project described in 2 Kings 20:20 and 2 Chronicles 32:30.",
  },
  {
    name: "The Lachish Letters",
    date: "~588 BC",
    location: "Fortress city of Lachish",
    script: "Paleo-Hebrew",
    description:
      "A collection of letters written in Paleo-Hebrew on pottery shards (broken pieces of clay pots that ancient people used like notepaper). Written during the final days before the Babylonian destruction of Judah, they provide a firsthand witness to the desperate conditions described by the prophet Jeremiah.",
  },
  {
    name: "The Moabite Stone (Mesha Stele)",
    date: "~840 BC",
    location: "Modern Jordan",
    script: "Moabite (closely related to Paleo-Hebrew)",
    description:
      "A large inscribed stone monument (a \u201Cstele\u201D is simply an upright stone slab with writing carved into it). It describes events from the perspective of King Mesha of Moab, who is mentioned in 2 Kings 3. It uses a nearly identical script to Paleo-Hebrew, showing how widespread this alphabet family was.",
  },
  {
    name: "The Dead Sea Scrolls",
    date: "~250 BC \u2013 68 AD",
    location: "Near Qumran",
    script: "Mixed (Square and Paleo-Hebrew)",
    description:
      "These scrolls demonstrate the transition period between scripts. Most are written in the Aramaic square script, but several use Paleo-Hebrew for the divine name YHWH, and a few texts (like the Paleo-Hebrew Leviticus scroll) are written entirely in the older script.",
  },
  {
    name: "Bar Kokhba Coins",
    date: "~132\u2013135 AD",
    location: "Ancient Judea",
    script: "Paleo-Hebrew",
    description:
      "Minted during the Jewish revolt against Rome. These coins deliberately used Paleo-Hebrew script as a nationalistic statement, connecting the rebellion to the ancient Israelite past, even though the square script had been standard for centuries.",
  },
];

const MISCONCEPTIONS = [
  {
    myth: "\u201CModern Hebrew letters are the same ones Moses used.\u201D",
    reality:
      "Moses would have written in Paleo-Hebrew (or an even earlier version of the script that scholars call \u201Cproto-Sinaitic,\u201D meaning \u201Cfrom the Sinai region\u201D). The square letters used today were adopted from Aramaic during and after the Babylonian Exile, roughly 1,000 years after Moses.",
  },
  {
    myth: "\u201CPaleo-Hebrew is a different language from Modern Hebrew.\u201D",
    reality:
      "Paleo-Hebrew and Modern Hebrew use different scripts (alphabets), but the underlying language is the same, just as English can be written in print or cursive without changing the language itself. Think of it like the difference between typing and handwriting.",
  },
  {
    myth: "\u201CThe square script was invented by the Jewish people.\u201D",
    reality:
      "The square script (called \u201CAshuri,\u201D meaning \u201CAssyrian,\u201D because of its regional origins) was borrowed from the Aramaic alphabet. Aramaic was the common language of business and government in the Babylonian and Persian empires. Jewish scribes adopted these Aramaic-style letters and used them to write Hebrew.",
  },
  {
    myth: "\u201CWe can build theology by decoding the pictographic meaning of each letter in a Hebrew word.\u201D",
    reality:
      "While the pictographic origins of each letter are well-documented, words developed their meanings through usage in context, not by combining letter pictures. Pictographic letter studies can be a beautiful devotional exercise, but they should complement, not replace, careful study of grammar, syntax, and context.",
  },
  {
    myth: "\u201CPaleo-Hebrew disappeared completely.\u201D",
    reality:
      "Paleo-Hebrew lingered for centuries after the square script became dominant. It was used on coins, in some Dead Sea Scroll texts, and by the Samaritans, whose community still uses a script descended from Paleo-Hebrew to this day.",
  },
];

/* ------------------------------------------------------------------ */
/*  NAV GUIDE ITEMS                                                    */
/* ------------------------------------------------------------------ */

const NAV_ITEMS = [
  { href: "#timeline", label: "The Story", desc: "How the alphabet changed over 3,000 years" },
  { href: "#alphabet-chart", label: "The Letters", desc: "See all 22 letters side by side" },
  { href: "#letter-evolution", label: "The Transformation", desc: "Watch the letters evolve step by step" },
  { href: "#aleph-to-alphabet", label: "The Connection", desc: "How Hebrew letters became our ABCs" },
  { href: "#word-studies", label: "Bible Connections", desc: "What this means for studying Scripture" },
  { href: "#artifacts", label: "The Evidence", desc: "Real artifacts you can see" },
  { href: "#misconceptions", label: "Myths vs. Facts", desc: "Common things people get wrong" },
];

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function StoneToScriptPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Stone to Script" }]} />

      {/* ============================================================ */}
      {/* SECTION 1 — HERO                                             */}
      {/* ============================================================ */}
      <section className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          From Stone to Script
        </h1>
        <p className="text-lg text-muted italic mb-10">
          How the alphabet of Abraham, Moses, and David became the Hebrew we
          read today
        </p>

        {/* Genesis 1:1 comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
          {/* Paleo-Hebrew */}
          <div className="p-5 rounded-xl border border-border bg-surface">
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">
              Paleo-Hebrew, circa 1000 BC
            </p>
            <p
              className="paleo-glyph text-primary leading-relaxed"
              style={{ fontSize: 28 }}
              dir="rtl"
              lang="he"
              aria-label="Genesis 1:1 in Paleo-Hebrew script"
            >
              {"\u{10901}\u{10913}\u{10900}\u{10914}\u{10909}\u{10915}"}{" "}
              {"\u{10901}\u{10913}\u{10900}"}{" "}
              {"\u{10900}\u{1090B}\u{10904}\u{10909}\u{1090C}"}{" "}
              {"\u{10900}\u{10915}"}{" "}
              {"\u{10904}\u{10914}\u{1090C}\u{10909}\u{1090C}"}{" "}
              {"\u{10905}\u{10900}\u{10915}"}{" "}
              {"\u{10904}\u{10900}\u{10913}\u{10911}"}
            </p>
          </div>

          {/* Modern Hebrew */}
          <div className="p-5 rounded-xl border border-border bg-surface">
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">
              Modern Hebrew (Square Script), used today
            </p>
            <p
              className="hebrew-text leading-relaxed"
              style={{ fontSize: 28 }}
              dir="rtl"
              lang="he"
              aria-label="Genesis 1:1 in Modern Hebrew"
            >
              {"\u05D1\u05B0\u05BC\u05E8\u05B5\u05D0\u05E9\u05C1\u05B4\u05D9\u05EA"}{" "}
              {"\u05D1\u05B8\u05BC\u05E8\u05B8\u05D0"}{" "}
              {"\u05D0\u05B1\u05DC\u05B9\u05D4\u05B4\u05D9\u05DD"}{" "}
              {"\u05D0\u05B5\u05EA"}{" "}
              {"\u05D4\u05B7\u05E9\u05C1\u05B8\u05BC\u05DE\u05B7\u05D9\u05B4\u05DD"}{" "}
              {"\u05D5\u05B0\u05D0\u05B5\u05EA"}{" "}
              {"\u05D4\u05B8\u05D0\u05B8\u05E8\u05B6\u05E5"}
            </p>
          </div>
        </div>

        {/* Intro paragraph */}
        <div className="max-w-3xl mx-auto text-left mb-10">
          <p className="leading-relaxed mb-4">
            Most people assume the Hebrew alphabet has always looked the way it
            does today. It hasn&apos;t.
          </p>
          <p className="leading-relaxed mb-4">
            The square letters found in modern Torah scrolls and Israeli street
            signs are actually an Aramaic-influenced script adopted centuries
            after the time of Moses and David.
          </p>
          <p className="leading-relaxed mb-4">
            The original Hebrew script, known as Paleo-Hebrew, was a
            pictographic alphabet where each letter began as a simple picture
            representing an everyday object. Understanding this journey
            transforms how we read and appreciate the Scriptures.
          </p>
        </div>

        {/* Quick-navigation guide */}
        <div className="max-w-3xl mx-auto rounded-xl border border-border bg-surface p-6 text-left">
          <p className="font-semibold text-primary mb-4 text-center">
            Where would you like to start?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-hover transition-colors"
              >
                <span className="shrink-0 w-2 h-2 mt-2 rounded-full bg-accent" />
                <span>
                  <span className="font-medium text-sm block">{item.label}</span>
                  <span className="text-xs text-muted">{item.desc}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2 — TIMELINE                                         */}
      {/* ============================================================ */}
      <section id="timeline" className="mb-20 scroll-mt-20">
        <h2 className="text-2xl font-bold text-primary mb-2 text-center">
          The Story of the Script
        </h2>
        <p className="text-muted text-center mb-8 max-w-2xl mx-auto">
          A 3,000-year journey from pictographs scratched in stone to the
          printed letters of a modern nation.
        </p>

        {/* Horizontal scroll on md+, vertical stack on mobile */}
        <div className="flex flex-col md:flex-row md:overflow-x-auto gap-4 md:gap-6 pb-4 md:snap-x md:snap-mandatory">
          {TIMELINE.map((stop, i) => (
            <div
              key={i}
              className="shrink-0 md:w-72 p-5 rounded-xl border border-border bg-surface md:snap-start"
            >
              <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">
                {stop.date}
              </p>
              <h3 className="font-bold mb-2">{stop.title}</h3>
              <p className="text-sm text-muted leading-relaxed">
                {stop.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3 — ALPHABET COMPARISON CHART                        */}
      {/* ============================================================ */}
      <section id="alphabet-chart" className="mb-20 scroll-mt-20">
        <h2 className="text-2xl font-bold text-primary mb-2 text-center">
          The 22 Letters Side by Side
        </h2>
        <p className="text-muted text-center mb-8 max-w-2xl mx-auto">
          Every letter of the Hebrew alphabet traces back to an ancient
          pictograph. Here they are, old and new, with the picture that started
          it all.
        </p>

        {ALPHABET_GROUPS.map((group) => (
          <div key={group.label} className="mb-8">
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-3 pl-1">
              {group.label}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ALPHABET.slice(group.start, group.end).map((letter) => (
                <div
                  key={letter.name}
                  className="p-4 rounded-xl border border-border bg-surface"
                >
                  {/* Top row: Paleo glyph + SVG pictograph + Modern letter */}
                  <div className="flex items-center gap-4 mb-3">
                    <span
                      className="paleo-glyph text-primary"
                      style={{ fontSize: 48 }}
                      aria-label={`Paleo-Hebrew ${letter.name}`}
                    >
                      {letter.paleo}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/glyphs/${letter.svg}.svg`}
                      alt={`${letter.name} pictograph`}
                      width={40}
                      height={40}
                      className="paleo-svg opacity-60"
                    />
                    <span
                      className="hebrew-text font-semibold ml-auto"
                      style={{ fontSize: 36 }}
                      lang="he"
                    >
                      {letter.modern}
                    </span>
                  </div>

                  {/* Letter name */}
                  <h3 className="font-bold text-primary text-sm mb-1">
                    {letter.name}
                  </h3>

                  {/* Details */}
                  <p className="text-xs text-muted leading-relaxed mb-1">
                    {letter.pictograph}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span>Sound: {letter.sound}</span>
                    <span className="text-accent font-semibold">
                      = {letter.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ============================================================ */}
      {/* SECTION 3B — LETTER EVOLUTION                                */}
      {/* ============================================================ */}
      <section id="letter-evolution" className="mb-20 scroll-mt-20">
        <h2 className="text-2xl font-bold text-primary mb-2 text-center">
          Watching the Letters Transform
        </h2>
        <div className="max-w-3xl mx-auto mb-8">
          <p className="text-muted text-center">
            The Paleo-Hebrew pictographs didn&apos;t become modern square
            letters overnight. The transformation happened gradually over
            centuries as scribes simplified, rotated, and abstracted the original
            pictures. Here you can trace each letter&apos;s journey through four
            key stages.
          </p>
        </div>

        {/* Stage labels */}
        <div className="hidden sm:grid sm:grid-cols-4 gap-4 mb-4 text-xs font-semibold text-muted uppercase tracking-wide text-center px-2">
          <span>Pictograph (~1500 BC)</span>
          <span>Paleo-Hebrew (~1000 BC)</span>
          <span>Transitional (~500 BC)</span>
          <span>Modern Hebrew</span>
        </div>

        <div className="flex flex-col gap-4">
          {EVOLUTION_LETTERS.map((letter) => (
            <div
              key={letter.name}
              className="rounded-xl border border-border bg-surface p-4"
            >
              <p className="font-bold text-primary text-sm mb-3 sm:hidden">
                {letter.name}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
                {/* Stage 1: Pictograph SVG */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs text-muted sm:hidden">
                    Pictograph
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/glyphs/${letter.svg}.svg`}
                    alt={`${letter.name} pictograph: ${letter.stage1}`}
                    width={56}
                    height={56}
                    className="paleo-svg opacity-70"
                  />
                  <span className="text-xs text-muted text-center leading-tight hidden lg:block">
                    {letter.stage1}
                  </span>
                </div>

                {/* Stage 2: Paleo Unicode font */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs text-muted sm:hidden">
                    Paleo-Hebrew
                  </span>
                  <span
                    className="paleo-glyph text-primary"
                    style={{ fontSize: 48 }}
                    aria-label={`Paleo-Hebrew ${letter.name}`}
                  >
                    {letter.paleo}
                  </span>
                  <span className="text-xs text-muted text-center leading-tight hidden lg:block">
                    {letter.stage2}
                  </span>
                </div>

                {/* Stage 3: Transitional (description) */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs text-muted sm:hidden">
                    Transitional
                  </span>
                  <span
                    className="paleo-glyph text-muted opacity-60"
                    style={{ fontSize: 44 }}
                    aria-label={`Transitional ${letter.name}`}
                  >
                    {letter.paleo}
                  </span>
                  <span className="text-xs text-muted text-center leading-tight">
                    {letter.stage3}
                  </span>
                </div>

                {/* Stage 4: Modern Hebrew */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs text-muted sm:hidden">Modern</span>
                  <span
                    className="hebrew-text font-semibold"
                    style={{ fontSize: 48 }}
                    lang="he"
                    aria-label={`Modern Hebrew ${letter.name}`}
                  >
                    {letter.modern}
                  </span>
                  <span className="text-xs text-muted hidden lg:block">
                    Today
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted text-center mt-4 italic">
          The remaining letters (Gimel, Zayin, Chet, Tet, Kaf, Lamed, Nun,
          Samekh, Tsade, Qof, and Resh) follow similar patterns of gradual
          simplification and abstraction.
        </p>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3C — ALEPH TO ALPHABET                               */}
      {/* ============================================================ */}
      <section id="aleph-to-alphabet" className="mb-20 scroll-mt-20">
        <h2 className="text-2xl font-bold text-primary mb-2 text-center">
          From Aleph to Alphabet
        </h2>
        <p className="text-lg text-muted text-center italic mb-4">
          How Ancient Hebrew Letters Became the ABCs
        </p>

        <div className="max-w-3xl mx-auto mb-10">
          <p className="leading-relaxed mb-4">
            Here is something most people never realize: the English alphabet
            you are reading right now descends from the same ancient Semitic
            pictographs that became the Hebrew alphabet.
          </p>
          <p className="leading-relaxed mb-4">
            When Phoenician traders carried their script across the
            Mediterranean, the Greeks adopted it, flipped and renamed the
            letters, and passed it on to the Romans, who gave it to us. The
            journey from Aleph to Alpha to the letter A is one continuous story.
          </p>
        </div>

        {/* Featured dramatic examples */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 max-w-3xl mx-auto">
          {ALEPH_TO_ALPHABET_FEATURED.map((item) => (
            <div
              key={item.latin}
              className="p-5 rounded-xl border border-border bg-surface text-center"
            >
              <div className="flex items-center justify-center gap-4 mb-3">
                <span
                  className="paleo-glyph text-primary"
                  style={{ fontSize: 48 }}
                >
                  {item.paleo}
                </span>
                <span className="text-muted text-lg">&rarr;</span>
                <span className="text-3xl font-bold">{item.greek}</span>
                <span className="text-muted text-lg">&rarr;</span>
                <span className="text-4xl font-bold text-primary">
                  {item.latin}
                </span>
              </div>
              <p className="text-sm text-muted">
                {item.hebrew} &rarr; {item.greekName} &rarr; {item.latin}
              </p>
            </div>
          ))}
        </div>

        {/* Full comparison table */}
        <div className="max-w-3xl mx-auto overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="py-2 px-3 text-left font-semibold text-muted text-xs uppercase">
                  Paleo
                </th>
                <th className="py-2 px-3 text-left font-semibold text-muted text-xs uppercase">
                  Hebrew Name
                </th>
                <th className="py-2 px-3 text-center font-semibold text-muted text-xs uppercase">
                  Greek
                </th>
                <th className="py-2 px-3 text-left font-semibold text-muted text-xs uppercase">
                  Greek Name
                </th>
                <th className="py-2 px-3 text-center font-semibold text-muted text-xs uppercase">
                  English
                </th>
              </tr>
            </thead>
            <tbody>
              {ALEPH_TO_ALPHABET_ALL.map((item) => (
                <tr key={item.latin} className="border-b border-border">
                  <td className="py-2 px-3">
                    <span
                      className="paleo-glyph text-primary"
                      style={{ fontSize: 24 }}
                    >
                      {item.paleo}
                    </span>
                  </td>
                  <td className="py-2 px-3">{item.hebrew}</td>
                  <td className="py-2 px-3 text-center text-lg font-semibold">
                    {item.greek}
                  </td>
                  <td className="py-2 px-3 text-muted">{item.greekName}</td>
                  <td className="py-2 px-3 text-center font-bold text-primary text-lg">
                    {item.latin}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Closing paragraph */}
        <div className="max-w-3xl mx-auto mt-8 p-5 rounded-xl border border-border bg-surface">
          <p className="leading-relaxed mb-3">
            The word &ldquo;alphabet&rdquo; itself comes from the first two
            Hebrew/Greek letters: Alpha + Beta, or in the original Hebrew,
            Aleph + Bet.
          </p>
          <p className="leading-relaxed">
            Every time you recite your ABCs, you are echoing an ancient Semitic
            tradition that stretches back nearly 4,000 years. The next time you
            write the letter A, remember that you are drawing a simplified,
            rotated ox head, and that the same pictograph lives on in the Hebrew
            letter Aleph. Scripture&apos;s language has shaped not just faith,
            but the very letters of human civilization.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4 — WORD STUDIES                                     */}
      {/* ============================================================ */}
      <section id="word-studies" className="mb-20 scroll-mt-20">
        <h2 className="text-2xl font-bold text-primary mb-2 text-center">
          Why This Matters for Understanding Scripture
        </h2>
        <div className="max-w-3xl mx-auto mb-8">
          <p className="text-muted text-center">
            When we understand that each Hebrew letter originally carried a
            visual meaning, it can add a layer of richness to our study of
            God&apos;s Word. While we should be careful not to build theology on
            pictographic interpretations alone, the connections are often
            beautiful and worth reflecting on.
          </p>
        </div>

        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
          {WORD_STUDIES.map((study) => (
            <div
              key={study.word}
              className="p-5 rounded-xl border border-border bg-surface"
            >
              <div className="flex items-center gap-4 mb-3">
                <span
                  className="paleo-glyph text-primary"
                  style={{ fontSize: 36 }}
                  dir="rtl"
                >
                  {study.paleo}
                </span>
                <span
                  className="hebrew-text font-semibold text-2xl"
                  lang="he"
                  dir="rtl"
                >
                  {study.modern}
                </span>
                <div>
                  <h3 className="font-bold text-primary">
                    {study.english} ({study.word})
                  </h3>
                </div>
              </div>
              <p className="text-sm mb-1">
                <span className="font-semibold">Letters:</span> {study.letters}
              </p>
              <p className="text-sm mb-3">
                <span className="font-semibold">Pictographic reading:</span>{" "}
                &ldquo;{study.reading}&rdquo;
              </p>
              <p className="text-sm text-muted leading-relaxed">
                {study.reflection}
              </p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="max-w-3xl mx-auto mt-6 p-4 rounded-lg bg-surface-hover text-xs text-muted leading-relaxed">
          <p className="font-semibold mb-1">
            A note on pictographic word studies:
          </p>
          <p>
            These reflections are devotional in nature. While the pictographic
            origins of Hebrew letters are well-established by archaeology,
            building word meanings from individual letter pictures is not the
            same as formal Hebrew linguistics. The ancient pictographs predate
            the words that were later spelled with these letters. Enjoy these
            connections as a source of wonder and worship, but always ground your
            theology in the full context of Scripture and careful Bible study.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5 — ARCHAEOLOGICAL EVIDENCE                         */}
      {/* ============================================================ */}
      <section id="artifacts" className="mb-20 scroll-mt-20">
        <h2 className="text-2xl font-bold text-primary mb-2 text-center">
          Written in Stone: The Evidence
        </h2>
        <p className="text-muted text-center mb-8 max-w-2xl mx-auto">
          These real archaeological discoveries confirm the history of the
          Hebrew script. Each artifact is a tangible connection to the world of
          the Bible.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {ARTIFACTS.map((artifact) => (
            <div
              key={artifact.name}
              className="p-5 rounded-xl border border-border bg-surface"
            >
              {/* Placeholder image area */}
              <div className="w-full h-32 rounded-lg bg-surface-hover flex items-center justify-center mb-4">
                <span className="text-xs text-muted italic text-center px-4">
                  {artifact.name}
                </span>
              </div>

              <h3 className="font-bold text-primary mb-1">{artifact.name}</h3>
              <div className="flex flex-wrap gap-2 mb-2 text-xs text-muted">
                <span className="px-2 py-0.5 rounded-full bg-surface-hover">
                  {artifact.date}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-hover">
                  {artifact.location}
                </span>
              </div>
              <p className="text-xs text-accent font-semibold mb-2">
                Script: {artifact.script}
              </p>
              <p className="text-sm text-muted leading-relaxed">
                {artifact.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 6 — MISCONCEPTIONS                                   */}
      {/* ============================================================ */}
      <section id="misconceptions" className="mb-20 scroll-mt-20">
        <h2 className="text-2xl font-bold text-primary mb-2 text-center">
          What Most People Get Wrong
        </h2>
        <p className="text-muted text-center mb-8 max-w-2xl mx-auto">
          Separating fact from fiction about the Hebrew alphabet.
        </p>

        <div className="flex flex-col gap-4 max-w-3xl mx-auto">
          {MISCONCEPTIONS.map((item, i) => (
            <details
              key={i}
              className="rounded-xl border border-border bg-surface group"
            >
              <summary className="cursor-pointer p-4 sm:p-5 font-semibold text-sm flex items-start gap-3 list-none [&::-webkit-details-marker]:hidden">
                <span className="shrink-0 w-6 h-6 rounded-full bg-accent-light/30 text-accent text-xs flex items-center justify-center font-bold mt-0.5">
                  ?
                </span>
                <span>
                  <span className="text-xs text-muted uppercase tracking-wide block mb-0.5">
                    Misconception
                  </span>
                  {item.myth}
                </span>
                <span className="ml-auto shrink-0 text-muted transition-transform group-open:rotate-180">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 6l4 4 4-4" />
                  </svg>
                </span>
              </summary>
              <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
                <div className="pl-9">
                  <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">
                    Reality
                  </p>
                  <p className="text-sm text-muted leading-relaxed">
                    {item.reality}
                  </p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* FOOTER                                                       */}
      {/* ============================================================ */}
      <div className="text-center text-xs text-muted border-t border-border pt-6">
        <p>
          This page presents well-established scholarship about the history of
          the Hebrew alphabet. Pictographic letter data is based on
          Proto-Sinaitic and early Phoenician forms documented by researchers
          including Frank Moore Cross and Christopher Rollston.
        </p>
      </div>
    </div>
  );
}
