# ZebeEstate Frontend

Vite + React + TypeScript frontend for the ZebeEstate real-estate marketplace.

## Backend

Expected backend API:

```bash
VITE_API_BASE_URL=https://api.zebeestate.com/api/v1
```

The production frontend is verified against the ZebeEstate API at `https://api.zebeestate.com/api/v1`.

## Run

```bash
npm install
npm run dev -- --host 127.0.0.1 --port 5173
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
- `/zebeclaw`

The old `/admin` route intentionally returns a not-found page and does not reveal or redirect to the protected admin dashboard.

## Notes

- Report listing is disabled in the UI even though backend moderation/reporting APIs exist.
- Listing wizard submit remains disabled pending a full listing creation UX pass.
- Binary upload is not presented as fully live S3 because the handoff says local upload URLs are placeholder signed URLs.
