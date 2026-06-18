# Integration Notes For Emeka

## Expected Runtime

Frontend URL:

`http://localhost:5173`

Backend API URL:

`http://localhost:3001/api/v1`

Swagger URL:

`http://localhost:3001/api/docs`

## Endpoints Used

- `POST /auth/register`
- `POST /auth/login`
- `GET /me`
- `GET /search/properties`
- `GET /listings/:slug`
- `GET /favourites`
- `POST /favourites/:listingId`
- `DELETE /favourites/:listingId`
- `GET /saved-searches`
- `POST /saved-searches`
- `PATCH /saved-searches/:id`
- `DELETE /saved-searches/:id`
- `POST /listings/:id/contact`
- `GET /messages/threads`
- `GET /messages/threads/:id`
- `POST /messages/threads/:id/messages`
- `GET /provider/listings`
- `GET /provider/dashboard`
- `GET /admin/metrics`
- `GET /admin/listings/pending`
- `POST /admin/listings/:id/approve`
- `POST /admin/listings/:id/reject`
- `GET /admin/reports`

All paths are resolved under `VITE_API_BASE_URL`.

## Remaining UX Gaps

- Listing wizard submit needs a full listing creation UX pass.
- Report listing is intentionally disabled in the UI.
- Viewing appointment and document-upload workflows are not exposed in this frontend package.
