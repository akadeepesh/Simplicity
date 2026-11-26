import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Loaded lazily so a misconfigured auth or database (missing env vars, no
 * migrations) logs a clear error instead of taking down the root layout.
 */
export const getSession = cache(async () => {
  const h = await headers();
  try {
    const { auth } = await import("@/lib/auth");
    return await auth.api.getSession({ headers: h });
  } catch (err) {
    console.error(
      "[session] Couldn't read the session. Check DATABASE_URL and BETTER_AUTH_SECRET, and that migrations have run.",
      err,
    );
    return null;
  }
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
