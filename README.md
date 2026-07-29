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
TheSportsDB's public endpoint and free test key (`123`).

## Configuration (optional)

To use a different endpoint or API key, copy the example env file and edit it:

```bash
cp .env.example .env
```

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_SPORTSDB_BASE_URL` | `https://www.thesportsdb.com/api/v1/json` | API base URL (no trailing slash) |
| `VITE_SPORTSDB_API_KEY` | `123` | API key (`123` is the free public test key) |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
