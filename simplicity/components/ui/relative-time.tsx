import { formatDistanceToNowStrict } from "date-fns";

/** "3 minutes ago". The text can drift between server and client render, so its mismatch is expected. */
export function RelativeTime({ date, className }: { date: Date | string; className?: string }) {
  const d = new Date(date);
  return (
    <time dateTime={d.toISOString()} className={className} suppressHydrationWarning>
      {formatDistanceToNowStrict(d, { addSuffix: true })}
    </time>
  );
}
