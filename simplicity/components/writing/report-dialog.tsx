"use client";
import * as React from "react";
import { Flag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitReport } from "@/lib/actions/engagement";
import { useRequireAuth } from "@/components/site/viewer-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const REASONS = [
  { value: "spam", label: "Spam or promotion" },
  { value: "plagiarism", label: "Not their own work" },
  { value: "harassment", label: "Harassment or hate" },
  { value: "explicit", label: "Explicit content" },
  { value: "other", label: "Something else" },
] as const;

type Reason = (typeof REASONS)[number]["value"];

export function ReportDialog({
  writingId,
  commentId,
  trigger,
}: {
  writingId?: string;
  commentId?: string;
  trigger?: (open: () => void) => React.ReactNode;
}) {
  const requireAuth = useRequireAuth();
  const [open, setOpen] = React.useState(false);
  const [reason, setReason] = React.useState<Reason | null>(null);
  const [details, setDetails] = React.useState("");
  const [pending, startTransition] = React.useTransition();

  const openDialog = () => {
    if (requireAuth()) setOpen(true);
  };

  return (
    <>
      {trigger ? (
        trigger(openDialog)
      ) : (
        <Button variant="ghost" size="sm" onClick={openDialog} className="text-muted-foreground">
          <Flag /> Report
        </Button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report this {commentId ? "comment" : "writing"}</DialogTitle>
            <DialogDescription>Reports are private. Thanks for keeping Simplicity kind.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            {REASONS.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setReason(r.value)}
                className={cn(
                  "rounded-xl border px-4 py-2.5 text-left text-sm transition-colors hover:bg-accent",
                  reason === r.value && "border-brand bg-brand/10",
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Anything we should know? (optional)"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            maxLength={1000}
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!reason || pending}
              onClick={() =>
                startTransition(async () => {
                  const res = await submitReport({ writingId, commentId, reason: reason!, details });
                  if (!res.ok) return void toast.error(res.error);
                  toast.success("Thanks, we'll take a look.");
                  setOpen(false);
                  setReason(null);
                  setDetails("");
                })
              }
            >
              {pending ? <Loader2 className="animate-spin" /> : null}
              Submit report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
