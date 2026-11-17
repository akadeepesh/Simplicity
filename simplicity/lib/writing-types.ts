import type { WritingType } from "@/lib/db/schema";

export type FormDef = { value: string; label: string; hint: string };

export type TypeDef = {
  value: WritingType;
  label: string;
  plural: string;
  tagline: string;
  /** Verse is centered with tight line spacing; prose is a justified column. */
  layout: "verse" | "prose" | "card";
  titleRequired: boolean;
  forms: FormDef[];
};

export const WRITING_TYPES: TypeDef[] = [
  {
    value: "poetry",
    label: "Poetry",
    plural: "Poems",
    tagline: "Lines that linger.",
    layout: "verse",
    titleRequired: false,
    forms: [
      { value: "free-verse", label: "Free verse", hint: "No fixed meter or rhyme" },
      { value: "haiku", label: "Haiku", hint: "Three lines, 5-7-5" },
      { value: "sonnet", label: "Sonnet", hint: "Fourteen lines" },
      { value: "ghazal", label: "Ghazal", hint: "Couplets with a refrain" },
      { value: "shayari", label: "Shayari", hint: "Urdu/Hindi couplets" },
      { value: "limerick", label: "Limerick", hint: "Five playful lines, AABBA" },
      { value: "prose-poem", label: "Prose poem", hint: "Poetry without line breaks" },
      { value: "rhymed", label: "Rhymed verse", hint: "Structured rhyme scheme" },
    ],
  },
  {
    value: "story",
    label: "Stories",
    plural: "Stories",
    tagline: "Worlds in a few pages.",
    layout: "prose",
    titleRequired: true,
    forms: [
      { value: "short-story", label: "Short story", hint: "1,000–7,500 words" },
      { value: "flash-fiction", label: "Flash fiction", hint: "Under 1,000 words" },
      { value: "fable", label: "Fable", hint: "A story with a moral" },
    ],
  },
  {
    value: "essay",
    label: "Essays",
    plural: "Essays",
    tagline: "Thinking out loud.",
    layout: "prose",
    titleRequired: true,
    forms: [
      { value: "personal-essay", label: "Personal essay", hint: "Life, lived and examined" },
      { value: "reflection", label: "Reflection", hint: "A quiet look inward" },
      { value: "letter", label: "Letter", hint: "Dear someone…" },
      { value: "journal", label: "Journal", hint: "A page from the diary" },
    ],
  },
  {
    value: "micro",
    label: "Micro",
    plural: "Micro",
    tagline: "Small words, big echoes.",
    layout: "card",
    titleRequired: false,
    forms: [
      { value: "quote", label: "Quote", hint: "A line worth keeping" },
      { value: "six-word", label: "Six-word story", hint: "Exactly six words" },
      { value: "one-liner", label: "One-liner", hint: "A thought, distilled" },
    ],
  },
];

export const TYPE_MAP = Object.fromEntries(
  WRITING_TYPES.map((t) => [t.value, t]),
) as Record<WritingType, TypeDef>;

export function getTypeDef(type: string | null | undefined): TypeDef | undefined {
  return WRITING_TYPES.find((t) => t.value === type);
}

export function getFormLabel(type: WritingType, form: string | null | undefined) {
  if (!form) return null;
  return TYPE_MAP[type]?.forms.find((f) => f.value === form)?.label ?? null;
}

export function isValidForm(type: WritingType, form: string | null | undefined) {
  if (!form) return true;
  return TYPE_MAP[type].forms.some((f) => f.value === form);
}

export const MICRO_MAX_CHARS = 400;
