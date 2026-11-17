"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeOff, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteWriting, unpublishWriting } from "@/lib/actions/writing";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function OwnerMenu({ id, published }: { id: string; published: boolean }) {
  const router = useRouter();
  const [confirm, setConfirm] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon-sm" aria-label="Manage">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/write/${id}`}>
              <Pencil /> Edit
            </Link>
          </DropdownMenuItem>
          {published ? (
            <DropdownMenuItem
              onSelect={() =>
                startTransition(async () => {
                  const res = await unpublishWriting(id);
                  if (!res.ok) return void toast.error(res.error);
                  toast("Moved back to drafts");
                  router.push(`/write/${id}`);
                })
              }
            >
              <EyeOff /> Unpublish
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => setConfirm(true)}>
            <Trash2 /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this writing?</DialogTitle>
            <DialogDescription>Likes, comments and bookmarks go with it. This can&apos;t be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirm(false)}>
              Keep it
            </Button>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  const res = await deleteWriting(id);
                  if (!res.ok) return void toast.error(res.error);
                  toast("Deleted");
                  router.push("/library");
                  router.refresh();
                })
              }
            >
              Delete forever
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
