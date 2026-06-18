# EstateFlow Frontend

Vite + React + TypeScript frontend for the EstateFlow real-estate marketplace.

## Backend

Expected backend API:

```bash
VITE_API_BASE_URL=http://localhost:3001/api/v1
```

The frontend is verified against the EstateFlow backend running on port 3001.

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
- `/admin`

## Seed Accounts

Use password `Password123!` when Emeka's backend is running:

- `seeker@example.com`
- `landlord@example.com`
- `agent@example.com`
- `admin@example.com`

## Notes

- Report listing is disabled in the UI even though backend moderation/reporting APIs exist.
- Listing wizard submit remains disabled pending a full listing creation UX pass.
- Binary upload is not presented as fully live S3 because the handoff says local upload URLs are placeholder signed URLs.
