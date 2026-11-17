import type { MetadataRoute } from "next";
import { desc, eq, isNotNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { user, writing } from "@/lib/db/schema";
import { absoluteUrl } from "@/lib/utils";
import { WRITING_TYPES } from "@/lib/writing-types";

// Rendered on request so builds never need a database connection.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [writings, authors] = await Promise.all([
    db
      .select({ slug: writing.slug, updatedAt: writing.updatedAt })
      .from(writing)
      .where(eq(writing.status, "published"))
      .orderBy(desc(writing.publishedAt))
      .limit(5000),
    db.select({ username: user.username }).from(user).where(isNotNull(user.username)).limit(5000),
  ]);

  return [
    { url: absoluteUrl("/"), changeFrequency: "hourly", priority: 1 },
    { url: absoluteUrl("/explore"), changeFrequency: "daily", priority: 0.8 },
    ...WRITING_TYPES.map((t) => ({ url: absoluteUrl(`/explore?type=${t.value}`), priority: 0.7 })),
    { url: absoluteUrl("/guidelines"), priority: 0.3 },
    ...writings.map((w) => ({ url: absoluteUrl(`/w/${w.slug}`), lastModified: w.updatedAt, priority: 0.6 })),
    ...authors.map((a) => ({ url: absoluteUrl(`/@${a.username}`), priority: 0.5 })),
  ];
}
