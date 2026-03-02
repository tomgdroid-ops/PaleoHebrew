import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { prophecies, CATEGORY_META } from "@/data/prophecies";
import ProphecySection from "@/components/prophecies/ProphecySection";
import ProphecyNav from "@/components/prophecies/ProphecyNav";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return prophecies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const prophecy = prophecies.find((p) => p.slug === slug);
  if (!prophecy) return { title: "Prophecy Not Found" };

  return {
    title: `${prophecy.title} - Messianic Prophecies`,
    description: prophecy.summary,
    openGraph: {
      title: `${prophecy.title} | Messianic Prophecies`,
      description: prophecy.summary,
    },
  };
}

export default async function ProphecyDetailPage({ params }: Props) {
  const { slug } = await params;
  const index = prophecies.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const prophecy = prophecies[index];
  const prev = index > 0 ? prophecies[index - 1] : null;
  const next = index < prophecies.length - 1 ? prophecies[index + 1] : null;
  const meta = CATEGORY_META[prophecy.category];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link
          href="/prophecies"
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          &larr; Messianic Prophecies
        </Link>
      </div>

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span
            className="prophecy-detail-badge"
            style={{ borderColor: meta.color, color: meta.color }}
          >
            #{prophecy.id}
          </span>
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: meta.color }}
          >
            {prophecy.categoryLabel}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          {prophecy.title}
        </h1>
        <p className="text-muted text-lg">{prophecy.summary}</p>
      </header>

      {/* Section A: The Prophecy */}
      <ProphecySection type="prophecy">
        <p className="font-semibold text-foreground text-lg mb-1">
          {prophecy.otReference}
        </p>
        <p className="text-sm text-muted mb-4">{prophecy.dateWritten}</p>

        <blockquote className="prophecy-blockquote prophecy-blockquote-gold">
          {prophecy.otText}
        </blockquote>

        <div className="mt-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-1">
              Manuscript Attestation
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {prophecy.manuscriptAttestation}
            </p>
          </div>

          {prophecy.ancientJewishInterpretation && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-1">
                Ancient Jewish Interpretation
              </h3>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {prophecy.ancientJewishInterpretation}
              </p>
            </div>
          )}
        </div>
      </ProphecySection>

      {/* Section B: The Fulfillment */}
      <ProphecySection type="fulfillment">
        <p className="font-semibold text-foreground text-lg mb-4">
          {prophecy.ntReference}
        </p>

        <blockquote className="prophecy-blockquote prophecy-blockquote-blue">
          {prophecy.ntText}
        </blockquote>

        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-1">
            Narrative Context
          </h3>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {prophecy.narrativeContext}
          </p>
        </div>
      </ProphecySection>

      {/* Section C: The Evidence */}
      <ProphecySection type="evidence">
        <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
          {prophecy.historicalEvidence}
        </p>
      </ProphecySection>

      {/* Navigation */}
      <ProphecyNav prev={prev} next={next} />
    </div>
  );
}
