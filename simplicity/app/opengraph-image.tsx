import { ImageResponse } from "next/og";
import { loadGoogleFont, OG_COLORS, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Simplicity — where words bloom";

export default async function Image() {
  const text = "Simplicitywhere words bloom.Poetry · Stories · Essays · Micro";
  const display = await loadGoogleFont("Fraunces", text, 500);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          background: `radial-gradient(ellipse at top, #1f2a3d 0%, ${OG_COLORS.bg} 70%)`,
          color: OG_COLORS.ink,
          fontFamily: display ? "Display" : undefined,
        }}
      >
        <div style={{ fontSize: 120, display: "flex" }}>Simplicity</div>
        <div style={{ fontSize: 44, color: OG_COLORS.brand, display: "flex" }}>where words bloom.</div>
        <div style={{ fontSize: 24, letterSpacing: 6, color: OG_COLORS.muted, display: "flex" }}>
          POETRY · STORIES · ESSAYS · MICRO
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: display ? [{ name: "Display", data: display, weight: 500 }] : undefined },
  );
}
