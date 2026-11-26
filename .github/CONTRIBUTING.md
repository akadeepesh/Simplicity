# Contributing to Simplicity

Thanks for wanting to help. Simplicity is a small, opinionated project: a calm place to read and write. Contributions that make reading or writing better, or the code clearer, are very welcome.

## Before you start

- **Small fixes** (typos, obvious bugs, small UI polish): open a pull request directly.
- **Anything larger** (new features, schema changes, new dependencies): [open an issue](https://github.com/akadeepesh/Simplicity/issues/new/choose) first so we can agree on the approach before you put time into it.
- **Security issues**: never in a public issue. See [SECURITY.md](SECURITY.md).

By taking part you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Local setup

You need Node.js 20.9+ and a Postgres database (a free [Neon](https://neon.tech) project works well).

```bash
git clone https://github.com/<your-username>/Simplicity.git
cd Simplicity/simplicity
npm install
cp .env.example .env.local   # fill in DATABASE_URL and BETTER_AUTH_SECRET
npm run db:migrate
npm run dev
```

The [README](../README.md#run-it-locally) lists every environment variable and script.

## Workflow

1. Fork the repo and create a branch from `main`: `feat/short-name`, `fix/short-name`, `docs/...` or `chore/...`.
2. Make your change. Keep pull requests focused on one thing.
3. Run the checks:
   ```bash
   npm run lint
   npm run typecheck
   ```
4. Open a pull request and fill in the template. CI runs the same checks.

### Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(editor): keep caret position after stanza break
fix(profile): qualify outer columns in collection subqueries
docs: explain OAuth callback URLs
```

## How the code is organised

| Where            | What goes there                                              |
| ---------------- | ------------------------------------------------------------ |
| `app/`           | Routes. Server Components by default.                        |
| `components/ui/` | Accessible primitives (Radix + Tailwind). No business logic. |
| `components/*/`  | Feature components: site chrome, writing, editor.            |
| `lib/queries/`   | Server-side reads.                                           |
| `lib/actions/`   | Server Actions. Every mutation lives here.                   |
| `lib/db/`        | Drizzle schema and client.                                   |
| `drizzle/`       | Generated SQL migrations. Do not edit by hand.               |

## Ground rules for code

- **Authorise on the server.** Every Server Action checks the session and ownership before it touches data. Never trust IDs from the client.
- **Sanitise on write.** HTML from the editor goes through the sanitiser before it is stored. Never render unsanitised HTML.
- **Validate input** with `zod` at the action boundary.
- **Server first.** Add `"use client"` only to components that need interactivity.
- **Schema changes** need a migration: edit the schema in `lib/db/`, run `npm run db:generate`, and commit the generated files.
- **Dependencies:** prefer what is already in the project. Explain any new dependency in the pull request.
- **Design:** match the existing look in both light and dark theme, keep it accessible (keyboard, focus states, contrast), and check narrow screens.

## Reporting bugs and ideas

Use the [issue templates](https://github.com/akadeepesh/Simplicity/issues/new/choose). A good bug report has clear steps, what you expected, and what happened instead.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](../LICENSE).
