"use client";

import { useState } from "react";
import Link from "next/link";
import ContinueExploring from "@/components/ContinueExploring";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Category = "removed" | "gained" | "persistent";

interface Verse {
  ref: string;
  hasAT: boolean;
  context: string;
}

interface PeriodRow {
  period: string;
  withAT: number;
  total: number;
  rate: string;
}

interface NameEntry {
  id: string;
  name: string;
  hebrew: string;
  category: Category;
  confidence: string;
  summary: string;
  stats: {
    total: number;
    withAT: number;
    withoutAT: number;
    rate: string;
    detail: string;
  };
  verses: Verse[];
  periodTable?: PeriodRow[];
  specialNote?: string;
  triggerEvent: string;
  analysis: string;
  principle: string;
}

/* ------------------------------------------------------------------ */
/*  Category styling                                                   */
/* ------------------------------------------------------------------ */

const CATEGORY_META: Record<
  Category,
  {
    title: string;
    subtitle: string;
    titleClass: string;
    cardBorder: string;
    accentBorder: string;
    badgeClass: string;
    hoverClass: string;
  }
> = {
  removed: {
    title: "את Removed",
    subtitle: "Covenant Lost",
    titleClass: "text-red-500",
    cardBorder: "border-red-400/30",
    accentBorder: "border-l-red-500",
    badgeClass: "bg-red-500/10 text-red-500",
    hoverClass: "hover:bg-red-500/5",
  },
  gained: {
    title: "את Gained",
    subtitle: "Covenant Entered",
    titleClass: "text-emerald-500",
    cardBorder: "border-emerald-400/30",
    accentBorder: "border-l-emerald-500",
    badgeClass: "bg-emerald-500/10 text-emerald-500",
    hoverClass: "hover:bg-emerald-500/5",
  },
  persistent: {
    title: "את Persistent",
    subtitle: "Covenant Maintained",
    titleClass: "text-blue-500",
    cardBorder: "border-blue-400/30",
    accentBorder: "border-l-blue-500",
    badgeClass: "bg-blue-500/10 text-blue-500",
    hoverClass: "hover:bg-blue-500/5",
  },
};

/* ------------------------------------------------------------------ */
/*  Name data (all 12 entries)                                         */
/* ------------------------------------------------------------------ */

const NAMES: NameEntry[] = [
  /* ---- GROUP 1: REMOVED ---- */
  {
    id: "esau",
    name: "Esau",
    hebrew: "עשו",
    category: "removed",
    confidence: "Very High",
    summary:
      "Despised the birthright. את vanishes after Genesis 27:1.",
    stats: {
      total: 118,
      withAT: 2,
      withoutAT: 116,
      rate: "1.7%",
      detail: "118 total in the Torah. 2 with את (both early); 116 without after Gen 27:1.",
    },
    verses: [
      {
        ref: "Gen 25:28",
        hasAT: true,
        context: '"Isaac loved את-Esau." Both sons under covenant.',
      },
      {
        ref: "Gen 27:1",
        hasAT: true,
        context: "Isaac calls את-Esau to bless him (the LAST time).",
      },
      {
        ref: "Gen 27:5 onward",
        hasAT: false,
        context: "Never again. 116 more occurrences, zero את.",
      },
    ],
    triggerEvent:
      'Genesis 25:34: "So Esau despised את-the birthright." After Genesis 27:1, despite his name appearing 116+ more times in the Torah alone, the את never precedes Esau\'s name again.',
    analysis:
      'Esau sold his birthright for a bowl of stew (Gen 25:31-33). The birthright was not merely a financial inheritance. It was the covenantal firstborn blessing passed from Abraham to Isaac, carrying the promise of God\'s redemptive plan. Esau treated this sacred covenant inheritance as worthless, trading it for immediate physical gratification. Hebrews 12:16 calls him "profane" (bebelos in Greek), meaning common, unhallowed, the opposite of set apart.',
    principle:
      "When you treat God's covenant as common and worthless, the covenant marker departs.",
  },
  {
    id: "cain",
    name: "Cain",
    hebrew: "קין",
    category: "removed",
    confidence: "Very High",
    summary:
      "Born into the covenant family. את vanishes after Genesis 4:1.",
    stats: {
      total: 16,
      withAT: 1,
      withoutAT: 15,
      rate: "6.3%",
      detail: "16 total. 1 with את (the very first mention); 15 without after.",
    },
    verses: [
      {
        ref: "Gen 4:1",
        hasAT: true,
        context: '"Eve bore את-Cain." His birth into the covenant family.',
      },
      {
        ref: "Gen 4:3 onward",
        hasAT: false,
        context: "Never again, through 15 more occurrences.",
      },
    ],
    triggerEvent:
      "Cain's offering is rejected (Gen 4:3-5), he murders his brother Abel (Gen 4:8), lies to God (Gen 4:9), and is driven from God's presence (Gen 4:16).",
    analysis:
      'God warned Cain personally: "If you do well, will you not be accepted? And if you do not do well, sin is crouching at the door" (Gen 4:7). Despite this direct warning, Cain chose murder, then lied to God\'s face: "Am I my brother\'s keeper?" His response to judgment was not repentance but self-pity: "My punishment is more than I can bear" (Gen 4:13). Genesis 4:16 says, "Cain went out from the presence of the LORD."',
    principle:
      "The את was present at Cain's birth into the covenant family. When he rejected God's direct instruction, murdered the righteous, refused to repent, and departed from God's presence, the marker departed with God's presence.",
  },
  {
    id: "solomon",
    name: "Solomon",
    hebrew: "שלמה",
    category: "removed",
    confidence: "Very High",
    summary:
      "8 with את before idolatry, 0 after. A clean 100% split.",
    stats: {
      total: 136,
      withAT: 8,
      withoutAT: 128,
      rate: "5.9%",
      detail:
        "136 total in 1 Kings. 8 with את (all before chapter 11); 0 in chapters 11-22 (22 mentions).",
    },
    verses: [
      { ref: "1 Kgs 1:10", hasAT: true, context: "Solomon during David's reign." },
      { ref: "1 Kgs 1:33", hasAT: true, context: "David orders Solomon anointed king." },
      { ref: "1 Kgs 1:38", hasAT: true, context: "Solomon rides David's mule." },
      { ref: "1 Kgs 1:39", hasAT: true, context: "Zadok anoints Solomon." },
      { ref: "1 Kgs 1:43", hasAT: true, context: "Jonathan reports Solomon is made king." },
      { ref: "1 Kgs 2:1", hasAT: true, context: "David charges Solomon." },
      { ref: "1 Kgs 5:1", hasAT: true, context: "Solomon in covenant, building the Temple." },
      { ref: "1 Kgs 9:11", hasAT: true, context: "After Temple completion." },
      {
        ref: "1 Kgs 11:1+",
        hasAT: false,
        context: "Never again. Solomon turns to idolatry.",
      },
    ],
    triggerEvent:
      "1 Kings 11:1-10 describes Solomon's heart turning after foreign gods. He built high places for Chemosh (the abomination of Moab) and Molech (the abomination of the Ammonites) on the Mount of Olives, in direct sight of the Temple he himself had built. This is a clean 100% before/after split.",
    analysis:
      '"King Solomon loved many foreign women... his wives turned his heart after other gods; and his heart was not loyal to the LORD his God" (1 Kgs 11:1-4). God had personally appeared to Solomon twice (1 Kgs 11:9), and Solomon still turned away.',
    principle:
      "Even the wisest man in history, the builder of God's Temple, lost the covenant marker when he gave his heart to other gods. The את tracks loyalty to the covenant God, not human achievement or status.",
  },
  {
    id: "saul",
    name: "Saul",
    hebrew: "שאול",
    category: "removed",
    confidence: "High",
    summary: "את rate drops 75%+ after God rejects him as king.",
    stats: {
      total: 261,
      withAT: 13,
      withoutAT: 248,
      rate: "5.0%",
      detail:
        "261 total in 1 Samuel. 9 with את in chapters 1-15 (9.4%); 4 with את in chapters 16-31 (2.4%), a 75%+ drop.",
    },
    periodTable: [
      { period: "1 Sam 1-15 (anointed, in favor)", withAT: 9, total: 96, rate: "9.4%" },
      { period: "1 Sam 16-31 (rejected by God)", withAT: 4, total: 165, rate: "2.4%" },
    ],
    verses: [],
    specialNote:
      'The את appears in 1 Sam 15:11 ("I regret that I made את-Saul king") and 1 Sam 15:35 ("The LORD regretted that He had made את-Saul king"), both verses where God Himself speaks about Saul while regretting His covenant with him.',
    triggerEvent:
      '1 Samuel 15:22-23: "To obey is better than sacrifice... Because you have rejected the word of the LORD, He also has rejected you from being king."',
    analysis:
      'God gave Saul a specific command: completely destroy the Amalekites and everything they possessed. Saul disobeyed, kept the best livestock alive, spared King Agag, then tried to redefine his disobedience as worship: "The people took of the plunder... to sacrifice to the LORD" (1 Sam 15:21). When confronted, his primary concern was saving face: "Honor me now, please, before the elders" (1 Sam 15:30).',
    principle:
      "Partial obedience is disobedience. Religious performance without heart-level surrender to God's word breaks covenant relationship. The את does not vanish entirely (this is not as clean as Esau or Solomon), but the dramatic 75%+ drop in rate, concentrated around the rejection narrative, fits the pattern.",
  },
  {
    id: "ishmael",
    name: "Ishmael",
    hebrew: "ישמעאל",
    category: "removed",
    confidence: "High",
    summary:
      "את present only while in Abraham's household. None after separation.",
    stats: {
      total: 13,
      withAT: 2,
      withoutAT: 11,
      rate: "15.4%",
      detail:
        "13 total in Genesis. 2 with את (both while in Abraham's household); 0 in remaining 11.",
    },
    verses: [
      {
        ref: "Gen 16:16",
        hasAT: true,
        context: '"Abram was 86 when Hagar bore את-Ishmael to Abram."',
      },
      {
        ref: "Gen 17:23",
        hasAT: true,
        context: "Abraham circumcises את-Ishmael (covenant of circumcision).",
      },
      {
        ref: "Gen 25:12 onward",
        hasAT: false,
        context: "After separation, genealogy references only.",
      },
    ],
    triggerEvent:
      "After Ishmael and Hagar are sent away (Gen 21:14), the את no longer appears before Ishmael's name. The two occurrences are directly tied to covenant acts: his birth to Abram, and his circumcision.",
    analysis:
      'Ishmael himself is not portrayed as committing a specific sin that triggers removal. Rather, the covenant was directed elsewhere by God\'s sovereign choice: "In Isaac your seed shall be called" (Gen 21:12). Ishmael was born of the flesh (Hagar, the human attempt to fulfill God\'s promise), while Isaac was born of the promise. Paul explicitly makes this connection in Galatians 4:22-31. God still blessed Ishmael (Gen 21:13, 18), but the covenant marker followed the covenant line.',
    principle:
      "The את tracked with Ishmael only while he was physically within the covenant household and participated in the covenant sign (circumcision). Once separated from the covenant line, the marker departed.",
  },

  /* ---- GROUP 2: GAINED ---- */
  {
    id: "ruth",
    name: "Ruth",
    hebrew: "רות",
    category: "gained",
    confidence: "Very High",
    summary:
      "0 of 8 before redemption, 2 of 2 after. את appears at the moment of legal covenant redemption.",
    stats: {
      total: 10,
      withAT: 2,
      withoutAT: 8,
      rate: "20%",
      detail: "10 total. First 8: zero with את. Last 2: both with את.",
    },
    verses: [
      { ref: "Ruth 1:4", hasAT: false, context: "Ruth introduced as a Moabitess." },
      {
        ref: "Ruth 1:16",
        hasAT: false,
        context: '"Your God shall be my God" (declaration, not yet redeemed).',
      },
      { ref: "Ruth 2:2", hasAT: false, context: "Ruth gleans in Boaz's field." },
      { ref: "Ruth 2:8", hasAT: false, context: "Boaz speaks to Ruth." },
      { ref: "Ruth 2:21", hasAT: false, context: "Ruth tells Naomi about Boaz." },
      { ref: "Ruth 2:22", hasAT: false, context: "Naomi advises Ruth." },
      { ref: "Ruth 3:9", hasAT: false, context: "Ruth at the threshing floor." },
      { ref: "Ruth 4:5", hasAT: false, context: "Boaz negotiates at the gate." },
      {
        ref: "Ruth 4:10",
        hasAT: true,
        context:
          '"I have acquired את-Ruth the Moabitess as my wife."',
      },
      {
        ref: "Ruth 4:13",
        hasAT: true,
        context: '"Boaz took את-Ruth and she became his wife."',
      },
    ],
    triggerEvent:
      "Ruth is legally redeemed by Boaz as kinsman-redeemer at the gate of Bethlehem (Ruth 4:9-10). At the exact moment of legal covenant redemption, the את appears before her name for the first time.",
    analysis:
      'Ruth was a Moabitess, a descendant of Lot\'s incestuous union (Gen 19:36-37), from a nation cursed from entering the assembly of the LORD (Deut 23:3). She had zero covenantal standing by birth, nationality, or religion. But she made a covenant declaration to Naomi: "Your people shall be my people, and your God, my God" (Ruth 1:16). She demonstrated faith through loyal action. Then she was redeemed by a kinsman-redeemer (a type of Christ) through a legal, public covenant act.',
    principle:
      "The את did not appear at Ruth's declaration of faith (1:16). It did not appear during her faithful works (chapters 2-3). It appeared at the moment of legal covenant redemption. Faith and works prepared the way, but the covenant marker came at the point of redemptive action by the redeemer. This is a picture of salvation.",
  },
  {
    id: "dinah",
    name: "Dinah",
    hebrew: "דינה",
    category: "gained",
    confidence: "High",
    summary:
      "את absent at birth, then appears when the covenant family defends and claims her.",
    stats: {
      total: 7,
      withAT: 4,
      withoutAT: 3,
      rate: "57.1%",
      detail:
        "7 total in Genesis. First 2: zero with את. After she is violated: 4 of 5 with את.",
    },
    verses: [
      { ref: "Gen 30:21", hasAT: false, context: "Dinah born to Leah." },
      { ref: "Gen 34:1", hasAT: false, context: 'Dinah "went out."' },
      {
        ref: "Gen 34:5",
        hasAT: true,
        context: "Jacob heard Shechem had defiled את-Dinah.",
      },
      {
        ref: "Gen 34:13",
        hasAT: true,
        context: "Brothers responded because he defiled את-Dinah.",
      },
      {
        ref: "Gen 34:25",
        hasAT: false,
        context: "Brothers attack city to rescue Dinah.",
      },
      {
        ref: "Gen 34:26",
        hasAT: true,
        context: "They took את-Dinah from Shechem's house.",
      },
      {
        ref: "Gen 46:15",
        hasAT: true,
        context: "את-Dinah listed in Jacob's family going to Egypt.",
      },
    ],
    triggerEvent:
      "After Dinah is violated by Shechem (Gen 34), her brothers act as covenant protectors and avengers. The את appears in the context of her defilement being acknowledged, her rescue, and her inclusion in the covenant family register.",
    analysis:
      "Dinah did not do anything to gain the marker. The את appears when the covenant family recognizes her defilement and acts to rescue and defend her. She is then permanently listed as את-Dinah in the family register going to Egypt (Gen 46:15).",
    principle:
      "The את does not only track individual choices. It also tracks covenant community identity. Dinah was always a daughter of Israel, but the marker appears when the covenant community formally recognizes and acts on her belonging.",
  },
  {
    id: "esther",
    name: "Esther",
    hebrew: "אסתר",
    category: "gained",
    confidence: "Moderate",
    summary:
      "את appears at three pivotal covenant turning points: elevation, commissioning, and favor.",
    stats: {
      total: 42,
      withAT: 3,
      withoutAT: 39,
      rate: "7.1%",
      detail: "42 total. 3 with את (at pivotal moments); 39 without.",
    },
    verses: [
      {
        ref: "Esth 2:17",
        hasAT: true,
        context:
          '"The king loved את-Esther more than all the women" (chosen as queen).',
      },
      {
        ref: "Esth 4:8",
        hasAT: true,
        context: "Mordecai instructs את-Esther to go before the king.",
      },
      {
        ref: "Esth 5:2",
        hasAT: true,
        context: "The king extends the golden scepter to את-Esther.",
      },
      {
        ref: "Esth 5:3 onward",
        hasAT: false,
        context: "All remaining 39 occurrences.",
      },
    ],
    triggerEvent:
      'The three את appearances mark Esther\'s three covenant turning points: elevation to the throne (divine positioning), commissioning for her redemptive mission ("for such a time as this"), and receiving grace before the king (divine favor).',
    analysis:
      "Esther was a hidden Jew in a pagan court. The את marks divine positioning, divine commissioning, and divine favor: the three elements of covenant purpose. She is not just a queen. She is a covenant instrument for the deliverance of God's people.",
    principle:
      "The את tracks with moments of covenant purpose being activated.",
  },

  /* ---- GROUP 3: PERSISTENT ---- */
  {
    id: "jacob",
    name: "Jacob",
    hebrew: "יעקב",
    category: "persistent",
    confidence: "Supporting",
    summary:
      "את consistent from Gen 25:28 through Gen 47:7. Jacob valued the covenant.",
    stats: {
      total: 146,
      withAT: 10,
      withoutAT: 136,
      rate: "6.8%",
      detail:
        "146 total in Genesis. 10 with את (6.8%), consistent from Gen 25:28 through Gen 47:7.",
    },
    verses: [
      { ref: "Gen 25:28", hasAT: true, context: "Loved by Rebekah." },
      { ref: "Gen 27:15", hasAT: true, context: "Rebekah dresses Jacob." },
      { ref: "Gen 28:5-6", hasAT: true, context: "Isaac blesses and sends Jacob." },
      { ref: "Gen 31:25", hasAT: true, context: "Laban overtakes Jacob." },
      { ref: "Gen 46:5", hasAT: true, context: "Sons carry Jacob to Egypt." },
      { ref: "Gen 47:7", hasAT: true, context: "Joseph presents Jacob to Pharaoh." },
    ],
    triggerEvent:
      "No single trigger event. The את spans Jacob's entire narrative arc, from his birth through his final years in Egypt.",
    analysis:
      'Jacob valued the birthright. Despite his flawed methods (deception, manipulation), the text consistently shows that Jacob desired the covenant blessing. He wrestled with God and would not let go until he received the blessing (Gen 32:26). God renamed him Israel: "one who strives with God."\n\nContrast with Esau: same parents, same upbringing, same opportunity. One valued the covenant and kept the marker. One despised it and lost it forever. Jacob\'s את never disappears.',
    principle:
      "The את persists when a person values and clings to the covenant, even through suffering, failure, and imperfection.",
  },
  {
    id: "joseph",
    name: "Joseph",
    hebrew: "יוסף",
    category: "persistent",
    confidence: "Supporting",
    summary:
      'את appears at key covenant moments throughout. "The LORD was with את-Joseph."',
    stats: {
      total: 145,
      withAT: 13,
      withoutAT: 132,
      rate: "9%",
      detail:
        "145 total in Genesis. 13 with את (9%), appearing at key covenant moments throughout.",
    },
    verses: [
      { ref: "Gen 37:3", hasAT: true, context: "Jacob loved את-Joseph (the favored son)." },
      { ref: "Gen 37:23", hasAT: true, context: "Brothers strip את-Joseph." },
      { ref: "Gen 37:28", hasAT: true, context: "Brothers sell את-Joseph." },
      {
        ref: "Gen 39:2",
        hasAT: true,
        context: '"The LORD was with את-Joseph" (covenant presence).',
      },
      {
        ref: "Gen 39:21",
        hasAT: true,
        context: '"The LORD was with את-Joseph" in prison.',
      },
      { ref: "Gen 41:14", hasAT: true, context: "Pharaoh sends for את-Joseph (elevation)." },
      { ref: "Gen 48:15", hasAT: true, context: "Jacob blesses את-Joseph." },
    ],
    triggerEvent:
      'No single trigger. The את appears notably in Gen 39:2 and 39:21, the only two verses that explicitly state God\'s covenant presence with him: "The LORD was with את-Joseph." Both carry the marker.',
    analysis:
      'Joseph maintained faithfulness to God through every trial: sold by his brothers, enslaved, falsely accused, imprisoned. The את appears notably in Gen 39:2 and 39:21, the only two verses that explicitly state God\'s covenant presence with him: "The LORD was with את-Joseph." Both carry the marker.',
    principle:
      "Joseph never abandoned God, and the covenant marker tracked with God's declared presence alongside him.",
  },
  {
    id: "lot",
    name: "Lot",
    hebrew: "לוט",
    category: "persistent",
    confidence: "Supporting",
    summary:
      "את persists through Abraham's covenant intercession, not Lot's own righteousness.",
    stats: {
      total: 23,
      withAT: 7,
      withoutAT: 16,
      rate: "30.4%",
      detail: "23 total in Genesis. 7 with את (30.4%).",
    },
    verses: [
      { ref: "Gen 11:27", hasAT: true, context: "Lot born (genealogy)." },
      { ref: "Gen 11:31", hasAT: true, context: "Terah takes את-Lot from Ur." },
      { ref: "Gen 12:5", hasAT: true, context: "Abram takes את-Lot to Canaan." },
      { ref: "Gen 14:12", hasAT: true, context: "את-Lot captured in the war of kings." },
      { ref: "Gen 14:16", hasAT: true, context: "Abram rescues את-Lot." },
      { ref: "Gen 19:10", hasAT: true, context: "Angels pull את-Lot back inside." },
      {
        ref: "Gen 19:29",
        hasAT: true,
        context:
          '"God remembered Abraham and sent את-Lot out of the overthrow."',
      },
    ],
    triggerEvent:
      "Even at the destruction of Sodom, Lot is rescued with the את marker, explicitly because of Abraham's covenant. Gen 19:29 directly ties Lot's deliverance to God remembering Abraham's covenant.",
    analysis:
      "Even at the destruction of Sodom, Lot is rescued with the את marker, explicitly because of Abraham's covenant. Gen 19:29 directly ties Lot's deliverance to God remembering Abraham's covenant.",
    principle:
      "Lot's את is maintained through Abraham's covenant intercession, not through Lot's own righteousness.",
  },
  {
    id: "abraham",
    name: "Abram / Abraham",
    hebrew: "אברם / אברהם",
    category: "persistent",
    confidence: "Supporting",
    summary:
      "The את follows the covenant through both names, from beginning to end.",
    stats: {
      total: 158,
      withAT: 13,
      withoutAT: 145,
      rate: "8.2%",
      detail:
        "As Abram: 49 occurrences, 6 with את (12.2%). As Abraham: 109 occurrences, 7 with את (6.4%).",
    },
    verses: [
      { ref: "Gen 11:26-27", hasAT: true, context: "Birth and genealogy." },
      { ref: "Gen 11:31", hasAT: true, context: "Called out of Ur." },
      { ref: "Gen 13:5", hasAT: true, context: "Lot with את-Abram." },
      { ref: "Gen 15:18", hasAT: true, context: "The covenant of the pieces." },
      { ref: "Gen 19:29", hasAT: true, context: "God remembered את-Abraham." },
      {
        ref: "Gen 22:1",
        hasAT: true,
        context: "God tested את-Abraham (binding of Isaac).",
      },
      {
        ref: "Gen 24:1",
        hasAT: true,
        context: "The LORD blessed את-Abraham in all things.",
      },
    ],
    triggerEvent:
      "No single trigger. The את follows the covenant through both names. The name change itself (Gen 17:5) is a covenant event. Abraham is the father of the covenant, and the marker spans his entire narrative.",
    analysis:
      "The את follows the covenant through both names. The name change itself (Gen 17:5) is a covenant event. Abraham is the father of the covenant, and the marker spans his entire narrative.",
    principle:
      "The covenant marker follows the covenant from its origin.",
  },
];

const CATEGORY_ORDER: Category[] = ["removed", "gained", "persistent"];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AlephTavStudy() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-10">
        <Link
          href="/"
          className="text-primary hover:text-primary-light transition-colors text-sm"
        >
          &larr; Back to Home
        </Link>
      </nav>

      <nav className="mb-12 p-5 rounded-xl border border-border bg-surface max-w-2xl mx-auto">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-3">Contents</h3>
        <ol className="space-y-1.5 text-sm">
          <li><a href="#what-is-aleph-tav" className="text-primary hover:underline">What Is the Aleph Tav?</a></li>
          <li><a href="#genesis-1-1" className="text-primary hover:underline">Genesis 1:1</a></li>
          <li><a href="#case-studies" className="text-primary hover:underline">Case Studies</a></li>
          <li><a href="#summary" className="text-primary hover:underline">Summary</a></li>
        </ol>
      </nav>

      {/* ============================================================ */}
      {/* LAYER 1: Educational Introduction                             */}
      {/* ============================================================ */}
      <section className="mb-12">
        <div className="text-center mb-10">
          <p
            className="hebrew-text text-7xl sm:text-8xl text-accent mb-2 select-none"
            lang="he"
            dir="rtl"
          >
            את
          </p>
          <p className="text-sm text-muted">Aleph Tav</p>
        </div>

        <h2 id="what-is-aleph-tav" className="text-3xl sm:text-4xl font-bold text-center mb-10">
          What Is the Aleph Tav?
        </h2>

        <div className="space-y-5 text-muted leading-relaxed text-lg max-w-3xl mx-auto">
          <p>
            The Aleph (א) is the first letter of the Hebrew alphabet. The Tav
            (ת) is the last letter. Together,{" "}
            <span className="hebrew-text text-foreground" lang="he" dir="rtl">
              את
            </span>{" "}
            (Aleph Tav) spans the entire alphabet from beginning to end.
          </p>

          <p>
            In Hebrew grammar, the את functions as the definite direct object
            marker (Strong&apos;s H853). It appears before a noun to indicate
            that noun is the direct object of a verb. For example: &ldquo;God
            created{" "}
            <span className="text-accent font-semibold">את</span> the heavens
            and <span className="text-accent font-semibold">את</span> the
            earth&rdquo; (Genesis 1:1). English translations almost universally
            omit it because English grammar does not require a direct object
            marker.
          </p>

          <p>
            The את appears over 7,000 times in the Hebrew Bible. It is the most
            common untranslated word in all of Scripture.
          </p>

          <p>
            In Revelation 22:13, Yeshua (Jesus) declares: &ldquo;I am the Alpha
            and the Omega, the Beginning and the End, the First and the
            Last.&rdquo; Alpha and Omega are the first and last letters of the
            Greek alphabet. But Yeshua was a Hebrew-speaking Jewish man. The
            Hebrew equivalent of this declaration is: &ldquo;I am the Aleph and
            the Tav.&rdquo; Many scholars and Messianic teachers believe this
            connects Yeshua directly to the את that appears throughout the
            Hebrew Bible.
          </p>

          <p>
            If the את carries significance beyond grammar, if it functions as a
            kind of divine signature or covenant marker, then its placement (or
            removal) before personal names throughout Scripture becomes deeply
            meaningful.
          </p>

          <p>
            That is the question this research set out to answer:{" "}
            <em className="text-foreground">
              Does the את appear and disappear before people&apos;s names in
              patterns that correlate with their covenant standing before God?
            </em>
          </p>
        </div>

        {/* Genesis 1:1 highlight */}
        <div id="genesis-1-1" className="mt-10 p-6 rounded-xl border border-border bg-surface max-w-3xl mx-auto">
          <p
            className="hebrew-text text-xl sm:text-2xl leading-loose text-center"
            lang="he"
            dir="rtl"
          >
            בְּרֵאשִׁית בָּרָא אֱלֹהִים{" "}
            <span className="text-accent font-bold px-1.5 py-0.5 rounded bg-accent/10">
              אֵת
            </span>{" "}
            הַשָּׁמַיִם{" "}
            <span className="text-accent font-bold px-1.5 py-0.5 rounded bg-accent/10">
              וְאֵת
            </span>{" "}
            הָאָרֶץ
          </p>
          <p className="text-sm text-muted mt-3 text-center">
            Genesis 1:1 &mdash; &ldquo;In the beginning God created{" "}
            <span className="text-accent font-semibold">את</span> the heavens
            and <span className="text-accent font-semibold">את</span> the
            earth.&rdquo;
          </p>
        </div>
      </section>

      {/* Divider */}
      <hr className="border-border mb-12" />

      {/* ============================================================ */}
      {/* LAYER 2: Research Summary                                     */}
      {/* ============================================================ */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-10">What We Found</h2>

        <div className="space-y-6 max-w-3xl mx-auto">
          {/* Methodology */}
          <div>
            <h3 className="text-xl font-semibold mb-3">The Scan</h3>
            <p className="text-muted leading-relaxed">
              A programmatic scan of the entire Hebrew Bible (all 39 books of
              the Tanakh, 23,213 verses) was conducted using the Westminster
              Leningrad Codex (WLC), the oldest complete manuscript of the
              Hebrew Bible and the standard critical text used by scholars
              worldwide. Over 70 personal names were tracked. Every occurrence
              of each name was checked for whether the את appeared immediately
              before it.
            </p>
          </div>

          {/* Unified finding callout */}
          <div className="p-6 rounded-xl border-2 border-accent/40 bg-accent/5">
            <h3 className="text-xl font-semibold mb-3 text-accent">
              The Finding
            </h3>
            <p className="text-foreground leading-relaxed text-lg">
              Across every confirmed case, the את transition correlates with one
              thing:{" "}
              <strong>
                how the person related to God&apos;s covenant.
              </strong>
            </p>
            <ul className="mt-4 space-y-2 text-muted">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1 shrink-0">&#x25BC;</span>
                <span>
                  When a person despised, rejected, or turned away from the
                  covenant (or the God of the covenant), the את was{" "}
                  <strong className="text-red-500">removed</strong> from before
                  their name.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1 shrink-0">
                  &#x25B2;
                </span>
                <span>
                  When a person entered into, was redeemed into, or was defended
                  under the covenant, the את{" "}
                  <strong className="text-emerald-500">appeared</strong> before
                  their name.
                </span>
              </li>
            </ul>
          </div>

          {/* Clarification */}
          <p className="text-muted leading-relaxed">
            This pattern is not about moral perfection. Jacob was a deceiver.
            David was an adulterer. The את does not track sinlessness. It tracks
            covenant relationship and standing before God.
          </p>

          {/* Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-red-400/30 bg-red-500/5">
              <h4 className="font-semibold text-red-500 mb-2">
                Acts That REMOVE the את
              </h4>
              <ol className="text-sm text-muted space-y-1 list-decimal list-inside">
                <li>
                  Despising the covenant, treating it as worthless.
                </li>
                <li>
                  Disobeying the covenant God through rebellion, murder, or
                  false worship.
                </li>
                <li>Separation from the covenant community.</li>
              </ol>
            </div>
            <div className="p-4 rounded-lg border border-emerald-400/30 bg-emerald-500/5">
              <h4 className="font-semibold text-emerald-500 mb-2">
                Acts That ADD the את
              </h4>
              <ol className="text-sm text-muted space-y-1 list-decimal list-inside">
                <li>
                  Entering the covenant by faith and redemption.
                </li>
                <li>
                  Being defended and claimed by the covenant community.
                </li>
                <li>
                  Being positioned for covenant purpose by divine providence.
                </li>
              </ol>
            </div>
          </div>
          <p className="text-sm text-muted text-center">
            The את <strong className="text-blue-500">persists</strong> when a
            person values and clings to the covenant, even through suffering,
            failure, and imperfection.
          </p>

          {/* Caveat */}
          <div className="p-4 rounded-lg border border-border bg-surface text-sm text-muted leading-relaxed">
            <h4 className="font-semibold text-foreground mb-2">A Note on Grammar</h4>
            <p>
              The את is grammatically the definite direct object marker. Its
              presence or absence is partly determined by whether a name
              functions as the direct object of a verb in a given clause. Not
              every occurrence of a name is grammatically eligible for the את.
              That said, the patterns documented show statistically and
              narratively significant shifts that align with covenant events in
              ways that are difficult to explain as purely grammatical
              coincidence, particularly in the cases of Esau (2 of 118 with את,
              both before his rejection, zero after), Ruth (0 of 8 before
              redemption, 2 of 2 after), Cain (1 at birth, 0 for 15 remaining),
              and Solomon (8 before idolatry, 0 for 22 after).
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <hr className="border-border mb-12" />

      {/* ============================================================ */}
      {/* LAYER 3: Interactive Name Explorer                            */}
      {/* ============================================================ */}
      <section className="mb-10">
        <h2 id="case-studies" className="text-3xl font-bold text-center mb-3">
          Explore the Names
        </h2>
        <p className="text-muted text-center mb-12">
          Click any name to see the full analysis.
        </p>

        {CATEGORY_ORDER.map((cat) => {
          const meta = CATEGORY_META[cat];
          const names = NAMES.filter((n) => n.category === cat);
          return (
            <div key={cat} className="mb-14">
              <h3 className={`text-xl font-semibold mb-5 ${meta.titleClass}`}>
                {meta.title}:{" "}
                <span className="font-normal opacity-80">{meta.subtitle}</span>
              </h3>
              <div className="space-y-3">
                {names.map((entry) => {
                  const isOpen = expanded.has(entry.id);
                  return (
                    <div
                      key={entry.id}
                      className={`rounded-xl border ${meta.cardBorder} overflow-hidden transition-shadow ${isOpen ? "shadow-lg" : ""}`}
                    >
                      {/* Card header (always visible) */}
                      <button
                        onClick={() => toggle(entry.id)}
                        className={`w-full text-left px-5 py-4 flex items-center gap-4 border-l-4 ${meta.accentBorder} ${meta.hoverClass} transition-colors cursor-pointer`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                            <span className="font-semibold text-lg text-foreground">
                              {entry.name}
                            </span>
                            <span
                              className="hebrew-text text-lg"
                              lang="he"
                              dir="rtl"
                            >
                              {entry.hebrew}
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${meta.badgeClass}`}
                            >
                              {entry.confidence}
                            </span>
                          </div>
                          <p className="text-sm text-muted line-clamp-1">
                            {entry.summary}
                          </p>
                        </div>
                        <svg
                          className={`w-5 h-5 text-muted shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* Expandable detail panel */}
                      <div
                        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                        style={{
                          gridTemplateRows: isOpen ? "1fr" : "0fr",
                        }}
                      >
                        <div className="overflow-hidden">
                          <div
                            className={`px-5 py-6 border-t ${meta.cardBorder} border-l-4 ${meta.accentBorder} space-y-6`}
                          >
                            {/* Stats bar */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              <div className="p-3 rounded-lg bg-surface-hover text-center">
                                <p className="text-2xl font-bold">
                                  {entry.stats.total}
                                </p>
                                <p className="text-xs text-muted">Total</p>
                              </div>
                              <div className="p-3 rounded-lg bg-surface-hover text-center">
                                <p className="text-2xl font-bold text-accent">
                                  {entry.stats.withAT}
                                </p>
                                <p className="text-xs text-muted">
                                  With את
                                </p>
                              </div>
                              <div className="p-3 rounded-lg bg-surface-hover text-center">
                                <p className="text-2xl font-bold">
                                  {entry.stats.withoutAT}
                                </p>
                                <p className="text-xs text-muted">Without</p>
                              </div>
                              <div className="p-3 rounded-lg bg-surface-hover text-center">
                                <p className="text-2xl font-bold">
                                  {entry.stats.rate}
                                </p>
                                <p className="text-xs text-muted">Rate</p>
                              </div>
                            </div>

                            {/* Period table (Saul) */}
                            {entry.periodTable && (
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b border-border">
                                      <th className="text-left py-2 pr-4 font-semibold">
                                        Period
                                      </th>
                                      <th className="text-center py-2 px-3 font-semibold">
                                        With את
                                      </th>
                                      <th className="text-center py-2 px-3 font-semibold">
                                        Total
                                      </th>
                                      <th className="text-center py-2 pl-3 font-semibold">
                                        Rate
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {entry.periodTable.map((row, i) => (
                                      <tr
                                        key={i}
                                        className="border-b border-border/50"
                                      >
                                        <td className="py-2 pr-4 text-muted">
                                          {row.period}
                                        </td>
                                        <td className="py-2 px-3 text-center font-semibold text-accent">
                                          {row.withAT}
                                        </td>
                                        <td className="py-2 px-3 text-center">
                                          {row.total}
                                        </td>
                                        <td className="py-2 pl-3 text-center">
                                          {row.rate}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}

                            {/* Special note (Saul) */}
                            {entry.specialNote && (
                              <p className="text-sm text-muted italic leading-relaxed">
                                {entry.specialNote}
                              </p>
                            )}

                            {/* Verse table */}
                            {entry.verses.length > 0 && (
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b border-border">
                                      <th className="text-left py-2 pr-4 font-semibold">
                                        Verse
                                      </th>
                                      <th className="text-center py-2 px-3 font-semibold">
                                        את
                                      </th>
                                      <th className="text-left py-2 pl-3 font-semibold">
                                        Context
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {entry.verses.map((v, i) => (
                                      <tr
                                        key={i}
                                        className="border-b border-border/50"
                                      >
                                        <td className="py-2 pr-4 font-mono text-xs whitespace-nowrap">
                                          {v.ref}
                                        </td>
                                        <td className="py-2 px-3 text-center">
                                          {v.hasAT ? (
                                            <span className="text-accent font-bold text-lg">
                                              &#x2713;
                                            </span>
                                          ) : (
                                            <span className="text-muted">
                                              &#x2717;
                                            </span>
                                          )}
                                        </td>
                                        <td className="py-2 pl-3 text-muted">
                                          {v.context}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}

                            {/* Trigger Event */}
                            <div>
                              <h4 className="font-semibold text-sm uppercase tracking-wide text-foreground mb-2">
                                Trigger Event
                              </h4>
                              <p className="text-muted leading-relaxed">
                                {entry.triggerEvent}
                              </p>
                            </div>

                            {/* Spiritual Analysis */}
                            <div>
                              <h4 className="font-semibold text-sm uppercase tracking-wide text-foreground mb-2">
                                Analysis
                              </h4>
                              {entry.analysis.split("\n\n").map((para, i) => (
                                <p
                                  key={i}
                                  className="text-muted leading-relaxed mb-2 last:mb-0"
                                >
                                  {para}
                                </p>
                              ))}
                            </div>

                            {/* Principle (callout) */}
                            <blockquote
                              className={`border-l-4 ${meta.accentBorder} pl-4 py-3 rounded-r-lg bg-surface-hover`}
                            >
                              <p className="text-foreground font-medium italic leading-relaxed">
                                {entry.principle}
                              </p>
                            </blockquote>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* ============================================================ */}
      {/* Closing Statement                                             */}
      {/* ============================================================ */}
      <section id="summary" className="pt-12 border-t border-border">
        <blockquote className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-lg text-muted italic leading-relaxed">
            &ldquo;This is the gospel in the grammar. Ruth had nothing to
            commend her: a foreign widow from a cursed nation. But through the
            action of a kinsman-redeemer, she was brought in. The marker
            appeared not because of her merit, but because of redemption. As
            Paul writes: &lsquo;For He chose us in Him before the foundation of
            the world&rsquo; (Ephesians 1:4). And as John records
            Yeshua&apos;s words: &lsquo;I am the Aleph and the Tav, the
            Beginning and the End&rsquo; (Revelation 22:13). The One who is the{" "}
            <span className="hebrew-text not-italic" lang="he" dir="rtl">
              את
            </span>{" "}
            is the One who places the{" "}
            <span className="hebrew-text not-italic" lang="he" dir="rtl">
              את
            </span>{" "}
            before the names of those who are His.&rdquo;
          </p>
        </blockquote>

        <p className="text-center text-muted italic">
          &ldquo;The secret things belong to the LORD our God, but the things
          revealed belong to us and to our children forever.&rdquo;
        </p>
        <p className="text-center text-sm text-muted mt-1">
          Deuteronomy 29:29
        </p>
      </section>

      <ContinueExploring links={[
        { title: "Torah Decoder", description: "Click any Hebrew word to see its Paleo-Hebrew breakdown.", href: "/torah/genesis/1" },
        { title: "Research Hub", description: "Explore more original research on Hebrew Scripture patterns.", href: "/research" },
      ]} />
    </div>
  );
}
