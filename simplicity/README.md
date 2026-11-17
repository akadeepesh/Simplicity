# Simplicity app

The Next.js app for Simplicity. See the [root README](../README.md) for features and setup.

## Layout

```
app/                 Routes (App Router)
  w/[slug]/          Reader + generated share image
  write/             Writing studio (new + edit)
  u/[username]/      Profiles (served at /@username via a rewrite)
  explore/           Browse + search
  library/           Saved, collections, drafts
  c/[id]/            Collection pages
components/
  ui/                Primitives (Radix + Tailwind)
  site/              Header, footer, theme, search palette
  writing/           Cards, feed, reader pieces, comments
  editor/            Tiptap editor + write form
lib/
  db/                Drizzle schema + client
  queries/           Server-side reads
  actions/           Server actions (all mutations check ownership)
  auth.ts            Better Auth config
  writing-types.ts   Writing types and forms
drizzle/             SQL migrations
```
