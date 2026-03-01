import Image from "next/image";

const BOOK_HEROES: Record<string, { src: string; alt: string }> = {
  genesis: {
    src: "/images/heroes/genesis-hero.png",
    alt: "Divine light breaking through primordial darkness over formless waters — Genesis creation scene",
  },
  exodus: {
    src: "/images/heroes/exodus-hero.png",
    alt: "Moses parting the Red Sea with Israelites crossing on dry ground — Exodus scene",
  },
  leviticus: {
    src: "/images/heroes/leviticus-hero.png",
    alt: "High Priest before the golden altar of incense inside the Tabernacle — Leviticus scene",
  },
  numbers: {
    src: "/images/heroes/numbers-hero.png",
    alt: "Israelite camp in the wilderness with pillar of fire rising into the night sky — Numbers scene",
  },
  deuteronomy: {
    src: "/images/heroes/deuteronomy-hero.png",
    alt: "Moses on Mount Nebo gazing over the Promised Land at sunset — Deuteronomy scene",
  },
};

interface BookHeroProps {
  bookSlug: string;
  variant?: "chapter" | "card";
}

export default function BookHero({ bookSlug, variant = "chapter" }: BookHeroProps) {
  const hero = BOOK_HEROES[bookSlug];
  if (!hero) return null;

  if (variant === "card") {
    return (
      <Image
        src={hero.src}
        alt={hero.alt}
        width={400}
        height={140}
        className="w-full h-[140px] object-cover object-center"
        priority={false}
      />
    );
  }

  return (
    <div className="chapter-hero-banner">
      <Image
        src={hero.src}
        alt={hero.alt}
        width={1400}
        height={600}
        className="w-full h-full object-cover object-center"
        priority
      />
    </div>
  );
}
