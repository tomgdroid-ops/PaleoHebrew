import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContinueExploring from "@/components/ContinueExploring";

export const metadata: Metadata = {
  title: "Getting Started",
  description:
    "Learn how ancient Hebrew letters were originally pictures, and how The Aleph Tav Project reveals the pictographic meaning hidden in every word of Scripture.",
};

export default function GuidePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Getting Started" }]} />

      {/* Hero */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-3">Getting Started</h2>
        <p className="text-lg text-muted max-w-2xl mx-auto">
          The Aleph Tav Project offers several tools and studies for exploring
          the Hebrew Scriptures. Here is how to get started with the Torah
          Decoder, the interactive word analysis tool at the heart of the
          project.
        </p>
      </div>

      {/* Section 1: The Big Idea */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary">
          What Are Paleo-Hebrew Pictographs?
        </h3>
        <p className="leading-relaxed mb-4">
          Long before Hebrew looked like the script we see in Bibles today, each
          letter was a simple picture. The letter <strong>Aleph</strong> was drawn
          as an <strong>ox head</strong>, representing strength, power, and
          leadership. <strong>Bet</strong> was a <strong>house floor plan</strong>,
          representing family, dwelling, and what is inside.
          <strong> Dalet</strong> was a <strong>door</strong>. <strong>Mem</strong>
          was <strong>water</strong>. Every one of the 22 Hebrew letters started as
          a recognizable picture from everyday life in the ancient world.
        </p>
        <p className="leading-relaxed mb-4">
          Over thousands of years, these pictures gradually became more abstract,
          evolving through Phoenician script into the square Hebrew letters used
          today. But the original pictographic meanings never fully disappeared;
          they are woven into the very fabric of the Hebrew language.
        </p>
        <p className="leading-relaxed">
          When you read a Hebrew word and understand the pictures behind each
          letter, a deeper layer of meaning emerges, one that the original
          authors and readers of Scripture would have recognized.
        </p>
      </section>

      {/* Section 2: A Real Example */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary">
          A Word You Already Know
        </h3>
        <div className="p-6 rounded-xl border border-border bg-surface mb-4">
          <div className="text-center mb-4">
            <span className="hebrew-text text-3xl font-semibold" lang="he" dir="rtl">
              אָב
            </span>
            <p className="text-sm text-muted mt-1">
              &ldquo;Ab&rdquo;: Father
            </p>
          </div>
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">Aleph</p>
              <p className="text-sm text-muted">Ox Head</p>
              <p className="text-sm font-medium mt-1">Strength, Leader</p>
            </div>
            <div className="text-center text-2xl text-muted self-center">+</div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">Bet</p>
              <p className="text-sm text-muted">House</p>
              <p className="text-sm font-medium mt-1">Family, Dwelling</p>
            </div>
          </div>
          <p className="text-center mt-4 text-lg italic text-foreground">
            &ldquo;The strength of the house&rdquo;
          </p>
        </div>
        <p className="leading-relaxed">
          The Hebrew word for <strong>Father</strong> is made of just two letters:
          Aleph (strength/leader) and Bet (house/family). Read pictographically,
          a father is <em>&ldquo;the strength of the house&rdquo;</em>, the
          one who leads, protects, and provides for the family. This isn&apos;t
          just a coincidence. It reveals how the ancient Hebrews understood the
          role of a father, encoded right into the word itself.
        </p>
      </section>

      {/* Section 3: Why This Matters */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary">
          Why This Matters for Bible Study
        </h3>
        <p className="leading-relaxed mb-4">
          The Torah was written in Hebrew for a reason. The language itself carries
          meaning beyond the surface-level definitions we find in dictionaries.
          When you look at the pictographic roots of Hebrew words, you discover
          layers of meaning that enrich your understanding of Scripture:
        </p>
        <ul className="space-y-3 mb-4">
          <li className="flex gap-3">
            <span className="text-accent font-bold text-lg">1.</span>
            <span className="leading-relaxed">
              <strong>See the pictures God used.</strong> Hebrew is the language
              God chose to reveal His Word. The pictures embedded in each letter
              are part of that revelation.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent font-bold text-lg">2.</span>
            <span className="leading-relaxed">
              <strong>Find connections you&apos;d otherwise miss.</strong> Words
              that seem unrelated in English often share pictographic roots in
              Hebrew, revealing deep thematic connections across Scripture.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent font-bold text-lg">3.</span>
            <span className="leading-relaxed">
              <strong>Go deeper than translation allows.</strong> Every translation
              loses something. By looking at the Hebrew letters directly, you get
              closer to the original intent of the text.
            </span>
          </li>
        </ul>
        <p className="leading-relaxed text-sm text-muted italic">
          Note: Pictographic analysis is one lens among many for studying
          Scripture. It enriches and complements, but does not replace,
          standard Hebrew scholarship and traditional commentary.
        </p>
      </section>

      {/* Section 4: How to Use the Site */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary">
          How to Use This Tool
        </h3>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h4 className="font-semibold mb-1">Pick a Chapter</h4>
              <p className="text-muted leading-relaxed">
                Use the book tabs (Genesis, Exodus, Leviticus, Numbers,
                Deuteronomy) and chapter selector at the top of the page to
                navigate to any chapter in the Torah.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h4 className="font-semibold mb-1">Read the Interlinear Text</h4>
              <p className="text-muted leading-relaxed">
                Each word is displayed with four layers from top to bottom:
              </p>
              <ul className="text-muted text-sm mt-2 space-y-1">
                <li><strong>Paleo-Hebrew:</strong> The ancient pictographic letter forms</li>
                <li><strong>Modern Hebrew:</strong> The pointed Hebrew text</li>
                <li><strong>Transliteration:</strong> How to pronounce the word in English letters</li>
                <li><strong>English:</strong> A short KJV-aligned translation</li>
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h4 className="font-semibold mb-1">Click Any Word</h4>
              <p className="text-muted leading-relaxed">
                When you click a Hebrew word, the <strong>Decode Panel</strong>
                opens on the right side of the screen. This is where the
                pictographic analysis happens.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h4 className="font-semibold mb-1">Explore the Pictographic Readings</h4>
              <p className="text-muted leading-relaxed mb-2">
                The Decode Panel shows you:
              </p>
              <ul className="text-muted text-sm space-y-2">
                <li>
                  <strong>Interpretive Sentences:</strong> Multiple ways to
                  read the word based on its pictographic letter meanings. Each
                  sentence combines the picture-meanings of the letters into a
                  natural English phrase. Sentences marked
                  <span className="inline-block ml-1 px-2 py-0.5 text-xs font-semibold rounded border border-primary/30 text-primary">CURATED</span>
                  have been hand-crafted by researchers for accuracy.
                </li>
                <li>
                  <strong>Score:</strong> The green number (0&ndash;100)
                  indicates how well the sentence aligns with the word&apos;s
                  known scholarly meaning. Higher scores mean stronger alignment.
                </li>
                <li>
                  <strong>Letter Breakdown:</strong> Each letter in the
                  word is shown with its Paleo-Hebrew pictograph, its name
                  (Aleph, Bet, etc.), what the picture represents, and all of its
                  associated meanings.
                </li>
              </ul>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              5
            </div>
            <div>
              <h4 className="font-semibold mb-1">Keep Clicking</h4>
              <p className="text-muted leading-relaxed">
                The panel stays open as you click different words, so you
                don&apos;t have to scroll back up. Click word after word to build
                a deeper picture of each verse. Try reading an entire verse
                through its pictographic meanings and see what story emerges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: The 22 Letters at a Glance */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary">
          The 22 Hebrew Letters: At a Glance
        </h3>
        <p className="text-muted leading-relaxed mb-4">
          Here are all 22 letters with their ancient picture and core meaning.
          When you click a word on the site, these are the building blocks the
          decoder uses to construct its interpretive readings.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { letter: "א", name: "Aleph", picture: "Ox Head", meaning: "Strength, Leader, God" },
            { letter: "ב", name: "Bet", picture: "House", meaning: "Family, Inside" },
            { letter: "ג", name: "Gimel", picture: "Foot/Camel", meaning: "To Walk, To Carry" },
            { letter: "ד", name: "Dalet", picture: "Door", meaning: "Entrance, Pathway" },
            { letter: "ה", name: "Hey", picture: "Man with Arms Raised", meaning: "Behold, Reveal" },
            { letter: "ו", name: "Vav", picture: "Tent Peg/Hook", meaning: "To Secure, To Connect" },
            { letter: "ז", name: "Zayin", picture: "Weapon/Plow", meaning: "To Cut, To Nourish" },
            { letter: "ח", name: "Chet", picture: "Fence/Wall", meaning: "To Protect, Separate" },
            { letter: "ט", name: "Tet", picture: "Snake/Basket", meaning: "To Surround, Contain" },
            { letter: "י", name: "Yod", picture: "Hand and Arm", meaning: "Work, Deed, To Make" },
            { letter: "כ", name: "Kaf", picture: "Open Palm", meaning: "To Cover, To Allow" },
            { letter: "ל", name: "Lamed", picture: "Shepherd's Staff", meaning: "To Teach, Authority" },
            { letter: "מ", name: "Mem", picture: "Water/Waves", meaning: "Mighty, Chaos, Blood" },
            { letter: "נ", name: "Nun", picture: "Sprouting Seed", meaning: "Life, Heir, Continue" },
            { letter: "ס", name: "Samekh", picture: "Thorn/Support", meaning: "To Support, Protect" },
            { letter: "ע", name: "Ayin", picture: "Eye", meaning: "To See, To Know" },
            { letter: "פ", name: "Pey", picture: "Mouth", meaning: "To Speak, Word" },
            { letter: "צ", name: "Tsade", picture: "Man on Side", meaning: "Righteous, To Hunt" },
            { letter: "ק", name: "Qof", picture: "Back of Head", meaning: "Behind, To Follow" },
            { letter: "ר", name: "Resh", picture: "Head of Man", meaning: "Person, Head, Top" },
            { letter: "ש", name: "Shin", picture: "Two Front Teeth", meaning: "To Consume, Destroy" },
            { letter: "ת", name: "Tav", picture: "Cross/Mark/Sign", meaning: "Sign, Covenant, Mark" },
          ].map((l) => (
            <div
              key={l.letter}
              className="p-3 rounded-lg border border-border bg-surface text-center"
            >
              <span className="hebrew-text text-xl" lang="he">{l.letter}</span>
              <p className="text-sm font-semibold text-primary">{l.name}</p>
              <p className="text-xs text-muted">{l.picture}</p>
              <p className="text-xs mt-1">{l.meaning}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center pt-8 border-t border-border">
        <p className="text-muted mb-4">
          Ready to see the pictures hidden in Scripture?
        </p>
        <Link
          href="/torah/genesis/1"
          className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors text-lg"
        >
          Start with Genesis 1:1
        </Link>
      </div>

      <ContinueExploring
        links={[
          { title: "Torah Decoder", description: "Start exploring the Torah with our interactive Paleo-Hebrew decoder.", href: "/torah/genesis/1" },
          { title: "The Ancient Alphabet", description: "Learn all 22 Hebrew letters and their pictographic origins.", href: "/alphabet" },
        ]}
      />
    </div>
  );
}
