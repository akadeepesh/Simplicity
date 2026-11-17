import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

export async function getViewer() {
  const session = await getSession();
  return session?.user ?? null;
}

export type Viewer = NonNullable<Awaited<ReturnType<typeof getViewer>>>;

/** For server actions: throws when signed out. */
export async function requireViewer() {
  const viewer = await getViewer();
  if (!viewer) throw new Error("You need to sign in first.");
  return viewer;
}

/** For pages: redirects to sign-in when signed out, onboarding when no username. */
export async function requirePageViewer(next = "/") {
  const viewer = await getViewer();
  if (!viewer) redirect(`/sign-in?next=${encodeURIComponent(next)}`);
  if (!viewer.username) redirect(`/onboarding?next=${encodeURIComponent(next)}`);
  return viewer;
}
