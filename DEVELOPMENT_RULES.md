# LocalShops — Development Rules & Process

> These rules govern how every feature is built, tested, and approved.
> No exceptions during MVP. Review and revise after each sprint retrospective.

---

## Core Philosophy

1. **Tests before code.** Write tests first. Watch them fail. Then write code to make them pass.
2. **One feature at a time.** Do not start Feature N+1 until Feature N is approved.
3. **Deploy early, deploy often.** Every approved feature goes to Railway/Vercel before the next begins.
4. **No orphan code.** If a class, method, or route has no test, it does not exist.
5. **Approval is a gate, not a formality.** Approval requires all automated tests green + manual checklist signed off.

---

## Feature Development Lifecycle

Every feature follows this exact sequence. No shortcuts.

```
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1  Write unit tests (service layer)          [RED]        │
│  STEP 2  Write integration tests (API layer)       [RED]        │
│  STEP 3  Write Postman collection for this feature              │
│  STEP 4  Write manual test plan checklist                       │
│  STEP 5  Implement the feature                     [GREEN]      │
│  STEP 6  Refactor — simplify without breaking tests [REFACTOR]  │
│  STEP 7  Run full test suite (unit + integration)  [ALL GREEN]  │
│  STEP 8  Execute Postman collection → all pass                  │
│  STEP 9  Complete manual test plan checklist                    │
│  STEP 10 Present results → await approval                       │
│  STEP 11 Deploy to Railway/Vercel                               │
│  STEP 12 Smoke test on deployed URL                             │
│  ── APPROVAL GATE ──────────────────────────────────────────── │
│  STEP 13 Begin next feature                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Testing Strategy

### Backend Testing Layers (Spring Boot)

#### Layer 1: Unit Tests
- **What:** Service classes, utility methods, domain logic
- **Tools:** JUnit 5, Mockito, AssertJ
- **DB:** No database — all dependencies are mocked
- **Location:** `src/test/java/.../service/`
- **Naming:** `{ClassName}Test.java`
- **Coverage target:** All public service methods, all edge cases, all error paths
- **Run with:** `mvn test -Dtest="*Test"`

#### Layer 2: Integration Tests (API Layer)
- **What:** Full HTTP request → controller → service → real DB → response
- **Tools:** Spring Boot Test (@SpringBootTest), MockMvc, Testcontainers (PostgreSQL)
- **DB:** Real PostgreSQL running in a Docker container via Testcontainers — NOT H2
- **Location:** `src/test/java/.../integration/`
- **Naming:** `{FeatureName}IntegrationTest.java`
- **Why Testcontainers and not H2:** H2 hides PostgreSQL-specific behavior (full-text search, constraints). We must test against the same DB engine we deploy.
- **Run with:** `mvn test -Dtest="*IntegrationTest"` (requires Docker running)

#### Layer 3: Postman / API Contract Tests
- **What:** HTTP-level tests run against a running server (local or staging)
- **Tools:** Postman, Newman (CLI runner for CI)
- **Location:** `postman/` directory in repo root
- **Naming:** `feature-{N}-{feature-name}.postman_collection.json`
- **Every collection includes:**
  - Happy path requests
  - Edge case requests
  - Error case requests (400, 401, 404, 422)
  - Assertions on status code, response body shape, specific field values
- **Run with:** `newman run postman/feature-1-shop-listing.postman_collection.json --env-var "baseUrl=http://localhost:8080"`

### Frontend Testing (React)

#### Unit / Component Tests
- **Tools:** Vitest, React Testing Library
- **What:** Individual components render correctly, form validation, state changes
- **Location:** `src/**/*.test.tsx` co-located with component
- **Run with:** `npm run test`

#### E2E Tests (after MVP stabilizes — not in initial sprints)
- **Tools:** Playwright
- **Deferred:** Add after Week 5 go-live

---

## Test File Templates

### Backend Unit Test Template
```java
// src/test/java/com/localshops/service/ShopServiceTest.java
@ExtendWith(MockitoExtension.class)
class ShopServiceTest {

    @Mock ShopRepository shopRepository;
    @InjectMocks ShopService shopService;

    @Test
    @DisplayName("getActiveShops returns only shops where is_active = true")
    void getActiveShops_returnsOnlyActiveShops() {
        // Arrange
        var activeShop = buildShop(1L, "Shri Fashion", true);
        var inactiveShop = buildShop(2L, "Closed Store", false);
        when(shopRepository.findByIsActiveTrue()).thenReturn(List.of(activeShop));

        // Act
        var result = shopService.getActiveShops();

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Shri Fashion");
    }

    @Test
    @DisplayName("getShopById throws ResourceNotFoundException when shop does not exist")
    void getShopById_throwsWhenNotFound() {
        when(shopRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> shopService.getShopById(99L))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("Shop not found");
    }
}
```

### Backend Integration Test Template
```java
// src/test/java/com/localshops/integration/ShopIntegrationTest.java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
@Transactional
class ShopIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
        .withDatabaseName("localshops_test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired MockMvc mockMvc;
    @Autowired ShopRepository shopRepository;

    @BeforeEach
    void setUp() {
        shopRepository.deleteAll();
        shopRepository.save(buildShop("Shri Fashion", "Apparel", true));
        shopRepository.save(buildShop("Closed Store", "Apparel", false));
    }

    @Test
    @DisplayName("GET /api/v1/shops returns only active shops")
    void getShops_returnsOnlyActiveShops() throws Exception {
        mockMvc.perform(get("/api/v1/shops"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(1))
            .andExpect(jsonPath("$[0].name").value("Shri Fashion"));
    }

    @Test
    @DisplayName("GET /api/v1/shops/{id} returns 404 for unknown shop")
    void getShop_returns404ForUnknownId() throws Exception {
        mockMvc.perform(get("/api/v1/shops/9999"))
            .andExpect(status().isNotFound());
    }
}
```

---

## Postman Collection Structure

Each Postman collection must have:
```
Feature N - {Feature Name}
├── Happy Path
│   ├── Request 1 — description
│   └── Request 2 — description
├── Edge Cases
│   ├── Empty result (expect 200 with empty array)
│   └── Optional fields omitted
└── Error Cases
    ├── Invalid input (expect 400/422)
    ├── Not found (expect 404)
    └── Unauthorized (expect 401) — for admin endpoints only
```

Every request must have:
- A `Tests` tab with assertions (status code, response structure, field values)
- Pre-request scripts to set up test data where needed
- Environment variables for `{{baseUrl}}`, `{{adminToken}}`

---

## Manual Test Plan Template

For each feature, fill in this checklist before marking it approved.

```markdown
## Manual Test Plan — Feature N: {Feature Name}
**Tester:** [your name]
**Date:** [date]
**Environment:** [ ] Local  [ ] Staging (Railway)
**Device tested:** [ ] Desktop Chrome  [ ] Android Chrome  [ ] Android Firefox

### Functional Tests
- [ ] Happy path works end-to-end
- [ ] Edge case: empty state shows correct message
- [ ] Edge case: long text inputs render correctly
- [ ] Invalid input shows user-friendly error (not a stack trace)
- [ ] Navigation works (back button, browser history)

### Mobile-Specific Tests
- [ ] Page renders correctly on a real Android phone (not just DevTools)
- [ ] Tap targets are large enough (no mis-taps on small buttons)
- [ ] Keyboard does not obscure form inputs on mobile
- [ ] Page does not require horizontal scroll on 375px width

### Performance Checks
- [ ] Page loads in under 3 seconds on a 4G connection (use Chrome DevTools throttle)
- [ ] No broken images or missing assets in console

### Security Checks (admin features only)
- [ ] Accessing admin URL without token redirects to login
- [ ] Expired token is rejected (401)
- [ ] Admin form inputs reject script injection attempts

### Sign-off
- [ ] All automated tests pass (unit + integration + Postman)
- [ ] All manual checks above are completed
- [ ] Feature deployed to Railway/Vercel staging URL
- [ ] Approval given to proceed to next feature
```

---

## Feature Build Order (MVP)

Features are built in strict dependency order. Each must be approved before the next begins.

| # | Feature | Backend endpoints | Frontend pages | Depends on |
|---|---|---|---|---|
| 1 | **Shop Listing** | `GET /shops`, `GET /shops/{id}`, `GET /categories` | Home, ShopDetail | Nothing |
| 2 | **Product Search** | `GET /products/search?q=` | SearchResults | Feature 1 |
| 3 | **Reservation** | `POST /reservations` | Reserve, Confirmation | Feature 1 |
| 4 | **Admin Auth** | `POST /admin/auth/login` | AdminLogin | Nothing (parallel to 1-3) |
| 5 | **Admin Shop CRUD** | `GET/POST/PUT/DELETE /admin/shops` | AdminShops | Feature 4 |
| 6 | **Admin Product CRUD** | `GET/POST/PUT/DELETE /admin/products` | AdminProducts | Feature 5 |
| 7 | **Admin Reservations** | `GET /admin/reservations`, `PATCH /admin/reservations/{id}/status` | AdminReservations | Feature 3 + 4 |

---

## Definition of Done (Per Feature)

A feature is DONE only when ALL of the following are true:

- [ ] All unit tests written and passing
- [ ] All integration tests written and passing (Testcontainers, not H2)
- [ ] Postman collection created and all requests pass (Newman run exits 0)
- [ ] Manual test plan completed and signed off
- [ ] No compiler warnings in production code
- [ ] All API inputs validated with @Valid and appropriate error messages returned
- [ ] Feature deployed to staging (Railway + Vercel)
- [ ] Smoke test on deployed URL passes
- [ ] Approval given explicitly before next feature begins

---

## Code Quality Rules

### General
- No TODO comments in committed code — raise an issue instead
- No hardcoded values in production code (use application.yml or constants)
- No `System.out.println` — use SLF4J logger
- No `e.printStackTrace()` — log with logger and return appropriate HTTP response

### Backend (Java)
- Service layer contains business logic. Controllers are thin (validation + delegation only).
- Repositories contain only query methods. No business logic in repositories.
- All DTOs are separate from JPA entities (never return an entity directly from a controller)
- Every controller method has `@Valid` on request body parameters
- Errors return a consistent JSON shape: `{ "error": "message", "field": "fieldName" }`
- All endpoints are documented with `@Operation` (SpringDoc)

### Frontend (React)
- No inline API calls in components — all API calls go through `src/api/` modules
- No hardcoded `http://localhost:8080` URLs — always use `import.meta.env.VITE_API_BASE_URL`
- Forms show loading state while submitting and disable the submit button
- Every user-facing error shows a readable message, never a raw error object

---

## Branching Strategy

```
main          ← production-ready, deployed to Railway/Vercel
  └── feature/feature-1-shop-listing
  └── feature/feature-2-product-search
  └── feature/feature-3-reservation
  ...
```

- Work on `feature/{N}-{name}` branches
- Merge to `main` only after approval gate is passed
- Never commit directly to `main`
- Commit message format: `feat(shop): add GET /shops endpoint with active filter`

---

## CI Pipeline Rules

GitHub Actions runs on every push to a feature branch:
1. `mvn test` — unit tests
2. `mvn test -Dtest="*IntegrationTest"` — integration tests (Docker must be available)
3. `newman run postman/feature-N-*.json` — Postman collection for this feature
4. `cd frontend && npm run test` — React component tests
5. `cd frontend && npm run build` — ensure build does not break

**A PR cannot be merged if any CI step fails.**

---

## Improvement Suggestions (Over Original Plan)

These are additions beyond the original plan.md that improve the process:

1. **Testcontainers over H2:** Original plan used H2 for dev. Integration tests must use the real PostgreSQL engine to catch full-text search behavior, constraint violations, and Flyway migration issues that H2 silently ignores.

2. **Postman as a contract:** Postman collections are committed to the repo and run in CI via Newman. They serve as living API documentation and regression protection.

3. **Feature-branch deployment preview:** Consider Railway's PR environments feature — each feature branch gets its own deployed URL for testing before merge. Removes the "works locally" problem entirely.

4. **Seed data script:** Maintain a `db/seed/V99__seed_data.sql` Flyway seed migration that only runs in `dev` and `test` profiles. This gives consistent, repeatable test data locally and in CI.

5. **Error response standard:** Define a single `ApiError` response DTO used across all error cases. Postman tests assert the shape of this DTO. This prevents inconsistent error formats across features.

6. **Rate limiting from day one:** Add Bucket4j rate limiting on `POST /reservations` before go-live (not as an afterthought). 5 requests per minute per IP prevents spam without requiring CAPTCHA.

7. **Soft-delete pattern for shops:** Instead of `DELETE /admin/shops/{id}`, toggle `is_active = false`. Prevents orphaned reservation records and allows data recovery.

8. **Phone number normalization in service layer:** Normalize all phone numbers to E.164 format (`+91XXXXXXXXXX`) in `ReservationService` before saving. Prevents duplicate reservation records with differently-formatted same numbers.

9. **Audit timestamps on all tables:** Add `created_at` and `updated_at` to every table from V1 migration. Adding these later requires a migration that touches all rows — expensive if data exists.

10. **Reserve → WhatsApp flow UX:** After a customer submits a reservation, the confirmation page should have a large, prominent "Notify Shopkeeper on WhatsApp" button that opens the pre-filled message. Do not auto-trigger it — browsers block auto-opening new tabs. Make the button the primary CTA on that page.
