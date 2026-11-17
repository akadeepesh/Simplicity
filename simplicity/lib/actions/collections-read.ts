"use server";

import { z } from "zod";
import { getCollectionsFor } from "@/lib/queries/social";
import { getViewer } from "@/lib/session";

export async function loadCollectionsFor(writingId: string) {
  const viewer = await getViewer();
  if (!viewer) return [];
  return getCollectionsFor(viewer.id, z.uuid().parse(writingId));
}
