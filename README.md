# Commit to Love

Angular app for a couple's memory site — albums, places, profiles, and timeline.

Ships in two forms:

| Package | What it is |
| --- | --- |
| **SPA** (`commit-to-love`) | Full web app |
| **Library** ([`@hbslovely/commit-to-love`](https://www.npmjs.com/package/@hbslovely/commit-to-love)) | Embed the journey in any Angular 19+ app |

Images/assets stay in the host app (`src/assets`). The npm package ships components and routes only (~280 KB).

---

## Quick start

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

| Command | Description |
| --- | --- |
| `npm start` | Dev server (port 3000) |
| `npm run build` | Production SPA → `dist/ky-niem-web` |
| `npm run build:lib` | npm library → `dist/commit-to-love-lib` |

---

## npm library

```bash
npm install @hbslovely/commit-to-love
```

```typescript
import {
  COMMIT_TO_LOVE_ROUTES,
  NavbarComponent,
  FooterComponent,
  CustomPreloadingStrategy,
} from '@hbslovely/commit-to-love';

export const routes: Routes = COMMIT_TO_LOVE_ROUTES;
```

Provide the same `assets/` JSON + images the SPA uses (under `/assets/...`).

---

## Deploy (Vercel)

Connected to [Vercel → commit-to-love](https://vercel.com/hbslovely-projects/commit-to-love/deployments).

- Push to `main` → Vercel builds the **SPA** (`npm run build` → `dist/ky-niem-web`)
- Config is in [`vercel.json`](vercel.json) — keep Output Directory as `dist/ky-niem-web`
- Images/JSON stay under `src/assets` and ship with the SPA (not the npm package)

npm publish is **separate** from Vercel: GitHub Release → Actions → `@hbslovely/commit-to-love`.

---

## Release & CI

**Version scheme:** `YYYY.M.N` (monthly / patch) · `YYYY.M.N-rc.NN` (commit RC on push to `main`).

| Workflow | Trigger |
| --- | --- |
| Vercel | Push to `main` — deploy SPA |
| CI | Push / PR — build SPA & lib |
| Commit RC version | Push to `main` — bump `-rc` tag |
| Patch release | **Daily** 00:05 UTC + manual — ship `YYYY.M.N`, GitHub Release |
| Monthly release | 1st of month — ship `YYYY.M.0`, GitHub Release |
| Publish to npm | Release published → `@hbslovely/commit-to-love` |

**Cut a patch now:** Actions → **Patch release** → Run workflow (optionally `force=true`).

### Required GitHub secrets

| Secret | Used by | Purpose |
| --- | --- | --- |
| `BOT_TOKEN` | Commit RC | PAT that can push version commits + tags |
| `RELEASE_PAT` | Patch / Monthly | PAT that can push + create GitHub Releases |
| `NPM_TOKEN` | Publish to npm | npm Automation token for `@hbslovely` scope |

You can reuse the same PATs/token from [baby-feeding-app](https://github.com/hbslovely/baby-feeding-app).

---

## License

MIT © [Hong Phung Phat](https://github.com/hbslovely)
