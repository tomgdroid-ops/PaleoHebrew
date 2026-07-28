import Image from "next/image";
import { plate, type PlateKey } from "@/lib/plates";

/**
 * A cinematic frame: light field, optional photographic plate, shared grade,
 * grain. The grade sits above the plate so a photograph and a pure gradient
 * are graded identically and the page keeps one visual language either way.
 */
export default function Frame({
  light,
  grade = "grade-dark",
  plateKey,
  priority = false,
  children,
}: {
  /** Light-field class, e.g. "lf-void". */
  light: string;
  grade?: "grade-dark" | "grade-warm";
  plateKey?: PlateKey;
  priority?: boolean;
  children?: React.ReactNode;
}) {
  const photo = plateKey ? plate(plateKey) : null;

  return (
    <div className="frame grain" aria-hidden="true">
      {/* Geometry belongs to the light field: ridges, shafts, the pools they
          make. A photographic plate covers it; the grade covers both. */}
      <div className={`frame__light ${light}`}>{children}</div>
      {photo && (
        <Image
          className="frame__plate"
          src={photo.file}
          alt=""
          fill
          sizes="100vw"
          priority={priority}
        />
      )}
      <div className={`frame__grade ${grade}`} />
    </div>
  );
}
