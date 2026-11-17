"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import { Flag, Loader2, Reply, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { addComment, deleteComment } from "@/lib/actions/engagement";
import type { CommentRow } from "@/lib/queries/social";
import { useViewer } from "@/components/site/viewer-context";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ReportDialog } from "./report-dialog";

export function Comments({
  writingId,
  writingAuthorId,
  comments,
}: {
  writingId: string;
  writingAuthorId: string;
  comments: CommentRow[];
}) {
  const viewer = useViewer();
  const pathname = usePathname();
  const top = comments.filter((c) => !c.parentId);
  const replies = (id: string) => comments.filter((c) => c.parentId === id);

  return (
    <section id="comments" className="scroll-mt-24 space-y-8">
      <h2 className="font-display text-2xl">
        Responses <span className="text-muted-foreground tabular-nums">({comments.length})</span>
      </h2>
      {viewer ? (
        <CommentForm writingId={writingId} path={pathname} />
      ) : (
        <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          <Link href={`/sign-in?next=${encodeURIComponent(pathname)}`} className="text-foreground underline underline-offset-4">
            Sign in
          </Link>{" "}
          to leave a response.
        </div>
      )}
      <ul className="space-y-6">
        {top.map((c) => (
          <li key={c.id} className="space-y-4">
            <CommentItem
              c={c}
              canDelete={viewer?.id === c.author.id || viewer?.id === writingAuthorId}
              canReply={!!viewer}
              writingId={writingId}
              path={pathname}
            />
            {replies(c.id).length ? (
              <ul className="ml-5 space-y-4 border-l pl-5">
                {replies(c.id).map((r) => (
                  <li key={r.id}>
                    <CommentItem
                      c={r}
                      canDelete={viewer?.id === r.author.id || viewer?.id === writingAuthorId}
                      canReply={false}
                      writingId={writingId}
                      path={pathname}
                    />
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

function CommentItem({
  c,
  canDelete,
  canReply,
  writingId,
  path,
}: {
  c: CommentRow;
  canDelete: boolean;
  canReply: boolean;
  writingId: string;
  path: string;
}) {
  const viewer = useViewer();
  const [replying, setReplying] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  return (
    <div className="group">
      <div className="flex items-center gap-2.5">
        <Link href={`/@${c.author.username}`} className="flex items-center gap-2.5 hover:text-brand">
          <UserAvatar user={c.author} className="size-7" />
          <span className="text-sm font-medium">{c.author.name}</span>
        </Link>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNowStrict(new Date(c.createdAt), { addSuffix: true })}
        </span>
      </div>
      <p className="mt-2 pl-[38px] font-serif text-[16px] leading-relaxed whitespace-pre-line">{c.body}</p>
      <div className="mt-1 flex gap-1 pl-[30px] opacity-70 transition-opacity group-hover:opacity-100">
        {canReply ? (
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setReplying((r) => !r)}>
            <Reply className="size-3.5" /> Reply
          </Button>
        ) : null}
        {canDelete ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground hover:text-destructive"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const res = await deleteComment(c.id, path);
                if (!res.ok) toast.error(res.error);
              })
            }
          >
            {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />} Delete
          </Button>
        ) : null}
        {viewer && viewer.id !== c.author.id ? (
          <ReportDialog
            commentId={c.id}
            trigger={(open) => (
              <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={open}>
                <Flag className="size-3.5" /> Report
              </Button>
            )}
          />
        ) : null}
      </div>
      {replying ? (
        <div className="mt-3 pl-[38px]">
          <CommentForm
            writingId={writingId}
            parentId={c.id}
            path={path}
            autoFocus
            onDone={() => setReplying(false)}
            placeholder={`Reply to ${c.author.name}…`}
          />
        </div>
      ) : null}
    </div>
  );
}

function CommentForm({
  writingId,
  parentId,
  path,
  autoFocus,
  onDone,
  placeholder = "What did this stir in you?",
}: {
  writingId: string;
  parentId?: string;
  path: string;
  autoFocus?: boolean;
  onDone?: () => void;
  placeholder?: string;
}) {
  const [body, setBody] = React.useState("");
  const [pending, startTransition] = React.useTransition();
  return (
    <form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const res = await addComment({ writingId, parentId, body }, path);
          if (!res.ok) return void toast.error(res.error);
          setBody("");
          onDone?.();
        });
      }}
    >
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        maxLength={2000}
        className="min-h-16 font-serif text-[16px]"
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) e.currentTarget.form?.requestSubmit();
        }}
      />
      <div className="flex justify-end gap-2">
        {onDone ? (
          <Button type="button" variant="ghost" size="sm" onClick={onDone}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" size="sm" disabled={pending || !body.trim()}>
          {pending ? <Loader2 className="animate-spin" /> : null}
          Respond
        </Button>
      </div>
    </form>
  );
}
