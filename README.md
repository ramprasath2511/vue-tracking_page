# tracking-service

A standalone Vue 3 frontend for looking up a delivery's status by tracking code — a
rebuild of the public [zippd.com/tracking](https://www.zippd.com/tracking/) page as its
own microservice, so it can call `core-api` directly instead of living inside `fleetable`.

It's a static SPA with no backend of its own: all delivery data comes from `core-api`'s
public tracking endpoint.

## Pages

- `/` — enter a tracking code
- `/?code=XXXX` — status, delivery address, driver rating/review, proof-of-delivery
  photo + GPS map, and a milestone timeline (adapts to whichever fulfilment path the
  delivery actually took)

## Running locally

### Via the shared Dascl/Traefik dev environment

If you're set up with [Dascl](../dascl), `tracking-service` is registered as a service
there. Bring it up alongside the rest of the stack:

```sh
cd ../dascl
./src/bin/compose -s tracking-service up -d --build
```

It's served at **http://tracking.zippd.local** (requires a `127.0.0.1 tracking.zippd.local`
entry in `/etc/hosts`). This runs the Docker `dev` target, which bind-mounts this repo —
`node_modules` and `.env` are real files here, and edits hot-reload through Vite.

### Standalone, without Dascl

```sh
cp .env.example .env   # fill in VITE_CORE_API_URL at minimum
docker compose up
```

Serves at **http://localhost:5173** with hot-reload.

### Without Docker at all

```sh
npm install
npm run dev
```

## Configuration

Copy `.env.example` to `.env` and set:

| Variable | Used by | Purpose |
|---|---|---|
| `VITE_CORE_API_URL` | Vite (dev + Docker `dev` target) | Base URL of `core-api`, e.g. `http://api.zippd.local` |
| `CORE_API_URL` | Docker `production` target only | Same, injected into `public/config.js` at container start instead of baked into the JS bundle, so one built image can move between environments |
| `VITE_GOOGLE_MAPS_API_KEY` | Vite | Optional — enables the static GPS map on the delivered timeline step. Without it, the map is skipped rather than shown broken |

## Architecture notes

- `src/api/` — HTTP calls to `core-api` (`tracking.js` for lookups, `reviews.js` for
  submitting a driver rating)
- `src/mappers/delivery.js` — translates `core-api`'s response shape into the flat
  view-model the components consume, so a `core-api` contract change only needs
  updating here
- `src/assets/styles/variables.css` — the design tokens (colours, fonts). One accent
  colour (`--color-accent`) is used everywhere for consistency; `--color-danger` is the
  one deliberate exception, reserved for the error state

## Known limitations

- **Proof-of-delivery photos**: `core-api` currently returns raw S3 URLs rather than
  pre-signed ones. If the bucket/object isn't public, the photo won't load — the app
  hides it gracefully rather than showing a broken image, but this is a `core-api`-side
  fix, not something this repo can work around.
- **Driver reviews**: submitting one calls `core-api`'s public
  `POST /api/v1/order-reviews` for real — verified working end-to-end, including that a
  delivery can only be reviewed once.
