import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins/username";
import { db, schema } from "@/lib/db";
import { RESERVED_USERNAMES, USERNAME_PATTERN } from "@/lib/validation";

const socialProviders: Parameters<typeof betterAuth>[0]["socialProviders"] =
  {};

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    transaction: false,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  socialProviders,
  account: {
    // Google and GitHub verify emails, so signing in with one links to an
    // existing email account instead of failing.
    accountLinking: { enabled: true, trustedProviders: ["google", "github"] },
  },
  user: {
    additionalFields: {
      bio: { type: "string", required: false, input: false },
      website: { type: "string", required: false, input: false },
    },
  },
  plugins: [
    username({
      minUsernameLength: 3,
      maxUsernameLength: 24,
      usernameValidator: (value) =>
        USERNAME_PATTERN.test(value) &&
        !RESERVED_USERNAMES.has(value.toLowerCase()),
    }),
    nextCookies(),
  ],
});

export const enabledProviders = {
  github: Boolean(socialProviders.github),
  google: Boolean(socialProviders.google),
};

export type Session = typeof auth.$Infer.Session;
