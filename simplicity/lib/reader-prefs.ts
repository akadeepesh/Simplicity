export type ReaderPrefs = {
  size: "s" | "m" | "l" | "xl";
  font: "serif" | "sans";
  leading: "cozy" | "airy";
};

export const DEFAULT_PREFS: ReaderPrefs = { size: "m", font: "serif", leading: "cozy" };

export const PREFS_KEY = "simplicity:reader";

export function applyPrefs(p: ReaderPrefs) {
  const el = document.documentElement;
  el.dataset.readSize = p.size;
  el.dataset.readFont = p.font;
  el.dataset.readLeading = p.leading;
}

/** Inline script for <head>: applies saved prefs before first paint. */
export const PREFS_BOOT_SCRIPT = `try{var p=JSON.parse(localStorage.getItem("${PREFS_KEY}")||"{}");var d=document.documentElement;if(p.size)d.dataset.readSize=p.size;if(p.font)d.dataset.readFont=p.font;if(p.leading)d.dataset.readLeading=p.leading}catch(e){}`;
