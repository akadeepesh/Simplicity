"use client";
import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

export type ClientViewer = { id: string; username: string | null; name: string; image: string | null } | null;

const ViewerContext = React.createContext<ClientViewer>(null);

export function ViewerProvider({ viewer, children }: { viewer: ClientViewer; children: React.ReactNode }) {
  return <ViewerContext.Provider value={viewer}>{children}</ViewerContext.Provider>;
}

export function useViewer() {
  return React.useContext(ViewerContext);
}

/** Returns a guard: call before an authed action; redirects to sign-in when signed out. */
export function useRequireAuth() {
  const viewer = useViewer();
  const router = useRouter();
  const pathname = usePathname();
  return React.useCallback(() => {
    if (viewer) return true;
    router.push(`/sign-in?next=${encodeURIComponent(pathname)}`);
    return false;
  }, [viewer, router, pathname]);
}
