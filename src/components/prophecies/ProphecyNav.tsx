import Link from "next/link";
import { type Prophecy } from "@/data/prophecies";

export default function ProphecyNav({
  prev,
  next,
}: {
  prev: Prophecy | null;
  next: Prophecy | null;
}) {
  return (
    <div className="prophecy-nav">
      <div className="prophecy-nav-inner">
        {prev ? (
          <Link href={`/prophecies/${prev.slug}`} className="prophecy-nav-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <div>
              <span className="prophecy-nav-label">Previous Prophecy</span>
              <span className="prophecy-nav-title">{prev.title}</span>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            href={`/prophecies/${next.slug}`}
            className="prophecy-nav-link prophecy-nav-link-next"
          >
            <div>
              <span className="prophecy-nav-label">Next Prophecy</span>
              <span className="prophecy-nav-title">{next.title}</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        ) : (
          <div />
        )}
      </div>

      <div className="text-center mt-6">
        <Link
          href="/prophecies"
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          &larr; Back to All Prophecies
        </Link>
      </div>
    </div>
  );
}
