"use client";
import * as React from "react";
import { EditorContent, Extension, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import { Bold, Heading2, Italic, Link2, List, Minus, Quote, Redo2, Underline, Undo2 } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type EditorLayout = "verse" | "prose" | "card";

/**
 * In verse mode Enter inserts a line break; pressing Enter on a fresh empty
 * line turns it into a stanza break (new paragraph).
 */
const VerseEnter = Extension.create<{ isVerse: () => boolean }>({
  name: "verseEnter",
  addOptions() {
    return { isVerse: () => false };
  },
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        if (!this.options.isVerse()) return false;
        const { $from, empty } = editor.state.selection;
        if (!empty || $from.parent.type.name !== "paragraph") return false;
        if ($from.nodeBefore?.type.name === "hardBreak") {
          return editor
            .chain()
            .command(({ tr }) => {
              tr.delete($from.pos - 1, $from.pos);
              return true;
            })
            .splitBlock()
            .run();
        }
        return editor.commands.setHardBreak();
      },
      "Shift-Enter": ({ editor }) => {
        if (!this.options.isVerse()) return false;
        return editor.commands.splitBlock();
      },
    };
  },
});

export function RichEditor({
  initialContent,
  layout,
  placeholder,
  onChange,
  maxChars,
  onStats,
}: {
  initialContent: string;
  layout: EditorLayout;
  placeholder: string;
  onChange: (html: string, stats: { words: number; chars: number }) => void;
  maxChars?: number;
  onStats?: (stats: { words: number; chars: number }) => void;
}) {
  const layoutRef = React.useRef(layout);
  const onChangeRef = React.useRef(onChange);
  const onStatsRef = React.useRef(onStats);

  const placeholderRef = React.useRef(placeholder);
  React.useLayoutEffect(() => {
    layoutRef.current = layout;
    onChangeRef.current = onChange;
    onStatsRef.current = onStats;
    placeholderRef.current = placeholder;
  });

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        strike: false,
        link: { openOnClick: false, autolink: true, protocols: ["http", "https", "mailto"] },
      }),
      // These callbacks run inside editor events, not during render.
      // eslint-disable-next-line react-hooks/refs
      Placeholder.configure({ placeholder: () => placeholderRef.current }),
      CharacterCount.configure({ limit: maxChars }),
      // eslint-disable-next-line react-hooks/refs
      VerseEnter.configure({ isVerse: () => layoutRef.current !== "prose" }),
    ],
    content: initialContent,
    editorProps: {
      attributes: { class: "tiptap", spellcheck: "true" },
    },
    onCreate: ({ editor }) => {
      const storage = editor.storage.characterCount;
      onStatsRef.current?.({ words: storage.words(), chars: storage.characters() });
    },
    onUpdate: ({ editor }) => {
      const storage = editor.storage.characterCount;
      onChangeRef.current(editor.isEmpty ? "" : editor.getHTML(), {
        words: storage.words(),
        chars: storage.characters(),
      });
    },
  });

  React.useEffect(() => {
    // Re-render placeholder decoration when type changes.
    editor?.view.dispatch(editor.state.tr);
  }, [placeholder, editor]);

  return (
    <div className="relative">
      {editor ? <Toolbar editor={editor} layout={layout} /> : null}
      <EditorContent
        editor={editor}
        className={cn(
          "pt-6",
          "writing-body",
          layout === "verse" && "writing-verse",
          layout === "prose" && "writing-prose",
          layout === "card" && "writing-card",
        )}
      />
    </div>
  );
}

function Toolbar({ editor, layout }: { editor: Editor; layout: EditorLayout }) {
  const s = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      h2: editor.isActive("heading", { level: 2 }),
      quote: editor.isActive("blockquote"),
      list: editor.isActive("bulletList"),
      link: editor.isActive("link"),
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
    }),
  });

  const btn = (
    label: string,
    active: boolean,
    onClick: () => void,
    icon: React.ReactNode,
    disabled = false,
  ) => (
    <Tooltip content={label} key={label}>
      <button
        type="button"
        aria-label={label}
        aria-pressed={active}
        disabled={disabled}
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClick}
        className={cn(
          "rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-30 [&_svg]:size-4",
          active && "bg-accent text-foreground",
        )}
      >
        {icon}
      </button>
    </Tooltip>
  );

  const chain = () => editor.chain().focus();

  return (
    <div className="sticky top-16 z-20 -mx-2 flex flex-wrap items-center gap-0.5 rounded-xl border bg-background/90 px-2 py-1 backdrop-blur">
      {btn("Bold (Ctrl+B)", s.bold, () => chain().toggleBold().run(), <Bold />)}
      {btn("Italic (Ctrl+I)", s.italic, () => chain().toggleItalic().run(), <Italic />)}
      {btn("Underline (Ctrl+U)", s.underline, () => chain().toggleUnderline().run(), <Underline />)}
      <span className="mx-1 h-5 w-px bg-border" />
      {layout === "prose" ? btn("Heading", s.h2, () => chain().toggleHeading({ level: 2 }).run(), <Heading2 />) : null}
      {btn("Quote", s.quote, () => chain().toggleBlockquote().run(), <Quote />)}
      {layout === "prose" ? btn("List", s.list, () => chain().toggleBulletList().run(), <List />) : null}
      {btn("Section break", false, () => chain().setHorizontalRule().run(), <Minus />)}
      {btn(
        "Link",
        s.link,
        () => {
          if (s.link) return void chain().unsetLink().run();
          const url = window.prompt("Link URL");
          if (url && /^(https?:\/\/|mailto:)/.test(url)) chain().setLink({ href: url }).run();
        },
        <Link2 />,
      )}
      <span className="ml-auto flex">
        {btn("Undo", false, () => chain().undo().run(), <Undo2 />, !s.canUndo)}
        {btn("Redo", false, () => chain().redo().run(), <Redo2 />, !s.canRedo)}
      </span>
    </div>
  );
}
