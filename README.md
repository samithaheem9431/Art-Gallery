# Naimal Khawar Art — MERN (Next.js) Website

A full-stack art gallery / e-commerce website inspired by the design of
[naimalkhawarart.com](https://naimalkhawarart.com/), rebuilt with a modern,
SEO-friendly stack, including an **admin panel** with image uploads.

- **Frontend:** Next.js 16 (App Router) + React 19 + Tailwind CSS v4
- **Backend:** Node.js + Express
- **Database:** MongoDB (via Mongoose)
- **Admin:** JWT-protected dashboard, image uploads via **Multer** (stored in MongoDB)

> Note: This is an independent rebuild of the layout for learning/business use.
> Replace the placeholder images and text with your own artwork and content.
> Do not use copyrighted photos, logos, or copy you don't own.

---

## Project structure

```
ART Project/
├─ backend/            # Express + MongoDB API
│  ├─ src/
│  │  ├─ config/db.js
│  │  ├─ models/       # Collection, Product, Order, ContactMessage
│  │  ├─ routes/       # collections, products, contact, orders
│  │  ├─ seed.js       # sample data seeder
│  │  └─ server.js
│  └─ .env.example
└─ frontend/           # Next.js app
   ├─ app/             # pages (home, collections, products, cart, contact, policies)
   ├─ components/      # Header, Footer, Hero, ProductCard, etc.
   ├─ context/         # CartContext (localStorage cart)
   └─ lib/             # API client + fallback data
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (tested on v22)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally
  (default `mongodb://127.0.0.1:27017`) — or a MongoDB Atlas connection string.

---

## 1. Backend setup

```bash
cd backend
npm install
copy .env.example .env      # macOS/Linux: cp .env.example .env
```

Edit `.env` if needed:

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/nk_art
CLIENT_URL=http://localhost:3000
ADMIN_PASSWORD=change-this-admin-password
JWT_SECRET=change-this-to-a-long-random-secret
```

Seed sample data (3 collections, 9 paintings):

```bash
npm run seed
```

Start the API:

```bash
npm run dev     # auto-reload (nodemon)
# or
npm start
```

API runs at `http://localhost:5000`. Health check: `http://localhost:5000/api/health`

### API endpoints

| Method | Route                       | Description                    |
| ------ | --------------------------- | ------------------------------ |
| GET    | `/api/collections`          | List collections               |
| GET    | `/api/collections/:slug`    | Collection + its products      |
| GET    | `/api/products`             | List products (`?collection=`, `?featured=true`) |
| GET    | `/api/products/:slug`       | Single product                 |
| POST   | `/api/contact`              | Save a contact message         |
| POST   | `/api/orders`               | Create an order from a cart    |
| POST   | `/api/admin/login`          | Get an admin JWT (password)    |
| POST   | `/api/images`               | Upload image(s) — **admin**    |
| GET    | `/api/images/:id`           | Serve an image from the DB     |
| POST/PUT/DELETE | `/api/products`, `/api/collections` | Manage content — **admin** |

---

## 2. Frontend setup

```bash
cd frontend
npm install
```

`.env.local` is already set to:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Run the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

> The frontend falls back to bundled sample data if the backend isn't running,
> so the design always renders. Contact & checkout require the backend.

---

## Pages

- `/` — Home (hero, about slideshow, shipping policy, collections, featured works)
- `/collections` — All collections + all paintings
- `/collections/[slug]` — Single collection (stallions / figurative / abstract)
- `/products/[slug]` — Product detail + add to cart
- `/cart` — Cart + checkout (creates an order)
- `/contact` — Contact form (saves to DB)
- `/policies/[slug]` — shipping / refund / privacy / terms

## Admin panel

Manage products & collections and upload images — no code needed.

1. Make sure the **backend is running** (admin needs the API).
2. Go to **`http://localhost:3000/admin/login`**
3. Enter the password from `backend/.env` (`ADMIN_PASSWORD`, default `admin123` in dev).
4. From the dashboard you can:
   - **Add / edit / delete products** (title, price, collection, medium, dimensions,
     description, images, featured/in-stock flags)
   - **Add / edit / delete collections** (with a cover image)
   - **Upload images** — files are sent via Multer and stored **inside MongoDB**,
     then served from `/api/images/:id`. This works on serverless hosts
     (Vercel etc.) because it doesn't rely on local disk.

New/edited content appears on the public site automatically (pages revalidate
every 60s; in development it updates on refresh).

> Change `ADMIN_PASSWORD` and `JWT_SECRET` to strong values before going live.

---

## SEO features

- Server-side rendering + static generation (great for Google ranking)
- Per-page `<title>` / meta descriptions + Open Graph tags
- `sitemap.xml` and `robots.txt` generated automatically
- Semantic HTML and fast image loading via `next/image`

Before going live, set `NEXT_PUBLIC_SITE_URL` to your real domain so the sitemap
and metadata use the correct URLs.

---

## Customising

- **Images:** replace the `picsum.photos` placeholders — the hero image is in
  `components/Hero.js`, others come from the seeded data in `backend/src/seed.js`.
- **Products/Collections:** edit `backend/src/seed.js` and re-run `npm run seed`,
  or build a small admin later to manage them.
- **Text/branding:** logo "NK" is in `components/Header.js`; site metadata is in
  `app/layout.js`.

---

## Production build

```bash
# frontend
cd frontend && npm run build && npm start

# backend
cd backend && npm start
```
