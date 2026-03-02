interface ProphecySectionProps {
  type: "prophecy" | "fulfillment" | "evidence";
  children: React.ReactNode;
}

const SECTION_CONFIG = {
  prophecy: {
    color: "#D4A843",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    label: "The Prophecy",
  },
  fulfillment: {
    color: "#2E5D8A",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    label: "The Fulfillment",
  },
  evidence: {
    color: "#4A7C59",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
    label: "The Evidence",
  },
};

export default function ProphecySection({ type, children }: ProphecySectionProps) {
  const config = SECTION_CONFIG[type];

  return (
    <div
      className="prophecy-detail-section"
      style={{ "--section-color": config.color } as React.CSSProperties}
    >
      <div className="prophecy-detail-section-header">
        <span className="prophecy-detail-section-icon" style={{ color: config.color }}>
          {config.icon}
        </span>
        <h2 className="prophecy-detail-section-label" style={{ color: config.color }}>
          {config.label}
        </h2>
      </div>
      <div className="prophecy-detail-section-body">{children}</div>
    </div>
  );
}
