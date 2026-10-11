# شركة درة المتقين — Durrat Al-Muttaqin Co.

Full-stack MERN web app for a goods & livestock road-transport company (Irbid branch, Jordan).
Arabic-first, RTL, gold `#D4AF37` / navy `#0F172A` theme.

```
.
├── server/                 Express + Mongoose API
│   ├── server.js
│   ├── config/db.js
│   ├── models/Booking.js
│   ├── controllers/bookingController.js
│   ├── routes/bookingRoutes.js
│   ├── middleware/         adminAuth, errorHandler
│   └── utils/              asyncHandler, ApiError
└── client/                 React 18 + Vite + Tailwind CSS
    └── src/
        ├── App.jsx         routes: /  and  /admin
        ├── pages/          HomePage, AdminDashboard, NotFound
        ├── components/     Navbar, Hero, Services, About, BookingForm/Modal/Section,
        │                   Contact, WhatsAppButton, Footer, Logo …
        ├── api/client.js   Axios instance + API calls
        └── constants.js    company info, phone numbers, nav links
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

## Admin dashboard

Open `/admin` and enter the `ADMIN_TOKEN`. Filter by status, see counts, call customers directly,
and change each request's status. The token is kept in `sessionStorage` for that browser tab only.

> The shared-token guard is intentionally simple. For multiple staff accounts, replace
> `server/middleware/adminAuth.js` with real user auth (e.g. JWT + hashed passwords).

## Customising

- Company name, slogans, phone numbers, branch address: `client/src/constants.js`
- Colors / fonts: `client/tailwind.config.js` (`gold`, `navy`; Cairo + Tajawal)
- The hero artwork is a lightweight SVG (`TruckIllustration.jsx`); swap in real fleet photos from the brand kit when ready.
- Phone numbers are rendered inside `dir="ltr"` spans so digits stay in order within RTL text;
  `tel:` and WhatsApp links use the international `+962…` form.
