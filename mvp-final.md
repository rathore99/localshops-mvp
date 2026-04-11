# LocalShops — Finalized MVP

> Last updated: 2026-04-11
> Status: Finalized and ready for development

---

## 1. What We Are Building (MVP Only)

A PWA (installable web app) that lets customers in a small MP town discover local shops, browse products, and reserve items for pickup — with zero customer login required.

**You (the admin) operate the backend.** Shopkeepers do not get a self-service portal in MVP. They receive reservation alerts via WhatsApp and contact you via WhatsApp to update their catalog.

---

## 2. Finalized MVP Scope

### In Scope

**Customer-facing (public, no login):**
- Home page: search bar + category tiles + nearby shops list
- Search results: products matched to query with owning shop info
- Shop detail page: shop info, product list, availability, WhatsApp/call link
- Reservation form: customer name + phone + items (free text) + optional note
- Reservation confirmation page

**Admin panel (password-protected, your use only):**
- Login page (JWT-based, single admin user)
- Shops: create, edit, activate/deactivate
- Products: add, edit, toggle availability per shop
- Reservations: view all, filter by shop, update status (pending / confirmed / cancelled)

**Shopkeeper notification (zero cost):**
- On reservation submit, generate a WhatsApp deep link:
  `https://wa.me/91{shopPhone}?text=New+reservation+from+{customerName}...`
- Show this link on the confirmation page and optionally trigger it automatically

### Out of Scope (MVP)

| Feature | Why deferred |
|---|---|
| Shopkeeper self-service dashboard | Not proven needed yet — you manage manually |
| Customer login / accounts | Kills conversion — collect name + phone only |
| Subscription billing tech | Collect UPI manually, build billing after 5+ renewals |
| Image uploads (MinIO / S3) | Use placeholder image or a single hosted URL per shop |
| Hindi / i18n | Add after first user tests reveal the need |
| Offline PWA caching | Add in polish sprint after core flows work |
| Home delivery | Pickup only for MVP |
| Ratings and reviews | Post-validation |
| SMS notifications | WhatsApp is free and ubiquitous — use that |
| Multi-town / geolocation | One town only for MVP |
| Shopkeeper self-onboarding | You onboard manually via WhatsApp |

---

## 3. Tech Stack (Final)

### Frontend
| Item | Choice |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| PWA | vite-plugin-pwa + Workbox (basic manifest + cache shell only) |
| HTTP | TanStack Query (react-query) + Axios |
| State | Zustand (admin panel only) |
| Build output | Static files — deployed to Vercel |

### Backend
| Item | Choice |
|---|---|
| Framework | Spring Boot 3.2 (Java 17) |
| Build | Maven |
| REST | Spring Web (controllers) |
| Auth | Spring Security + JWT (jjwt 0.12.x) — admin only |
| ORM | Spring Data JPA + Hibernate |
| Validation | Jakarta Bean Validation (@Valid) |
| API Docs | SpringDoc OpenAPI 2.x (Swagger UI at /swagger-ui.html) |
| DB migration | Flyway |

### Database
| Item | Choice |
|---|---|
| Primary DB | PostgreSQL 15 |
| Search | PostgreSQL ILIKE or full-text search (tsvector) — no Elasticsearch needed |
| Local dev | H2 in-memory (Spring profile: dev) |

### Infrastructure
| Item | Choice | Cost |
|---|---|---|
| Frontend hosting | Vercel | Free |
| Backend hosting | Railway (Hobby plan) | ~$5/month |
| Database | Railway PostgreSQL add-on | Included in Hobby |
| Domain | .in domain (Namecheap or GoDaddy) | ~₹800/year |
| Images | Placeholder SVG or single CDN URL per product | Free |
| **Total** | | **~₹500/month + ₹800/year** |

---

## 4. Database Schema

```sql
-- shops
CREATE TABLE shops (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(150)  NOT NULL,
    category    VARCHAR(100)  NOT NULL,
    phone       VARCHAR(15)   NOT NULL,
    address     TEXT          NOT NULL,
    town        VARCHAR(100)  NOT NULL DEFAULT 'Singrauli',
    description TEXT,
    is_active   BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- products
CREATE TABLE products (
    id           BIGSERIAL PRIMARY KEY,
    shop_id      BIGINT        NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    name         VARCHAR(200)  NOT NULL,
    description  TEXT,
    price        NUMERIC(10,2),
    is_available BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- reservations
CREATE TABLE reservations (
    id               BIGSERIAL PRIMARY KEY,
    shop_id          BIGINT       NOT NULL REFERENCES shops(id),
    customer_name    VARCHAR(150) NOT NULL,
    customer_phone   VARCHAR(15)  NOT NULL,
    items_text       TEXT         NOT NULL,  -- free-text, e.g. "2x Blue Shirt size M, 1x Black Jeans"
    notes            TEXT,
    status           VARCHAR(20)  NOT NULL DEFAULT 'PENDING',  -- PENDING, CONFIRMED, CANCELLED
    created_at       TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- admin_users (single row for you)
CREATE TABLE admin_users (
    id            BIGSERIAL PRIMARY KEY,
    username      VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

-- indexes
CREATE INDEX idx_products_shop_id ON products(shop_id);
CREATE INDEX idx_products_name_search ON products USING gin(to_tsvector('english', name));
CREATE INDEX idx_reservations_shop_id ON reservations(shop_id);
CREATE INDEX idx_reservations_status ON reservations(status);
```

---

## 5. API Contract

Base URL: `https://api.localshops.in/api/v1`

### Public Endpoints (no auth)

```
GET  /shops                         List all active shops
GET  /shops/{id}                    Shop detail + products
GET  /products/search?q={keyword}   Search products across all shops
GET  /categories                    Distinct category list

POST /reservations                  Create a reservation
Body: {
  shopId: number,
  customerName: string,
  customerPhone: string,  // 10-digit
  itemsText: string,      // "2x Blue Shirt size M"
  notes?: string
}
Response: {
  reservationId: number,
  whatsappUrl: string     // pre-filled WhatsApp link for shopkeeper
}
```

### Admin Endpoints (JWT Bearer required)

```
POST /admin/auth/login
Body: { username, password }
Response: { token: string }

GET    /admin/shops
POST   /admin/shops
PUT    /admin/shops/{id}
DELETE /admin/shops/{id}

GET    /admin/shops/{id}/products
POST   /admin/shops/{id}/products
PUT    /admin/products/{id}
DELETE /admin/products/{id}

GET    /admin/reservations?shopId=&status=&page=
PATCH  /admin/reservations/{id}/status
Body: { status: "CONFIRMED" | "CANCELLED" }
```

---

## 6. Project Folder Structure

```
localShops/
├── frontend/
│   ├── public/
│   │   ├── manifest.json          ← PWA manifest
│   │   └── icons/                 ← App icons (192x192, 512x512)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── SearchResults.tsx
│   │   │   ├── ShopDetail.tsx
│   │   │   ├── Reserve.tsx
│   │   │   ├── Confirmation.tsx
│   │   │   └── admin/
│   │   │       ├── AdminLogin.tsx
│   │   │       ├── AdminShops.tsx
│   │   │       ├── AdminProducts.tsx
│   │   │       └── AdminReservations.tsx
│   │   ├── components/
│   │   │   ├── ShopCard.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   └── ReservationForm.tsx
│   │   ├── api/
│   │   │   ├── client.ts          ← Axios instance
│   │   │   ├── shops.ts
│   │   │   ├── products.ts
│   │   │   └── reservations.ts
│   │   ├── store/
│   │   │   └── adminStore.ts      ← Zustand (JWT token)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/localshops/
│   │       │   ├── LocalShopsApplication.java
│   │       │   ├── controller/
│   │       │   │   ├── ShopController.java
│   │       │   │   ├── ProductController.java
│   │       │   │   ├── ReservationController.java
│   │       │   │   └── admin/
│   │       │   │       ├── AdminAuthController.java
│   │       │   │       ├── AdminShopController.java
│   │       │   │       └── AdminReservationController.java
│   │       │   ├── service/
│   │       │   │   ├── ShopService.java
│   │       │   │   ├── ProductService.java
│   │       │   │   └── ReservationService.java
│   │       │   ├── repository/
│   │       │   │   ├── ShopRepository.java
│   │       │   │   ├── ProductRepository.java
│   │       │   │   └── ReservationRepository.java
│   │       │   ├── model/
│   │       │   │   ├── Shop.java
│   │       │   │   ├── Product.java
│   │       │   │   ├── Reservation.java
│   │       │   │   └── AdminUser.java
│   │       │   ├── dto/
│   │       │   │   ├── ReservationRequest.java
│   │       │   │   └── ReservationResponse.java
│   │       │   └── config/
│   │       │       ├── SecurityConfig.java
│   │       │       ├── JwtConfig.java
│   │       │       └── CorsConfig.java
│   │       └── resources/
│   │           ├── application.yml
│   │           ├── application-dev.yml    ← H2 config
│   │           ├── application-prod.yml   ← PostgreSQL config
│   │           └── db/migration/
│   │               └── V1__initial_schema.sql
│   └── pom.xml
│
├── .github/
│   └── workflows/
│       ├── backend-deploy.yml     ← Build + deploy to Railway
│       └── frontend-deploy.yml    ← Build + deploy to Vercel
│
├── plan.md
├── mvp-final.md                   ← This file
└── Tech analysis summary.md
```

---

## 7. Deployment Plan (Go-Live, No Surprises)

### Infrastructure Setup (Do this before writing a line of code)

**Step 1 — GitHub repo**
- Create a private GitHub repo: `localshops-mvp`
- Use monorepo structure above
- Set up branch protection on `main`

**Step 2 — Railway setup (backend + database)**
1. Sign up at railway.app → new project
2. Add a PostgreSQL service (Railway managed)
3. Add a new service from GitHub repo, point to `/backend`
4. Railway auto-detects Maven and builds with Nixpacks OR use a `Dockerfile`
5. Set environment variables in Railway dashboard:
   ```
   SPRING_PROFILES_ACTIVE=prod
   DB_URL=jdbc:postgresql://...  (Railway provides this)
   DB_USERNAME=...
   DB_PASSWORD=...
   JWT_SECRET=...  (generate a 256-bit random string)
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD_HASH=...  (bcrypt hash)
   ```
6. Railway gives you a URL like `https://localshops-backend.up.railway.app`

**Step 3 — Vercel setup (frontend)**
1. Sign up at vercel.com → import GitHub repo
2. Set root directory to `/frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Set environment variable:
   ```
   VITE_API_BASE_URL=https://localshops-backend.up.railway.app/api/v1
   ```
6. Vercel gives you `https://localshops.vercel.app` (free SSL)

**Step 4 — Custom domain**
1. Buy `.in` domain (e.g., `localshops.in` or `yourtown-shops.in`)
2. Point domain to Vercel (frontend) → add CNAME in DNS
3. Point `api.yourdomain.in` to Railway (backend) → add CNAME
4. Both get free SSL automatically

### CI/CD Pipeline

**backend-deploy.yml** (GitHub Actions):
```yaml
on:
  push:
    branches: [main]
    paths: [backend/**]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { java-version: '17', distribution: 'temurin' }
      - run: cd backend && mvn clean package -DskipTests
      - uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: localshops-backend
```

**frontend-deploy.yml** — Vercel handles this automatically from GitHub push. No manual step needed.

### Local Development Setup

**Backend:**
```bash
cd backend
# Uses application-dev.yml with H2 in-memory DB
mvn spring-boot:run -Dspring-boot.run.profiles=dev
# API available at http://localhost:8080
# Swagger UI at http://localhost:8080/swagger-ui.html
```

**Frontend:**
```bash
cd frontend
npm install
# VITE_API_BASE_URL=http://localhost:8080/api/v1 in .env.local
npm run dev
# PWA available at http://localhost:5173
```

---

## 8. Sprint Plan (5 Weeks) — TDD Feature-Gate Model

> Full process rules are in [DEVELOPMENT_RULES.md](DEVELOPMENT_RULES.md).
> Each feature requires explicit approval before the next begins.

### Week 1 — Foundation (No features yet)

**Goal: Everything compiles, deploys, and runs. Zero business logic.**

- [ ] GitHub repo (monorepo), branch protection on `main`
- [ ] Spring Boot project: pom.xml, application.yml (dev/prod profiles), Flyway V1 schema
- [ ] Testcontainers dependency added and smoke-tested (one dummy integration test passes)
- [ ] React + Vite + Tailwind + React Router scaffold — blank pages, routing works
- [ ] GitHub Actions CI pipeline: build + test on every push
- [ ] Railway project + PostgreSQL add-on configured
- [ ] Vercel project configured (auto-deploy from `/frontend`)
- [ ] `db/seed/V99__seed_data.sql` with 5 dummy shops and 10 products (dev profile only)
- [ ] Health check endpoint: `GET /api/v1/health` → `{ "status": "UP" }`
- [ ] Deploy skeleton to Railway + Vercel → confirm URLs are live

**Approval gate:** Deployed URLs respond. CI pipeline is green. No feature built yet.

---

### Week 2 — Feature 1: Shop Listing + Feature 2: Product Search

#### Feature 1: Shop Listing
*Sequence: tests → implementation → postman → manual → approval → deploy*

- [ ] Unit tests: `ShopServiceTest` (active filter, not-found exception, by-category)
- [ ] Integration tests: `ShopIntegrationTest` (GET /shops, GET /shops/{id}, GET /categories)
- [ ] Postman collection: `postman/feature-1-shop-listing.json`
- [ ] Manual test plan: `testing/manual/feature-1-shop-listing.md`
- [ ] Implement: `ShopService`, `ShopController`, `ShopRepository`
- [ ] Frontend: Home page (shop list + category tiles), ShopDetail page
- [ ] All tests green → Postman passes → manual checklist signed off
- [ ] **APPROVAL GATE → deploy to Railway/Vercel**

#### Feature 2: Product Search
- [ ] Unit tests: `ProductServiceTest` (keyword match, empty result, case-insensitive)
- [ ] Integration tests: `ProductSearchIntegrationTest` (GET /products/search?q=)
- [ ] Postman collection: `postman/feature-2-product-search.json`
- [ ] Manual test plan: `testing/manual/feature-2-product-search.md`
- [ ] Implement: `ProductService.search()`, `ProductController`, full-text search query
- [ ] Frontend: SearchResults page wired to search bar on Home
- [ ] All tests green → Postman passes → manual checklist signed off
- [ ] **APPROVAL GATE → deploy**

---

### Week 3 — Feature 3: Reservation + Feature 4: Admin Auth

#### Feature 3: Reservation
- [ ] Unit tests: `ReservationServiceTest` (create reservation, WhatsApp URL format, phone normalization, shop inactive → exception)
- [ ] Integration tests: `ReservationIntegrationTest` (POST /reservations happy path, 400 on missing fields, 404 on invalid shopId)
- [ ] Postman collection: `postman/feature-3-reservation.json`
- [ ] Manual test plan: `testing/manual/feature-3-reservation.md`
- [ ] Implement: `ReservationService`, `ReservationController`, WhatsApp URL builder
- [ ] Add Bucket4j rate limiting: 5 POSTs per minute per IP on `/reservations`
- [ ] Frontend: Reserve page, Confirmation page (WhatsApp CTA button prominent)
- [ ] All tests green → Postman passes → manual checklist signed off
- [ ] **APPROVAL GATE → deploy**

#### Feature 4: Admin Auth
- [ ] Unit tests: `AdminAuthServiceTest` (valid credentials return token, invalid reject, BCrypt verify)
- [ ] Integration tests: `AdminAuthIntegrationTest` (POST /admin/auth/login, 401 on bad creds, token is valid JWT)
- [ ] Postman collection: `postman/feature-4-admin-auth.json`
- [ ] Manual test plan: `testing/manual/feature-4-admin-auth.md`
- [ ] Implement: `AdminAuthController`, `JwtService`, `SecurityConfig` (public vs protected routes)
- [ ] Frontend: AdminLogin page, protected route guard
- [ ] All tests green → Postman passes → manual checklist signed off
- [ ] **APPROVAL GATE → deploy**

---

### Week 4 — Feature 5: Admin Shop CRUD + Feature 6: Admin Product CRUD

#### Feature 5: Admin Shop Management
- [ ] Unit tests: `AdminShopServiceTest` (create, update, deactivate — soft delete only, no hard delete)
- [ ] Integration tests: `AdminShopIntegrationTest` (all CRUD, 401 without token, 403 on wrong role)
- [ ] Postman collection: `postman/feature-5-admin-shops.json`
- [ ] Manual test plan: `testing/manual/feature-5-admin-shops.md`
- [ ] Implement: `AdminShopController`, update service, deactivate endpoint
- [ ] Frontend: AdminShops page (list, create form, edit form, toggle active)
- [ ] All tests green → Postman passes → manual checklist signed off
- [ ] **APPROVAL GATE → deploy**

#### Feature 6: Admin Product Management
- [ ] Unit tests: `AdminProductServiceTest` (create under shop, toggle availability, shop not found → exception)
- [ ] Integration tests: `AdminProductIntegrationTest`
- [ ] Postman collection: `postman/feature-6-admin-products.json`
- [ ] Manual test plan: `testing/manual/feature-6-admin-products.md`
- [ ] Implement: `AdminProductController`, service, repository query
- [ ] Frontend: AdminProducts page (per-shop product list, add/edit/toggle)
- [ ] All tests green → Postman passes → manual checklist signed off
- [ ] **APPROVAL GATE → deploy**

---

### Week 5 — Feature 7: Admin Reservations + Go-Live Polish

#### Feature 7: Admin Reservation Management
- [ ] Unit tests: `AdminReservationServiceTest` (status transitions, invalid status → exception, filter by shop)
- [ ] Integration tests: `AdminReservationIntegrationTest` (GET with filters, PATCH status, 400 on invalid status)
- [ ] Postman collection: `postman/feature-7-admin-reservations.json`
- [ ] Manual test plan: `testing/manual/feature-7-admin-reservations.md`
- [ ] Implement: `AdminReservationController`, status update service
- [ ] Frontend: AdminReservations page (list, filter, status update buttons)
- [ ] All tests green → Postman passes → manual checklist signed off
- [ ] **APPROVAL GATE → deploy**

#### Go-Live Polish (after all 7 features approved)
- [ ] PWA manifest + icons → test "Add to Home Screen" on real Android
- [ ] CORS locked to production domain only
- [ ] Custom domain wired (Vercel + Railway)
- [ ] Full regression: run all Postman collections against production URL via Newman
- [ ] Complete full manual test plan on mobile (real device, not DevTools)
- [ ] Onboard 5 real shops via admin panel
- [ ] Soft launch: share with 10 real customers

---

## 9. Security Checklist (Before Go-Live)

- [ ] JWT secret is a strong random value (not hardcoded, loaded from env var)
- [ ] CORS whitelist is set to your frontend domain only (not `*`)
- [ ] All admin endpoints are protected by Spring Security
- [ ] `POST /reservations` has server-side validation (@Valid + phone format check)
- [ ] Rate limit `POST /reservations` to prevent spam (e.g., 5 reservations/minute per IP)
- [ ] Flyway migrations are the only way schema changes happen
- [ ] Database password is a Railway secret, not in code
- [ ] Admin password stored as BCrypt hash (never plaintext)
- [ ] HTTPS enforced on both frontend (Vercel) and backend (Railway)

---

## 10. Cost Summary (Monthly)

| Item | Cost |
|---|---|
| Railway Hobby (backend + DB) | $5/month (~₹420) |
| Vercel | Free |
| Domain (.in) | ₹67/month (₹800/year) |
| **Total** | **~₹490/month** |

Break-even: **1 paying shopkeeper** covers all infrastructure costs.

---

## 11. What Comes After MVP (Post-Validation)

Only build these after 5+ shops are live and customers are reserving:

1. **Shopkeeper self-service dashboard** (Sprint 6-7)
2. **Subscription billing** — Razorpay integration (Sprint 8)
3. **Hindi language support** — react-i18next (Sprint 9)
4. **Offline PWA caching** — Workbox strategies (Sprint 9)
5. **Image uploads** — Cloudflare R2 + presigned URLs (Sprint 10)
6. **Shop ratings** (Sprint 11+)
7. **Second town expansion** (after 30+ shops in first town)
