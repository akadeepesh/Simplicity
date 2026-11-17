"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Eye, Feather, Loader2, NotebookPen, PenLine, Quote, Send } from "lucide-react";
import { toast } from "sonner";
import { saveWriting } from "@/lib/actions/writing";
import type { WritingType } from "@/lib/db/schema";
import { MICRO_MAX_CHARS, TYPE_MAP, WRITING_TYPES } from "@/lib/writing-types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichEditor } from "./rich-editor";
import { TagInput } from "./tag-input";

const TYPE_ICONS: Record<WritingType, React.ReactNode> = {
  poetry: <Feather />,
  story: <BookOpen />,
  essay: <NotebookPen />,
  micro: <Quote />,
};

const PLACEHOLDERS: Record<WritingType, string> = {
  poetry: "Begin with a single line…",
  story: "Once, or never, or just this morning…",
  essay: "Start with what you can't stop thinking about…",
  micro: "Say it small…",
};

export type InitialWriting = {
  id?: string;
  type: WritingType;
  form: string | null;
  title: string;
  subtitle: string;
  content: string;
  tags: string[];
  status: "draft" | "published";
  slug?: string;
};

type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";

export function WriteForm({ initial }: { initial: InitialWriting }) {
  const router = useRouter();
  const [id, setId] = React.useState(initial.id);
  const [type, setType] = React.useState<WritingType>(initial.type);
  const [form, setForm] = React.useState<string | null>(initial.form);
  const [title, setTitle] = React.useState(initial.title);
  const [subtitle, setSubtitle] = React.useState(initial.subtitle);
  const [content, setContent] = React.useState(initial.content);
  const [tags, setTags] = React.useState(initial.tags);
  const [stats, setStats] = React.useState({ words: 0, chars: 0 });
  const [saveState, setSaveState] = React.useState<SaveState>("idle");
  const [publishing, setPublishing] = React.useState(false);
  const [preview, setPreview] = React.useState(false);
  const status = initial.status;

  const def = TYPE_MAP[type];
  const latest = React.useRef({ type, form, title, subtitle, content, tags });
  const idRef = React.useRef(id);
  React.useLayoutEffect(() => {
    latest.current = { type, form, title, subtitle, content, tags };
    idRef.current = id;
  });
  const saving = React.useRef<Promise<unknown> | null>(null);

  const persist = React.useCallback(
    async (publish: boolean) => {
      // Serialize saves so a create can't race another create.
      if (saving.current) await saving.current.catch(() => {});
      const p = saveWriting({ id: idRef.current, ...latest.current, publish });
      saving.current = p;
      const res = await p;
      saving.current = null;
      if (res.ok && !idRef.current) {
        setId(res.data.id);
        idRef.current = res.data.id;
        window.history.replaceState(null, "", `/write/${res.data.id}`);
      }
      return res;
    },
    [],
  );

  const markDirty = () => setSaveState("dirty");

  // Autosave drafts (published pieces update only on explicit save).
  React.useEffect(() => {
    if (saveState !== "dirty" || status === "published") return;
    const hasSomething = latest.current.content || latest.current.title;
    if (!hasSomething) return;
    const t = setTimeout(async () => {
      setSaveState("saving");
      const res = await persist(false);
      setSaveState(res.ok ? "saved" : "error");
      if (!res.ok) toast.error(res.error);
    }, 1500);
    return () => clearTimeout(t);
  }, [saveState, title, subtitle, content, tags, type, form, status, persist]);

  React.useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveState === "dirty" || saveState === "saving") e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [saveState]);

  async function publish() {
    setPublishing(true);
    const res = await persist(true);
    setPublishing(false);
    if (!res.ok) return void toast.error(res.error);
    setSaveState("saved");
    toast.success(status === "published" ? "Updated" : "Published. Your words are out in the world.");
    router.push(`/w/${res.data.slug}`);
    router.refresh();
  }

  const overLimit = type === "micro" && stats.chars > MICRO_MAX_CHARS;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 py-5">
        <Button asChild variant="ghost" size="sm">
          <Link href="/library?tab=drafts">
            <ArrowLeft /> Drafts
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-muted-foreground sm:inline" aria-live="polite">
            {saveState === "saving"
              ? "Saving…"
              : saveState === "saved"
                ? "Saved"
                : saveState === "dirty" && status !== "published"
                  ? "Unsaved changes"
                  : saveState === "error"
                    ? "Couldn't save"
                    : status === "published"
                      ? "Published"
                      : id
                        ? "Draft"
                        : "New draft"}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setPreview((p) => !p)} aria-pressed={preview}>
            {preview ? <PenLine /> : <Eye />}
            {preview ? "Edit" : "Preview"}
          </Button>
          <Button variant="brand" size="sm" onClick={publish} disabled={publishing || overLimit}>
            {publishing ? <Loader2 className="animate-spin" /> : <Send />}
            {status === "published" ? "Update" : "Publish"}
          </Button>
        </div>
      </div>

      {preview ? (
        <Preview type={type} form={form} title={title} subtitle={subtitle} content={content} tags={tags} />
      ) : (
        <div className="space-y-6">
          {/* Type + form */}
          <div className="grid gap-4 rounded-2xl border bg-card/60 p-4 sm:grid-cols-[1fr_200px]">
            <div className="grid gap-2">
              <Label className="text-xs text-muted-foreground">What are you writing?</Label>
              <div className="grid grid-cols-4 gap-1 rounded-xl bg-secondary p-1">
                {WRITING_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => {
                      setType(t.value);
                      if (!t.forms.some((f) => f.value === form)) setForm(null);
                      markDirty();
                    }}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs text-muted-foreground transition-all sm:flex-row sm:justify-center sm:text-sm [&_svg]:size-4",
                      type === t.value && "bg-background text-foreground shadow-sm",
                    )}
                  >
                    {TYPE_ICONS[t.value]}
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="text-xs text-muted-foreground">Form</Label>
              <Select
                value={form ?? "none"}
                onValueChange={(v) => {
                  setForm(v === "none" ? null : v);
                  markDirty();
                }}
              >
                <SelectTrigger className="h-[42px]">
                  <SelectValue placeholder="Any form" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Any form</SelectItem>
                  {def.forms.map((f) => (
                    <SelectItem key={f.value} value={f.value} hint={f.hint}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Title */}
          {type !== "micro" ? (
            <div className={cn("space-y-2 pt-6", def.layout === "verse" && "text-center")}>
              <textarea
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value.replace(/\n/g, ""));
                  markDirty();
                }}
                rows={1}
                maxLength={140}
                placeholder={def.titleRequired ? "Title" : "Title (optional)"}
                className="field-sizing-content w-full resize-none bg-transparent font-display text-4xl leading-tight tracking-tight outline-none placeholder:text-muted-foreground/50 md:text-5xl"
              />
              {def.layout === "prose" ? (
                <textarea
                  value={subtitle}
                  onChange={(e) => {
                    setSubtitle(e.target.value.replace(/\n/g, ""));
                    markDirty();
                  }}
                  rows={1}
                  maxLength={240}
                  placeholder="A subtitle, if you like"
                  className="field-sizing-content w-full resize-none bg-transparent font-serif text-xl text-muted-foreground italic outline-none placeholder:text-muted-foreground/50"
                />
              ) : null}
            </div>
          ) : null}

          {/* Body */}
          <div className={cn(def.layout === "verse" && "mx-auto max-w-xl")}>
            <RichEditor
              initialContent={initial.content}
              layout={def.layout}
              placeholder={PLACEHOLDERS[type]}
              maxChars={type === "micro" ? MICRO_MAX_CHARS + 50 : undefined}
              onStats={setStats}
              onChange={(html, s) => {
                setContent(html);
                setStats(s);
                markDirty();
              }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>
              {def.layout !== "prose"
                ? "Enter for a new line · Enter on an empty line for a new stanza"
                : "Ctrl+B bold · Ctrl+I italic · Ctrl+Z undo"}
            </span>
            <span className={cn("tabular-nums", overLimit && "text-destructive")}>
              {type === "micro" ? `${stats.chars}/${MICRO_MAX_CHARS} characters` : `${stats.words} words`}
            </span>
          </div>

          {/* Tags */}
          <div className="grid gap-2 border-t pt-6">
            <Label className="text-xs text-muted-foreground">Tags (up to 5)</Label>
            <TagInput
              value={tags}
              onChange={(t) => {
                setTags(t);
                markDirty();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Preview({
  type,
  form,
  title,
  subtitle,
  content,
  tags,
}: Pick<InitialWriting, "type" | "form" | "title" | "subtitle" | "content" | "tags">) {
  const def = TYPE_MAP[type];
  const formLabel = def.forms.find((f) => f.value === form)?.label;
  return (
    <article className="animate-fade-up pt-10">
      <header className={cn("space-y-4", def.layout !== "prose" && "text-center")}>
        <p className="text-[10.5px] font-semibold tracking-[0.16em] text-brand uppercase">{formLabel ?? def.label}</p>
        {title ? <h1 className="font-display text-4xl leading-tight md:text-6xl">{title}</h1> : null}
        {subtitle ? <p className="font-serif text-xl text-muted-foreground italic">{subtitle}</p> : null}
      </header>
      <div className="mx-auto my-10 h-px max-w-24 bg-brand/40" />
      {content ? (
        <div
          className={cn(
            "writing-body",
            def.layout === "verse" && "writing-verse mx-auto w-fit max-w-full",
            def.layout === "prose" && "writing-prose",
            def.layout === "card" && "writing-card text-center",
          )}
          // Editor output; sanitized again on the server when saved.
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <p className="text-center text-muted-foreground italic">Nothing to preview yet.</p>
      )}
      {tags.length ? (
        <div className={cn("mt-10 flex flex-wrap gap-2", def.layout !== "prose" && "justify-center")}>
          {tags.map((t) => (
            <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs">
              #{t}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
