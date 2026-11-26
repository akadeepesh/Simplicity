import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { UsernameForm } from "@/components/auth/username-form";
import { getViewer } from "@/lib/session";
import { safeRedirect } from "@/lib/utils";

export const metadata: Metadata = { title: "Pick a username" };

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next = "/read" } = await searchParams;
  const viewer = await getViewer();
  if (!viewer) redirect("/sign-in");
  if (viewer.username) redirect(safeRedirect(next));

  const suggestion = (viewer.name || viewer.email.split("@")[0] || "")
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 20);

  return (
    <AuthShell title="One last thing" subtitle="Choose the name readers will know you by.">
      <UsernameForm suggestion={suggestion} next={next} />
    </AuthShell>
  );
}
