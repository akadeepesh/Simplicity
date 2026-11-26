"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { signIn, signUp } from "@/lib/auth-client";
import { safeRedirect } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "sign-in" | "sign-up";

export function AuthForm({
  mode,
  next,
  providers,
  error,
}: {
  mode: Mode;
  next: string;
  providers: { github: boolean; google: boolean };
  /** Error code better-auth appends when a social sign-in fails. */
  error?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = React.useState<string | null>(null);
  const safeNext = safeRedirect(next);
  const afterAuth = `/onboarding?next=${encodeURIComponent(safeNext)}`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const id = String(form.get("identifier") ?? "").trim();
    const password = String(form.get("password") ?? "");
    setPending("email");
    try {
      if (mode === "sign-up") {
        const username = String(form.get("username") ?? "").trim();
        const { error } = await signUp.email({
          email: id,
          password,
          name: String(form.get("name") ?? "").trim() || username,
          username,
        });
        if (error) throw new Error(error.message);
      } else {
        const { error } = id.includes("@")
          ? await signIn.email({ email: id, password })
          : await signIn.username({ username: id, password });
        if (error) throw new Error(error.message);
      }
      router.push(afterAuth);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't sign you in.");
      setPending(null);
    }
  }

  async function social(provider: "github" | "google") {
    setPending(provider);
    const { error } = await signIn.social({
      provider,
      callbackURL: afterAuth,
      errorCallbackURL: `/${mode}?next=${encodeURIComponent(safeNext)}`,
    });
    if (error) {
      toast.error(error.message ?? "Couldn't reach provider.");
      setPending(null);
    }
  }

  const hasSocial = providers.github || providers.google;

  return (
    <div className="space-y-6">
      {error ? (
        <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {socialErrorMessage(error)}
        </p>
      ) : null}
      {hasSocial ? (
        <div className="grid gap-2">
          {providers.google ? (
            <Button variant="outline" size="lg" disabled={!!pending} onClick={() => social("google")}>
              {pending === "google" ? <Loader2 className="animate-spin" /> : <GoogleIcon />}
              Continue with Google
            </Button>
          ) : null}
          {providers.github ? (
            <Button variant="outline" size="lg" disabled={!!pending} onClick={() => social("github")}>
              {pending === "github" ? <Loader2 className="animate-spin" /> : <GitHubIcon />}
              Continue with GitHub
            </Button>
          ) : null}
        </div>
      ) : null}
      {hasSocial ? (
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or with email <span className="h-px flex-1 bg-border" />
        </div>
      ) : null}
      <form onSubmit={onSubmit} className="grid gap-4">
        {mode === "sign-up" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" autoComplete="name" placeholder="Pen name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                required
                pattern="[A-Za-z0-9_]{3,24}"
                title="3–24 letters, numbers or underscores"
                autoComplete="username"
                placeholder="quiet_ink"
              />
            </div>
          </div>
        ) : null}
        <div className="grid gap-2">
          <Label htmlFor="identifier">{mode === "sign-up" ? "Email" : "Email or username"}</Label>
          <Input
            id="identifier"
            name="identifier"
            type={mode === "sign-up" ? "email" : "text"}
            required
            autoComplete={mode === "sign-up" ? "email" : "username"}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
          />
        </div>
        <Button type="submit" size="lg" disabled={!!pending} className="mt-2">
          {pending === "email" ? <Loader2 className="animate-spin" /> : null}
          {mode === "sign-up" ? "Create account" : "Sign in"}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        {mode === "sign-up" ? "Already have an account? " : "New to Simplicity? "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-brand"
          href={`/${mode === "sign-up" ? "sign-in" : "sign-up"}${safeNext !== "/read" ? `?next=${encodeURIComponent(safeNext)}` : ""}`}
        >
          {mode === "sign-up" ? "Sign in" : "Create one"}
        </Link>
      </p>
    </div>
  );
}

function socialErrorMessage(code: string) {
  if (code === "account_not_linked") {
    return "An account with that email already exists. Sign in with your password, then try again.";
  }
  if (code === "access_denied") return "Sign-in was cancelled.";
  return "We couldn't sign you in with that account. Please try again.";
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.3 12 2.3 6.6 2.3 2.3 6.6 2.3 12s4.3 9.7 9.7 9.7c5.6 0 9.3-3.9 9.3-9.5 0-.6-.1-1.1-.2-1.6H12z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z" />
    </svg>
  );
}
