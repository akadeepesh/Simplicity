import { ImageResponse } from "next/og";
import { getWritingBySlug } from "@/lib/queries/writings";
import { getFormLabel, TYPE_MAP } from "@/lib/writing-types";
import { loadGoogleFont, OG_COLORS, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "A writing on Simplicity";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = await getWritingBySlug(slug, null);

  const kicker = w ? (getFormLabel(w.type, w.form) ?? TYPE_MAP[w.type].label).toUpperCase() : "SIMPLICITY";
  const title = w?.title ?? "";
  const isVerse = w ? TYPE_MAP[w.type].layout !== "prose" : true;
  const lines = (w?.excerpt ?? "Where words bloom.").split("\n").slice(0, isVerse ? 7 : 4);
  const body = isVerse ? lines.join("\n") : lines.join(" ").slice(0, 260);
  const author = w ? `— ${w.author.name}` : "";

  const text = `${kicker}${title}${body}${author}Simplicity“”`;
  const [display, serif] = await Promise.all([
    loadGoogleFont("Fraunces", text, 500),
    loadGoogleFont("Newsreader", text, 400),
  ]);
  const fonts = [
    display && { name: "Display", data: display, weight: 500 as const, style: "normal" as const },
    serif && { name: "Serif", data: serif, weight: 400 as const, style: "normal" as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 400 | 500; style: "normal" }[];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          background: `radial-gradient(ellipse at top, #1f2a3d 0%, ${OG_COLORS.bg} 70%)`,
          color: OG_COLORS.ink,
          fontFamily: "Serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: OG_COLORS.brand }}>{kicker}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {title ? (
            <div style={{ fontFamily: "Display", fontSize: title.length > 40 ? 56 : 72, lineHeight: 1.1 }}>
              {title}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              whiteSpace: "pre-wrap",
              fontSize: isVerse ? (title ? 32 : 40) : 30,
              lineHeight: 1.5,
              color: title ? OG_COLORS.muted : OG_COLORS.ink,
              fontStyle: "normal",
            }}
          >
            {body}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 26 }}>
          <span style={{ color: OG_COLORS.ink }}>{author}</span>
          <span style={{ fontFamily: "Display", color: OG_COLORS.brand }}>Simplicity</span>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: fonts.length ? fonts : undefined },
  );
}
