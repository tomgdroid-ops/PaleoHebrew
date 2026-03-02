import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <span className="paleo-glyph text-accent text-4xl">𐤀𐤕</span>
      <h2 className="text-3xl font-bold mt-4 mb-3">Page Not Found</h2>
      <p className="text-muted mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
