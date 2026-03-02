import Link from "next/link";
import Image from "next/image";
import { type Prophecy, CATEGORY_META } from "@/data/prophecies";

export default function ProphecyCard({ prophecy }: { prophecy: Prophecy }) {
  const meta = CATEGORY_META[prophecy.category];

  return (
    <Link
      href={`/prophecies/${prophecy.slug}`}
      className="prophecy-card group"
      style={{ "--cat-color": meta.color } as React.CSSProperties}
    >
      {/* Category background image */}
      <div className="prophecy-card-bg">
        <Image
          src={`/images/prophecies/${meta.bg}`}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      {/* Dark overlay */}
      <div className="prophecy-card-overlay" />

      {/* Content */}
      <div className="prophecy-card-content">
        {/* Number badge */}
        <span className="prophecy-card-number" style={{ borderColor: meta.color }}>
          {prophecy.id}
        </span>

        {/* Category label */}
        <span
          className="prophecy-card-category"
          style={{ color: meta.color }}
        >
          {prophecy.categoryLabel}
        </span>

        {/* Title */}
        <h3 className="prophecy-card-title">{prophecy.title}</h3>

        {/* OT Reference */}
        <p className="prophecy-card-ref">{prophecy.otReference}</p>

        {/* Summary */}
        <p className="prophecy-card-summary">{prophecy.summary}</p>
      </div>

      {/* Category accent border */}
      <div
        className="prophecy-card-accent"
        style={{ backgroundColor: meta.color }}
      />
    </Link>
  );
}
