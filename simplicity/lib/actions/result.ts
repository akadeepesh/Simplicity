export type ActionResult<T = undefined> =
  | ({ ok: true } & (T extends undefined ? object : { data: T }))
  | { ok: false; error: string };

export function fail(error: unknown): { ok: false; error: string } {
  if (error instanceof Error) return { ok: false, error: error.message };
  return { ok: false, error: typeof error === "string" ? error : "Something went wrong." };
}
