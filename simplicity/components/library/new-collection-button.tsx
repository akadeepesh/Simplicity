"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { createCollection, updateCollection } from "@/lib/actions/library";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type Values = { name: string; description: string; isPublic: boolean };

export function CollectionDialog({
  collectionId,
  initial,
  trigger,
}: {
  collectionId?: string;
  initial?: Values;
  trigger?: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState<Values>(initial ?? { name: "", description: "", isPublic: true });
  const [pending, startTransition] = React.useTransition();

  return (
    <>
      <span onClick={() => setOpen(true)}>
        {trigger ?? (
          <Button size="sm">
            <Plus /> New collection
          </Button>
        )}
      </span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{collectionId ? "Edit collection" : "New collection"}</DialogTitle>
          </DialogHeader>
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              startTransition(async () => {
                const res = collectionId
                  ? await updateCollection(collectionId, values)
                  : await createCollection(values);
                if (!res.ok) return void toast.error(res.error);
                setOpen(false);
                if (!collectionId) setValues({ name: "", description: "", isPublic: true });
                router.refresh();
              });
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="c-name">Name</Label>
              <Input
                id="c-name"
                value={values.name}
                onChange={(e) => setValues({ ...values, name: e.target.value })}
                placeholder="Rainy day poems"
                maxLength={60}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="c-desc">Description</Label>
              <Textarea
                id="c-desc"
                value={values.description}
                onChange={(e) => setValues({ ...values, description: e.target.value })}
                maxLength={200}
                placeholder="What ties these together?"
              />
            </div>
            <label className="flex items-center justify-between gap-4 rounded-xl border p-3">
              <span>
                <span className="block text-sm font-medium">Public</span>
                <span className="text-xs text-muted-foreground">Show on your profile</span>
              </span>
              <Switch
                checked={values.isPublic}
                onCheckedChange={(v) => setValues({ ...values, isPublic: v })}
              />
            </label>
            <DialogFooter>
              <Button type="submit" disabled={pending || !values.name.trim()}>
                {pending ? <Loader2 className="animate-spin" /> : null}
                {collectionId ? "Save" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
