"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { deleteCollection, toggleCollectionItem } from "@/lib/actions/library";
import { Button } from "@/components/ui/button";
import { CollectionDialog } from "./new-collection-button";

export function CollectionOwnerActions({
  id,
  initial,
}: {
  id: string;
  initial: { name: string; description: string; isPublic: boolean };
}) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  return (
    <div className="flex gap-2">
      <CollectionDialog
        collectionId={id}
        initial={initial}
        trigger={
          <Button variant="outline" size="sm">
            <Pencil /> Edit
          </Button>
        }
      />
      <Button
        variant="outline"
        size="sm"
        disabled={pending}
        className="hover:border-destructive/40 hover:text-destructive"
        onClick={() =>
          startTransition(async () => {
            if (!window.confirm("Delete this collection? The writings stay.")) return;
            const res = await deleteCollection(id);
            if (!res.ok) return void toast.error(res.error);
            router.push("/library?tab=collections");
          })
        }
      >
        <Trash2 /> Delete
      </Button>
    </div>
  );
}

export function RemoveFromCollection({ collectionId, writingId }: { collectionId: string; writingId: string }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Remove from collection"
      disabled={pending}
      className="relative z-10 text-muted-foreground hover:text-destructive"
      onClick={() =>
        startTransition(async () => {
          const res = await toggleCollectionItem(collectionId, writingId);
          if (!res.ok) return void toast.error(res.error);
          router.refresh();
        })
      }
    >
      <X />
    </Button>
  );
}
