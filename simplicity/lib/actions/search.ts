"use server";

import { getFeed } from "@/lib/queries/writings";
import { searchAuthors } from "@/lib/queries/social";

export async function quickSearch(q: string) {
  const term = q.trim().slice(0, 100);
  if (term.length < 2) return { writings: [], authors: [] };
  const [feed, authors] = await Promise.all([
    getFeed({ q: term }),
    searchAuthors(term),
  ]);
  return {
    writings: feed.items.slice(0, 6).map((w) => ({
      slug: w.slug,
      title: w.title,
      excerpt: w.excerpt.slice(0, 90),
      type: w.type,
      author: w.author.name,
    })),
    authors,
  };
}
