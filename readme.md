# kamagatos

The personal site of Kamagatos (`apps/blog`), built on the [`@eldon/h`](https://github.com/eldonlabs/h) framework.

## Content

Pages are markdown files with front matter under `apps/blog/content`, published into the framework's static content
models every time the server starts (`syncStaticContentFolder` in `apps/blog/web/server_config.tsx`):

| Folder                    | URL                | Kind                                            |
| ------------------------- | ------------------ | ----------------------------------------------- |
| `apps/blog/content/posts` | `/writing/<slug>`  | Dated essays, listed on the homepage and in RSS |
| `apps/blog/content/pages` | `/<slug>`          | Evergreen pages                                 |
| `apps/blog/content/*.md`  | `/<slug>`          | Standalone pages such as `/about`               |

Front matter keys: `title`, `description` (also the summary shown in listings), `slug`, `date`, `draft: true` to keep a
page unpublished, `tags`. Interactive essays are React pages under `apps/blog/web/public/js` (see
`field_lines.page.tsx`, served at `/lab/field-lines`). The feed is at `/rss`.

## Setup

```bash
npm install            # installs @eldon/h from git and this repo's toolchain
cp secrets_template secrets
docker compose up -d   # PostgreSQL, RabbitMQ, Redis, MinIO
npx h_compile          # compiles TypeScript into dist/ (add --watch during development)
```

## Running

```bash
npx h run apps/blog/web:server --watch   # http://localhost:8095
npx h run :targets                       # every target in the repository
npx h run :presubmit --fix               # lint, format and consistency checks
npx h test :all_tests --env test
```

## Deploying

Not set up yet. `h.config.ts` is where the server and domains go; see eldonlabs/h `docs/eng/ops.md`.
