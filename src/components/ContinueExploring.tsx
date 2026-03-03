import Link from "next/link";

interface ExploreLink {
  title: string;
  description: string;
  href: string;
}

interface ContinueExploringProps {
  links: ExploreLink[];
}

export default function ContinueExploring({ links }: ContinueExploringProps) {
  return (
    <section className="mt-16 pt-10 border-t border-border">
      <h2 className="text-lg font-semibold text-center mb-6">
        Continue Exploring
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="p-5 rounded-xl border border-border bg-surface hover:shadow-md hover:-translate-y-0.5 transition-all group"
          >
            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
              {link.title}
            </h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              {link.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
