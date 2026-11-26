import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { enabledProviders } from "@/lib/auth";
import { getViewer } from "@/lib/session";
import { safeRedirect } from "@/lib/utils";

export const metadata: Metadata = { title: "Join Simplicity" };

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next = "/read" } = await searchParams;
  if (await getViewer()) redirect(safeRedirect(next));
  return (
    <AuthShell title="Join Simplicity" subtitle="A quiet home for your words. Free, forever.">
      <AuthForm mode="sign-up" next={next} providers={enabledProviders} />
    </AuthShell>
  );
}
