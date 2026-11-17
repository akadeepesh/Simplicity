"use server";

import { getFeed, type FeedParams } from "@/lib/queries/writings";
import { getViewer } from "@/lib/session";

export async function loadFeedPage(params: FeedParams) {
  const viewer = await getViewer();
  // Bookmarks are private: only the viewer's own list can be paged.
  if (params.bookmarkedBy && params.bookmarkedBy !== viewer?.id) {
    return { items: [], nextPage: null };
  }
  return getFeed({ ...params, page: Math.min(params.page ?? 0, 500) }, viewer?.id);
}
