<div align="center">

<img src="simplicity/public/leaves.png" alt="Simplicity" width="88" />

# Simplicity

**A quiet home for poetry, short stories, essays and the small lines in between.**

[Live site](https://simplicity.akadeepesh.com) · [Features](#features) · [Run it locally](#run-it-locally) · [Architecture](#architecture)

![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)
![Postgres](https://img.shields.io/badge/Postgres-Neon-4169e1?logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

---

Most of the internet is built for scrolling. Simplicity is built for reading.

It is a community where people publish short-form literature (a haiku, a ghazal, a piece of flash fiction, a letter they never sent) and where every piece is set the way it deserves to be read. Verse is centred with its line breaks intact. Stories and essays get a calm, book-like column. A single line becomes a pull quote. There are no ads, no algorithmic outrage and no clutter: just words, the people who write them, and the readers who keep them.

## Features

### Write in the form that fits

Four kinds of writing, each with forms that shape how a piece is presented and discovered.

| Type        | Forms                                                                          |
| ----------- | ------------------------------------------------------------------------------ |
| **Poetry**  | Free verse, haiku, sonnet, ghazal, shayari, limerick, prose poem, rhymed verse |
| **Stories** | Short story, flash fiction, fable                                              |
| **Essays**  | Personal essay, reflection, letter, journal                                    |
| **Micro**   | Quote, six-word story, one-liner                                               |

### A studio that gets out of the way

- A distraction-free editor that understands poetry: **Enter** starts a new line, and **Enter on an empty line** starts a new stanza.
- Drafts save themselves as you type. Preview the piece exactly as readers will see it before you publish.
- Tags, subtitles and section breaks, with formatting kept deliberately minimal.

### Reading that respects the reader

- Layouts per type: centred verse, a prose column with drop caps, and display-type cards for micro-writing.
- Reading settings for text size, serif or sans, and line spacing, remembered across visits.
- A reading progress bar, estimated reading time, and "more from this author" at the end of each piece.
- A warm, paper-toned light theme and a candlelit dark theme with a faint, animated night sky.

### Discovery without the noise

- **Feeds:** For you, Latest, Trending, Most loved and Following.
- **For you** ranks writing by the authors you follow, the tags you love and the forms you return to, weighted by freshness.
- **Explore** by type, form or tag, with full-text search across titles, lines and writers.
- **⌘K** quick search from anywhere.

### A community, not a content farm

- Author profiles at `/@username` with followers, loved writings and public collections.
- Threaded responses on every piece.
- A personal library of bookmarks, drafts and curated, shareable **collections**.
- A generated share image for every writing, ready for social media or download.
- Private reporting and clear community guidelines.

## Architecture

Simplicity is a server-first Next.js app. Pages render on the server, mutations run as Server Actions, and the client ships only what needs to be interactive.

| Layer         | Choice                                                                                 |
| ------------- | -------------------------------------------------------------------------------------- |
| Framework     | Next.js 16 (App Router, Server Components, Server Actions), React 19                   |
| Database      | PostgreSQL on Neon, queried with Drizzle ORM                                           |
| Search        | Postgres full-text search (`tsvector` with weighted title, subtitle and body, GIN index) |
| Auth          | Better Auth: email and password, GitHub, Google; data lives in your own database       |
| Editor        | Tiptap, with server-side HTML sanitisation on every save                              |
| UI            | Tailwind CSS 4, Radix UI primitives, Fraunces, Newsreader and Inter                    |
| Share images  | `next/og`, generated on demand for every writing                                           |

Design decisions worth knowing:

- **Every write is authorised on the server.** Each action checks the session and ownership before touching data.
- **Content is sanitised once, on write.** The editor's HTML passes through an allow-list before it is stored, so rendering stays fast and safe.
- **Counts are computed, not cached.** Likes and comments come from indexed subqueries, so they can never drift out of sync.
- **No vendor lock-in.** Any Postgres works, and authentication data sits in the same database as everything else.

```
simplicity/
├── app/                 Routes: reader, studio, explore, profiles, library, collections
├── components/
│   ├── ui/              Accessible primitives (Radix + Tailwind)
│   ├── site/            Header, footer, theme, search palette
│   ├── writing/         Cards, feeds, reader, comments, sharing
│   └── editor/          Tiptap editor and writing studio
├── lib/
│   ├── db/              Drizzle schema and client
│   ├── queries/         Server-side reads
│   ├── actions/         Server Actions (all mutations)
│   └── writing-types.ts The taxonomy of types and forms
└── drizzle/             SQL migrations
```

## Run it locally

You need Node.js 20+ and a Postgres database. A free [Neon](https://neon.tech) project works well.

```bash
git clone https://github.com/akadeepesh/Simplicity.git
cd Simplicity/simplicity
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable                                     | Required | Notes                                                  |
| -------------------------------------------- | -------- | ------------------------------------------------------ |
| `DATABASE_URL`                               | Yes      | Postgres connection string                             |
| `BETTER_AUTH_SECRET`                         | Yes      | Any long random string                                 |
| `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`     | Yes      | `http://localhost:3000` locally, your domain in production |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`   | No       | Callback: `<url>/api/auth/callback/github`             |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`   | No       | Callback: `<url>/api/auth/callback/google`             |

Social sign-in buttons appear only when their keys are set. Email sign-up always works.

```bash
npm run db:migrate   # create tables
npm run dev          # http://localhost:3000
```

| Script                | Purpose                                     |
| --------------------- | ------------------------------------------- |
| `npm run dev`         | Development server                          |
| `npm run build`       | Production build                            |
| `npm run lint`        | ESLint                                      |
| `npm run typecheck`   | TypeScript                                  |
| `npm run db:generate` | Create a migration after changing the schema |
| `npm run db:migrate`  | Apply migrations                            |
| `npm run db:studio`   | Browse data in Drizzle Studio               |

## Deploying

The app deploys to Vercel as-is. Set the project's root directory to `simplicity`, add the environment variables above, and run `npm run db:migrate` against your production database once. If you use a custom domain, set `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to it and register the OAuth callbacks on that domain.

## Contributing

Issues and pull requests are welcome. For anything larger than a small fix, please open an issue first to talk through the idea. Run `npm run lint` and `npm run typecheck` before submitting.

## License

MIT. See [LICENSE](LICENSE).

---

<p align="center"><sub>
  Built by <a href="https://akadeepesh.com?ref=github">Deepesh Kumar</a> · more work at <a href="https://akadeepesh.com?ref=github">akadeepesh.com</a>
</sub></p>
