# EstateFlow Frontend

Vite + React + TypeScript frontend for the EstateFlow real-estate marketplace.

## Backend

Expected backend API:

```bash
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

The frontend is designed for Emeka's backend handoff and uses the endpoint list from `Codex-front.txt22.txt`. The requested OpenAPI file was not available in this workspace:

```bash
./estateflow-backend/docs/openapi.json
./estateflow-backend/FRONTEND_HANDOFF.md
```

When those files are available, reconcile `src/lib/api.ts` with the generated OpenAPI client.

## Run

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
```

Open:

```bash
http://localhost:5173
```

## Implemented Routes

- `/`
- `/search`
- `/property/:slug`
- `/login`
- `/register`
- `/dashboard`
- `/dashboard/listings/new`
- `/provider`
- `/admin`

## Seed Accounts

Use password `Password123!` when Emeka's backend is running:

- `seeker@example.com`
- `landlord@example.com`
- `agent@example.com`
- `admin@example.com`

## Notes

- Report listing is disabled because no report endpoint was listed.
- Listing draft/update/submit/upload endpoints were not listed, so the wizard is implemented with controlled disabled submit state.
- Binary upload is not presented as fully live S3 because the handoff says local upload URLs are placeholder signed URLs.
