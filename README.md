<p align="center">
  <img src="https://github.com/user-attachments/assets/43eb4ab9-89fc-4a76-81e6-dc0e767528c0" alt="Simplicity Logo" width="800">
</p>

<h1 align="center">Simplicity — where words bloom</h1>

<p align="center">
  <strong>A community for poetry, short stories, essays and micro-writing.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#license">License</a>
</p>

---

## 🌟 About

Simplicity is a quiet corner of the internet to read slowly, write honestly and keep the lines that stay with you. Share a poem, a story, an essay or a single line, follow the voices you love, and build reading lists to come back to.

## ✨ Features

- ✍️ **Four kinds of writing**: Poetry, Stories, Essays and Micro, each with forms (haiku, sonnet, ghazal, shayari, flash fiction, personal essay, six-word story and more)
- 📖 **Type-aware reading**: centered verse for poems, a comfortable prose column for stories and essays, pull-quote cards for micro-writing
- 🖋️ **Writing studio**: distraction-free editor with autosaved drafts, preview, tags and verse-friendly line breaks
- 🔎 **Explore & search**: browse by type, form and tag; full-text search across titles, lines and writers; ⌘K quick search
- 🔥 **Feeds**: Latest, Trending, Most loved and Following
- 👤 **Author profiles** at `/@username` with followers, loved writings and public collections
- 💬 **Responses**: threaded comments with replies
- 📚 **Library**: bookmarks, drafts and shareable collections
- 🖼️ **Share cards**: a generated image for every writing, ready for social media
- 🌗 **Paper & ink themes**, with a starry night sky in dark mode
- 🛡️ **Reports** to keep the community kind

## 🛠️ Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router, Server Components, Server Actions) + React 19
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/) on [Neon](https://neon.tech/) with [Drizzle ORM](https://orm.drizzle.team/)
- [Better Auth](https://www.better-auth.com/) (email/password, GitHub, Google)
- [Tiptap](https://tiptap.dev/) editor
- [Tailwind CSS 4](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/) primitives in a [shadcn/ui](https://ui.shadcn.com/) style

## 🚀 Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/akadeepesh/Simplicity.git
   cd Simplicity/simplicity
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Fill in `DATABASE_URL` (any Postgres; Neon works great) and `BETTER_AUTH_SECRET` (any long random string). GitHub and Google keys are optional; their sign-in buttons only appear when configured. OAuth callback URLs are `<your-url>/api/auth/callback/github` and `<your-url>/api/auth/callback/google`.

4. Create the database tables:

   ```bash
   npm run db:migrate
   ```

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

### Useful scripts

| Script                | What it does                                  |
| --------------------- | --------------------------------------------- |
| `npm run dev`         | Start the dev server                          |
| `npm run build`       | Production build                              |
| `npm run lint`        | ESLint                                        |
| `npm run typecheck`   | TypeScript check                              |
| `npm run db:generate` | Generate a migration after editing the schema |
| `npm run db:migrate`  | Apply migrations                              |
| `npm run db:studio`   | Browse the database with Drizzle Studio       |

## 📄 License

This project is licensed under the MIT License; see the [LICENSE](LICENSE) file for details.

---

<p align="center"><sub>
  Built by <a href="https://akadeepesh.com?ref=github">Deepesh Kumar</a> · more work at <a href="https://akadeepesh.com?ref=github">akadeepesh.com</a>
</sub></p>
