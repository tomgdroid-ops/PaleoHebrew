import Image from "next/image";

export default function ProphecyHero() {
  return (
    <section className="prophecy-hero">
      {/* Hero image */}
      <div className="prophecy-hero-bg">
        <Image
          src="/images/prophecies/prophecies-hero.png"
          alt="Ancient scroll unfurling with golden light"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Dark overlay */}
      <div className="prophecy-hero-overlay" />

      {/* Content */}
      <div className="prophecy-hero-content">
        <span className="prophecy-hero-label">Section Six</span>
        <h1 className="prophecy-hero-title">Messianic Prophecies</h1>
        <p className="prophecy-hero-subtitle">
          Prophecy &middot; Fulfillment &middot; Evidence
        </p>
        <p className="prophecy-hero-body">
          The Hebrew prophets spoke of a coming Messiah centuries before His
          arrival. These 37 prophecies &mdash; preserved in the Dead Sea Scrolls,
          the Great Codices, and the oldest rabbinic writings &mdash; foretold His
          lineage, birth, ministry, suffering, death, and resurrection. Examine
          each prophecy alongside its New Testament fulfillment and the historical
          evidence that anchors both.
        </p>
      </div>
    </section>
  );
}
