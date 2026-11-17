"use server";

import { getFeed, type FeedParams } from "@/lib/queries/writings";
import { getViewer } from "@/lib/session";

export async function loadFeedPage(params: FeedParams) {
  const viewer = await getViewer();
  return getFeed(params, viewer?.id);
}
