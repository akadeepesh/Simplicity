"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { setUsername, updateProfile } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ProfileSettingsForm({
  initial,
}: {
  initial: { name: string; bio: string; website: string };
}) {
  const router = useRouter();
  const [values, setValues] = React.useState(initial);
  const [pending, startTransition] = React.useTransition();
  return (
    <form
      className="grid gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const res = await updateProfile(values);
          if (!res.ok) return void toast.error(res.error);
          toast.success("Profile saved");
          router.refresh();
        });
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="name">Display name</Label>
        <Input
          id="name"
          value={values.name}
          maxLength={60}
          required
          onChange={(e) => setValues({ ...values, name: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={values.bio}
          maxLength={280}
          placeholder="A line or two about you and what you write."
          onChange={(e) => setValues({ ...values, bio: e.target.value })}
        />
        <p className="text-right text-xs text-muted-foreground tabular-nums">{values.bio.length}/280</p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          type="url"
          value={values.website}
          placeholder="https://"
          onChange={(e) => setValues({ ...values, website: e.target.value })}
        />
      </div>
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : null}
          Save profile
        </Button>
      </div>
    </form>
  );
}

export function UsernameSettingsForm({ current }: { current: string }) {
  const router = useRouter();
  const [value, setValue] = React.useState(current);
  const [pending, startTransition] = React.useTransition();
  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const res = await setUsername(value);
          if (!res.ok) return void toast.error(res.error);
          toast.success(`You're now @${res.data.username}`);
          router.refresh();
        });
      }}
    >
      <div className="relative flex-1">
        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">@</span>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/\s/g, ""))}
          className="pl-7"
          maxLength={24}
          pattern="[A-Za-z0-9_]{3,24}"
          aria-label="Username"
        />
      </div>
      <Button type="submit" variant="outline" disabled={pending || value.toLowerCase() === current}>
        {pending ? <Loader2 className="animate-spin" /> : null}
        Change username
      </Button>
    </form>
  );
}
