# شركة درة المتقين — Durrat Al-Muttaqin Co.

Full-stack MERN web app for a goods & livestock road-transport company (Irbid branch, Jordan).
Arabic-first, RTL, gold `#D4AF37` / navy `#0F172A` theme.

Besides the company site and booking form, it hosts a small moderated transport marketplace:
**عروض البضائع** (`/loads`, merchants post loads) and **سائقين متوفرين** (`/drivers`, drivers announce availability).

```
.
├── server/                 Express + Mongoose API
│   ├── server.js
│   ├── config/             db.js, marketplace.js (cities, cargo/truck types, statuses, TTL)
│   ├── models/             Booking.js, Load.js, Driver.js, listingBase.js (shared listing fields)
│   ├── controllers/        bookingController.js, loadController.js, driverController.js
│   ├── routes/             bookingRoutes.js, loadRoutes.js, driverRoutes.js
│   ├── middleware/         adminAuth, errorHandler, rateLimit
│   ├── utils/              asyncHandler, ApiError, normalize (phone/numbers), listings (expiry, admin handlers)
│   └── tests/api.e2e.mjs   end-to-end API test (npm test)
└── client/                 React 18 + Vite + Tailwind CSS
    └── src/
        ├── App.jsx         routes: /, /loads, /drivers, /admin
        ├── pages/          HomePage, LoadsPage, DriversPage, AdminDashboard, NotFound
        ├── components/     Navbar, Hero, Services, MarketplaceTeaser, About, BookingForm/Modal/Section,
        │   │               Contact, ContactButtons, FormControls, Modal, PageShell, Footer …
        │   ├── listings/   LoadForm, LoadCard, DriverForm, DriverCard, ListingParts
        │   └── admin/      RequestsPanel, ListingsPanel, AdminParts
        ├── hooks/          useBooking, useForm, useListings, useUrlFilters, useAdminList
        ├── api/client.js   Axios instance + API calls
        ├── utils.js        date / price formatting (Jordan time zone)
        └── constants.js    company info, phone numbers, nav links, marketplace option lists
```

## Quick start

Requirements: Node.js 18+, MongoDB (local or Atlas).

```bash
npm run install:all                  # installs server + client deps
cp server/.env.example server/.env   # then edit MONGO_URI and ADMIN_TOKEN
```

**Development** (two terminals):

```bash
npm run dev:server   # API on http://localhost:5000
npm run dev:client   # site on http://localhost:5173 (proxies /api → :5000)
```

**Production** (single process — Express serves the built React app):

```bash
npm run build
NODE_ENV=production npm start   # http://localhost:5000
```

## API — `/api/v1`

All responses use `{ success, message?, data?, meta?, errors? }`.

| Method | Path | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/requests` | Public (rate-limited 10 / 15 min / IP) | Create a transport request |
| `GET` | `/api/v1/requests?status=&serviceType=&page=&limit=` | Admin | List requests (newest first) + per-status counts |
| `PATCH` | `/api/v1/requests/:id` | Admin | Update `status` |
| `GET` | `/api/v1/loads?cargoType=&from=&to=&page=&limit=` | Public | Approved, non-expired loads |
| `POST` | `/api/v1/loads` | Public (rate-limited) | Post a load — saved as `Pending` |
| `GET` | `/api/v1/loads/admin?status=&cargoType=&page=&limit=` | Admin | All loads + per-status counts |
| `PATCH` | `/api/v1/loads/:id` | Admin | Set `status` (`Approved`, `Rejected`, …) |
| `DELETE` | `/api/v1/loads/:id` | Admin | Delete a load |
| `GET` | `/api/v1/drivers?truckType=&city=&minLength=&page=&limit=` | Public | Approved, non-expired drivers |
| `POST` | `/api/v1/drivers` | Public (rate-limited) | Post availability — saved as `Pending` |
| `GET` | `/api/v1/drivers/admin?status=&truckType=&page=&limit=` | Admin | All drivers + per-status counts |
| `PATCH` | `/api/v1/drivers/:id` | Admin | Set `status` |
| `DELETE` | `/api/v1/drivers/:id` | Admin | Delete a driver listing |
| `GET` | `/api/v1/health` | Public | Health check |

Admin endpoints require the header `x-admin-token: <ADMIN_TOKEN>` (or `Authorization: Bearer <ADMIN_TOKEN>`).

```bash
curl -X POST http://localhost:5000/api/v1/requests \
  -H 'Content-Type: application/json' \
  -d '{"customerName":"محمد أحمد","phone":"0795849835","serviceType":"نقل مواشي","pickupLocation":"إربد","destination":"عمّان"}'

curl -X PATCH http://localhost:5000/api/v1/requests/<id> \
  -H 'Content-Type: application/json' -H 'x-admin-token: <ADMIN_TOKEN>' \
  -d '{"status":"In-Progress"}'
```

### Booking schema

| Field | Type | Notes |
|---|---|---|
| `customerName` | String | required, 2–100 chars |
| `phone` | String | required, Jordanian mobile `07[789]XXXXXXX`; `+962…`, `00962…` and Arabic digits are normalised |
| `serviceType` | String | `نقل بضائع` \| `نقل مواشي` |
| `pickupLocation`, `destination` | String | required |
| `notes` | String | optional, ≤ 1000 chars |
| `status` | String | `Pending` (default) \| `In-Progress` \| `Completed` — cannot be set from the public form |
| `createdAt`, `updatedAt` | Date | automatic |

## Marketplace listings

### Rules

- **Moderation.** Every new load / driver listing is saved as `Pending` and is invisible to the public
  until an admin approves it. Statuses: `Pending`, `Approved`, `Rejected`, `Expired`.
- **Expiry.** A listing expires 14 days after it was posted, or at the end of its pickup / available-from
  day (Jordan time, UTC+3) — whichever comes first. The date itself must be between today and 14 days ahead.
  Public lists filter on `expiresAt`, so an expired listing disappears immediately; the admin list marks
  such listings `Expired` when it loads. An expired listing cannot be re-approved.
- **Phone privacy.** Public `GET` endpoints only ever return `Approved`, non-expired listings, with a
  whitelisted set of fields. The public `POST` response returns only `{ _id, status, expiresAt }`, and
  there is no public "get by id" endpoint, so phone numbers of pending or rejected listings are never exposed.
- **Validation.** Same conventions as bookings: Arabic error messages per field in `errors`,
  Jordanian mobiles normalised to `07[789]XXXXXXX`, Arabic-Indic digits accepted in numbers,
  query-string filters must match the fixed option lists (anything else → `400`).
- **Option lists** (cities in Jordan + neighbouring countries, cargo / animal / truck types) live in
  `server/config/marketplace.js` and are mirrored in `client/src/constants.js` — update both together.

### Load (`عروض البضائع`)

| Field | Notes |
|---|---|
| `merchantName`, `phone` | required |
| `cargoType` | `بضائع` \| `مواشي` |
| `cargoDescription` | required, ≤ 500 chars |
| `animalType`, `animalCount` | required for `مواشي` (`أغنام`, `ماعز`, `أبقار`, `إبل`, `خيول`, `أخرى`; integer 1–10000) |
| `approxWeightTons` | optional, 0.1–100 |
| `fromCity`, `toCity` | from the location list |
| `pickupDate` | `YYYY-MM-DD`, today … today + 14 |
| `price`, `negotiable` | optional JOD price (1–100000) + "قابل للتفاوض" flag |
| `notes` | optional |

### Driver (`سائقين متوفرين`)

| Field | Notes |
|---|---|
| `driverName`, `phone` | required |
| `truckType` | `براد`, `قلاب`, `مسطح/سطحة`, `ستارة`, `صندوق مغلق`, `ناقلة مواشي`, `تنك`, `أخرى` |
| `truckTypeOther` | required when `truckType` is `أخرى` |
| `trailerLengthM` | required, 2–25 m |
| `maxLoadTons` | required, 0.5–100 t |
| `currentCity` | from the location list |
| `availableFrom` | `YYYY-MM-DD`, today … today + 14 |
| `preferredRoutes` | optional free text |
| `price`, `negotiable`, `notes` | as for loads |

## Admin dashboard

### Opening it

Click the small, faded **lock icon** at the far end of the navbar (title / label "دخول الإدارة").
It sits after the "اطلب نقلة" button on desktop and next to the menu button on mobile; it brightens on hover.
You can also type `/admin` directly — the `ADMIN_TOKEN` is what protects the dashboard, not the link.

If you already logged in from that browser tab (token saved in `sessionStorage`), the icon opens the
dashboard directly; otherwise — or if the saved token is no longer valid — you see the login screen.
The icon is the `AdminLink` component in `client/src/components/Navbar.jsx`.

### Using it

Enter the `ADMIN_TOKEN`. Three tabs:

- **طلبات النقل** — booking requests: filter by status, call customers, change status.
- **الحمولات** / **السائقين** — marketplace listings: counts per status (opens on *Pending*), filter by
  cargo / truck type, approve, reject or delete. The tab badges show how many listings await review.

The token is kept in `sessionStorage` for that browser tab only.

> The shared-token guard is intentionally simple. For multiple staff accounts, replace
> `server/middleware/adminAuth.js` with real user auth (e.g. JWT + hashed passwords).

## Tests

`npm test` runs `server/tests/api.e2e.mjs`: it starts the real server against MongoDB and checks
validation, phone normalisation, admin auth, moderation, phone privacy, filters, expiry and rate limiting
for bookings, loads and drivers.

```bash
TEST_MONGO_URI=mongodb://127.0.0.1:27017/durrat_test npm test
```

The test **drops that database** before and after running, so it refuses any database name without `test`.

## Customising

- Company name, slogans, phone numbers, branch address: `client/src/constants.js`
- Colors / fonts: `client/tailwind.config.js` (`gold`, `navy`; Cairo + Tajawal)
- The hero artwork is a lightweight SVG (`TruckIllustration.jsx`); swap in real fleet photos from the brand kit when ready.
- Phone numbers are rendered inside `dir="ltr"` spans so digits stay in order within RTL text;
  `tel:` and WhatsApp links use the international `+962…` form.
