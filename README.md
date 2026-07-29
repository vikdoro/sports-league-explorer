# Sports League Explorer

Browse sports leagues from around the world, grouped and sorted by sport.
Built with Vue 3, TypeScript, Vite and Pinia, using the free
[TheSportsDB](https://www.thesportsdb.com/api.php) API.

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default http://localhost:5173).

The app runs out of the box with no configuration — it falls back to
TheSportsDB's public endpoint and free test key (`123`). Note that the
free key returns only 5 leagues, all Soccer; a private key unlocks the
full ~1,500-league dataset, which gives the search and the sport filter
a realistic amount of data to work with.

## Configuration (optional)

To use a private API key or a different endpoint, set the variables
below in `.env.local` (gitignored, see `.env.example`):

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_SPORTSDB_BASE_URL` | `https://www.thesportsdb.com/api/v1/json` | API base URL (no trailing slash) |
| `VITE_SPORTSDB_API_KEY` | `123` | API key (`123` is the free public test key) |

> **⚠️ Private keys are for local use only.** Never commit one or deploy
> a build made with one — Vite inlines `VITE_*` vars into the bundle.
> Deploy with the public key or via a proxy (see below).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run the unit tests (Vitest) |
| `npm run test:watch` | Run the tests in watch mode |
| `npm run lint` | Lint and auto-fix with ESLint |
| `npm run format` | Format with Prettier |

## Design decisions

- **State layering.** Pinia store owns the league list and filter state;
  a composable (`useLeagueBadges`) owns per-league badge state; components
  are purely presentational and receive everything via props/events.
- **Two-layer caching.** Badge lookups are cached in the composable (UI
  state, avoids re-renders) *and* at the network layer, where the
  in-flight promise is cached — so results survive component unmounts,
  concurrent requests de-duplicate, and failures are evicted for retry.
- **Lazy badge fetching.** The badge API is only called when a card is
  first expanded, not for all ~1500 leagues up front.
- **Sport-priority ordering.** Popular sports (Soccer, Tennis,
  Basketball, …) surface first in both the list and the dropdown;
  everything else follows alphabetically.
- **Design tokens.** All colors, spacing, and type run through
  `tokens.css`, with the palette derived from production sports-betting
  sites; a11y contrast fixes were one-token changes.
- **Self-hosted fonts.** Inter is served from `/public/fonts` (immutable,
  no third-party request) with `font-display: swap` plus preloads for the
  two used weights, and a `preconnect` to TheSportsDB to shorten the
  critical API path.
- **Explicit UI states.** Loading skeletons, an error state with retry,
  an empty-filter state, and per-badge loading/error/missing states —
  no blank or dead-end screens.
- **API key hygiene.** The app defaults to the public key so it runs from
  a clean clone; private keys stay in the gitignored `.env.local` and never
  reach a deployed bundle (see Configuration).

## AI tools & workflow

- **Planning — Claude Cowork:** fed it the project brief; planned the app
  against the planned stack (Vue 3, Pinia, Vite), brainstormed the name,
  and derived a design system from production sports-betting sites.
- **Scaffolding:** generated the base app with Vite.
- **Implementation — Claude Code + Cursor:** built the MVP league list
  with Claude Code, then reviewed every agent diff in Cursor before
  continuing. This prompt-in-Claude-Code, verify-in-Cursor loop was the
  working mode for the rest of the project.
- **Data:** used a private TheSportsDB key locally for the full dataset
  (see Configuration).

Manual work and notable review interventions:

- Trimmed the generated design system: reworked colors and fonts, removed
  unused tokens and other bloat.
- Kept components presentational. The badge feature drifted into
  in-component data fetching; re-prompted to move it into a composable
  (`useLeagueBadges`) so `LeagueCard` stays purely visual.
- Layered the caching. The generated version cached badge lookups only in
  the composable (avoiding re-renders); I added a cache at the network
  layer as well — closer to the stated requirement, survives component
  unmounts, and de-duplicates concurrent in-flight requests.
- Enforced code style: explicit semicolons instead of relying on ASI, no
  single-line `if` branches; had ESLint + Prettier set up to lock it in.
- Reviewed font loading and switched to self-hosted Inter (`swap` +
  preloads) over a third-party CDN.
- Audited with Lighthouse (Core Web Vitals and friends) and fixed the
  findings.
- Directed unit tests for the pure logic (leagues store, badge
  composable) and reviewed the assertions rather than trusting green.
- Ran an axe-core a11y audit on the built app (default and expanded-card
  states) and fixed the one violation it found (contrast token).

## Possible improvements

- **API proxy for the private key.** The clean fix for the client-side key
  limitation above is a tiny edge proxy (e.g. a Cloudflare Worker): it
  holds the key as a server-side secret, forwards the two TheSportsDB
  endpoints, and the app points `VITE_SPORTSDB_BASE_URL` at it — no app
  code changes needed. It could also cache league responses at the edge
  and restrict CORS to the deployed origin so the key's quota isn't
  publicly consumable.
