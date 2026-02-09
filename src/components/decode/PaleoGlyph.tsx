"use client";

interface PaleoGlyphProps {
  paleoChar: string;
  letterName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-6xl",
};

export default function PaleoGlyph({
  paleoChar,
  letterName,
  size = "md",
  className = "",
}: PaleoGlyphProps) {
  return (
    <span
      className={`paleo-glyph ${SIZE_CLASSES[size]} text-primary inline-block ${className}`}
      aria-label={`Paleo-Hebrew letter ${letterName}`}
      title={letterName}
      role="img"
    >
      {paleoChar}
    </span>
  );
}
