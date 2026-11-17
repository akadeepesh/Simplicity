"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { isUsernameAvailable, setUsername } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { USERNAME_PATTERN } from "@/lib/validation";
import { safeRedirect } from "@/lib/utils";

export function UsernameForm({ suggestion, next }: { suggestion: string; next: string }) {
  const router = useRouter();
  const [value, setValue] = React.useState(suggestion);
  const [available, setAvailable] = React.useState<boolean | null>(null);
  const [pending, startTransition] = React.useTransition();
  const valid = USERNAME_PATTERN.test(value);

  React.useEffect(() => {
    if (!USERNAME_PATTERN.test(value)) return;
    let cancelled = false;
    const t = setTimeout(async () => {
      const ok = await isUsernameAvailable(value);
      if (!cancelled) setAvailable(ok);
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [value]);

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const res = await setUsername(value);
          if (!res.ok) return void toast.error(res.error);
          toast.success(`Welcome, @${res.data.username}`);
          router.push(safeRedirect(next));
          router.refresh();
        });
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <div className="relative">
          <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">@</span>
          <Input
            id="username"
            value={value}
            onChange={(e) => {
              setAvailable(null);
              setValue(e.target.value.replace(/\s/g, ""));
            }}
            className="pl-7"
            autoFocus
            maxLength={24}
          />
          <span className="absolute top-1/2 right-3 -translate-y-1/2">
            {valid && available === true ? <Check className="size-4 text-emerald-500" /> : null}
            {valid && available === false ? <X className="size-4 text-destructive" /> : null}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {!valid
            ? "3–24 letters, numbers or underscores."
            : available === false
              ? "Taken, try another."
              : `Your page: simplicity/@${value.toLowerCase()}`}
        </p>
      </div>
      <Button type="submit" size="lg" disabled={!valid || available === false || pending}>
        {pending ? <Loader2 className="animate-spin" /> : null}
        Continue
      </Button>
    </form>
  );
}
