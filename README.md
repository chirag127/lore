# oriz-book-lore

Structured book summaries — overview, content, analysis, narration. Part of the [oriz](https://oriz.in) family.

Live: https://book-lore.oriz.in

## What this is

A free, ad-supported library of structured book summaries across twelve disciplines. Each entry has a four-part artifact set authored as MDX:

- `01-index.mdx` — overview
- `02-content.mdx` — content map
- `03-analysis.mdx` — critical analysis
- `04-narration.mdx` — narration script
- `meta.json` — metadata (title, authors, ISBN, tags, key ideas, related books, …)

Books live under `mdx/NN-top-category/NN-discipline-subcategory/NN-topic-leaf/NNN-book-slug/`. The `schemas/` and `templates/` folders document the authoring conventions and stay at the repo root for future content work.

## Develop

```bash
pnpm install
npx envpact-cli@0.2.0     # pull shared env vars from envpact 'shared' block
pnpm dev
```

Visit `http://localhost:4321`.

## Build + deploy

Cloudflare Pages (custom domain `book-lore.oriz.in`):

```bash
pnpm build
pnpm deploy   # wrangler deploy
```

`UV_THREADPOOL_SIZE=64` is recommended at build time — there are several hundred static book pages and Astro's MDX loader benefits from extra worker threads.

## Stack

- Astro 6 + React 19 + Tailwind v4
- `@chirag127/oriz-ui` design system (shared theme, Sidebar, AccountPanel, ContactForm, AdSlot, NewsletterCta)
- Firebase Auth (`auth.oriz.in`) — single sign-on across the oriz family
- Hosted on Cloudflare Pages

## License

MIT — see [LICENSE](./LICENSE). Book summaries are original commentary; quoted excerpts fall under fair-use / fair-dealing.
