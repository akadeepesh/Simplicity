"use client";
import * as React from "react";
import { Check, FolderPlus, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { createCollection, toggleCollectionItem } from "@/lib/actions/library";
import { loadCollectionsFor } from "@/lib/actions/collections-read";
import { useRequireAuth } from "@/components/site/viewer-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Item = { id: string; name: string; contains: boolean };

export function CollectionPicker({ writingId }: { writingId: string }) {
  const requireAuth = useRequireAuth();
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<Item[] | null>(null);
  const [name, setName] = React.useState("");
  const [pending, startTransition] = React.useTransition();

  React.useEffect(() => {
    if (!open) return;
    let cancelled = false;
    loadCollectionsFor(writingId).then((rows) => {
      if (!cancelled) setItems(rows);
    });
    return () => {
      cancelled = true;
    };
  }, [open, writingId]);

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        if (o && !requireAuth()) return;
        setOpen(o);
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <FolderPlus /> Collect
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-2">
        <p className="px-2 pt-1 pb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Add to collection
        </p>
        {items === null ? (
          <div className="flex justify-center py-6">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ul className="max-h-60 overflow-y-auto">
            {items.length === 0 ? (
              <li className="px-2 py-3 text-sm text-muted-foreground">No collections yet.</li>
            ) : null}
            {items.map((c) => (
              <li key={c.id}>
                <button
                  className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm hover:bg-accent"
                  onClick={async () => {
                    setItems((prev) => prev!.map((p) => (p.id === c.id ? { ...p, contains: !p.contains } : p)));
                    const res = await toggleCollectionItem(c.id, writingId);
                    if (!res.ok) {
                      toast.error(res.error);
                      setItems((prev) => prev!.map((p) => (p.id === c.id ? { ...p, contains: c.contains } : p)));
                    }
                  }}
                >
                  <span className="truncate">{c.name}</span>
                  <Check className={cn("size-4 text-brand", !c.contains && "invisible")} />
                </button>
              </li>
            ))}
          </ul>
        )}
        <form
          className="mt-2 flex gap-2 border-t p-2 pt-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            startTransition(async () => {
              const res = await createCollection({ name, isPublic: true }, writingId);
              if (!res.ok) return void toast.error(res.error);
              setItems((prev) => [{ id: res.data.id, name: name.trim(), contains: true }, ...(prev ?? [])]);
              setName("");
              toast.success("Collection created");
            });
          }}
        >
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New collection"
            className="h-8"
            maxLength={60}
          />
          <Button size="icon-sm" type="submit" disabled={pending || !name.trim()} aria-label="Create">
            {pending ? <Loader2 className="animate-spin" /> : <Plus />}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
