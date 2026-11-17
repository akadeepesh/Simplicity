import "server-only";
import sanitizeHtml from "sanitize-html";
import { countWords, readingMinutes } from "@/lib/utils";

const ALLOWED: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "em",
    "s",
    "u",
    "blockquote",
    "h2",
    "h3",
    "hr",
    "ul",
    "ol",
    "li",
    "a",
  ],
  allowedAttributes: { a: ["href", "rel", "target"], p: ["style"] },
  allowedStyles: { p: { "text-align": [/^(left|center|right)$/] } },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", {
      rel: "noopener noreferrer nofollow ugc",
      target: "_blank",
    }),
    b: "strong",
    i: "em",
    h1: "h2",
  },
};

export function sanitizeContent(html: string) {
  return sanitizeHtml(html, ALLOWED).trim();
}

/** Convert HTML to plain text, keeping line structure. */
export function htmlToText(html: string) {
  const withBreaks = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|h2|h3|li|blockquote)>/gi, "\n")
    .replace(/<hr\s*\/?>/gi, "\n");
  const text = sanitizeHtml(withBreaks, { allowedTags: [], allowedAttributes: {} });
  return decodeEntities(text)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function decodeEntities(s: string) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'");
}

/** Plain text (e.g. legacy poems) to editor HTML: blank lines split stanzas. */
export function textToHtml(text: string) {
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((stanza) => `<p>${stanza.split("\n").map(esc).join("<br>")}</p>`)
    .join("");
}

export function makeExcerpt(text: string, max = 280) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastBreak = Math.max(cut.lastIndexOf("\n"), cut.lastIndexOf(" "));
  return `${cut.slice(0, lastBreak > max * 0.6 ? lastBreak : max).trimEnd()}…`;
}

export function deriveContent(rawHtml: string) {
  const content = sanitizeContent(rawHtml);
  const plainText = htmlToText(content);
  const wordCount = countWords(plainText);
  return {
    content,
    plainText,
    excerpt: makeExcerpt(plainText),
    wordCount,
    readingMinutes: readingMinutes(wordCount),
  };
}
