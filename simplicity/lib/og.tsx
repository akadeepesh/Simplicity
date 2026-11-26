import "server-only";

export const OG_SIZE = { width: 1200, height: 630 };

/** Fetch a subset of a Google font for ImageResponse; returns null on failure. */
export async function loadGoogleFont(family: string, text: string, weight = 400) {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url, { cache: "force-cache" })).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
    if (!src?.[1]) return null;
    const res = await fetch(src[1], { cache: "force-cache" });
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export const OG_COLORS = {
  bg: "#221c18",
  paper: "#f6f2e9",
  ink: "#e9e4d8",
  muted: "#a89a8c",
  brand: "#e9a15a",
};
