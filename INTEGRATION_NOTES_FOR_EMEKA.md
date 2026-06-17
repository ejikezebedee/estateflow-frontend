# Integration Notes For Emeka

## Expected Runtime

Frontend URL:

`http://localhost:5173`

Backend API URL:

`http://localhost:3000/api/v1`

Swagger URL:

`http://localhost:3000/api/docs`

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

## Contract Gaps To Confirm

- Exact pagination envelope for search, favourites, saved searches, provider listings, and admin queues.
- Exact login/register response token fields.
- Listing draft/create/update/submit endpoints.
- Listing photo metadata and local signed upload behavior.
- Provider pause/archive/duplicate endpoints.
- Report listing endpoint, if any.
- Viewing appointment endpoints, if any.
- Profile/application/document endpoints, if any.
- Admin users, featured listing, and audit log endpoints, if any.
