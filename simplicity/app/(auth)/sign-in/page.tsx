import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { enabledProviders } from "@/lib/auth";
import { getViewer } from "@/lib/session";
import { safeRedirect } from "@/lib/utils";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next = "/read" } = await searchParams;
  if (await getViewer()) redirect(safeRedirect(next));
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to like, save and write.">
      <AuthForm mode="sign-in" next={next} providers={enabledProviders} />
    </AuthShell>
  );
}
