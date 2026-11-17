import type { Metadata } from "next";
import { ProfileSettingsForm, UsernameSettingsForm } from "@/components/profile/settings-form";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { UserAvatar } from "@/components/ui/avatar";
import { requirePageViewer } from "@/lib/session";

export const metadata: Metadata = { title: "Settings", robots: { index: false } };

export default async function SettingsPage() {
  const viewer = await requirePageViewer("/settings");
  return (
    <div className="mx-auto max-w-2xl px-4 pt-10 sm:px-6 md:pt-14">
      <p className="text-xs font-semibold tracking-[0.2em] text-brand uppercase">Settings</p>
      <h1 className="mt-2 font-display text-4xl tracking-tight">Your profile</h1>

      <section className="mt-10 rounded-2xl border bg-card p-6">
        <div className="mb-6 flex items-center gap-4">
          <UserAvatar user={viewer} className="size-14" />
          <div className="text-sm text-muted-foreground">
            {viewer.image ? "Your avatar comes from your sign-in provider." : "Sign in with GitHub or Google to use their avatar."}
            <div className="text-foreground">{viewer.email}</div>
          </div>
        </div>
        <ProfileSettingsForm
          initial={{
            name: viewer.name,
            bio: (viewer as { bio?: string | null }).bio ?? "",
            website: (viewer as { website?: string | null }).website ?? "",
          }}
        />
      </section>

      <section className="mt-6 space-y-3 rounded-2xl border bg-card p-6">
        <h2 className="font-display text-xl">Username</h2>
        <p className="text-sm text-muted-foreground">
          Changing it changes your profile link. Old links to @{viewer.username} will stop working.
        </p>
        <UsernameSettingsForm current={viewer.username ?? ""} />
      </section>

      <section className="mt-6 flex items-center justify-between rounded-2xl border bg-card p-6">
        <div>
          <h2 className="font-display text-xl">Appearance</h2>
          <p className="text-sm text-muted-foreground">Paper by day, ink by night.</p>
        </div>
        <ThemeToggle />
      </section>
    </div>
  );
}
