import { cn } from "@/lib/utils";

/** Deterministic PRNG so server and client markup match. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(7);
const STARS = Array.from({ length: 70 }, () => ({
  top: rand() * 100,
  left: rand() * 100,
  size: rand() < 0.85 ? 1 : 2,
  delay: rand() * 6,
  duration: 3 + rand() * 4,
}));

/** Faint night sky shown only in dark mode. Pure CSS, no client JS. */
export function Starfield({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 hidden overflow-hidden dark:block", className)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.3_0.05_250/0.45),transparent_65%)]" />
      {STARS.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
      <span className="shooting-star" style={{ top: "12%", left: "70%", animationDelay: "2s" }} />
      <span className="shooting-star" style={{ top: "30%", left: "35%", animationDelay: "9s" }} />
    </div>
  );
}
