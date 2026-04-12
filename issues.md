# Issues Log

> Running record of bugs, errors, and their resolutions.
> Format: one section per issue, newest at the top.

---

## #2 — GIN index in V1 migration fails on H2 (dev profile)

**Date:** 2026-04-12
**Status:** Fixed
**File:** `backend/src/main/resources/db/migration/V1__initial_schema.sql`

### Error

```
SQL State  : 42001
Error Code : 42001
Message    : Syntax error in SQL statement
  "CREATE INDEX idx_products_name_search ON products USING [*]gin(to_tsvector('english', name))";
  expected "BTREE, HASH, RTREE"
Location   : db/migration/V1__initial_schema.sql — Line 51
```

### Root Cause

H2 (used in the `dev` profile via `application-dev.yml`) only supports
`BTREE`, `HASH`, and `RTREE` index types. The `GIN` index type and the
`to_tsvector()` function are **PostgreSQL-specific** and do not exist in H2,
even in H2's `MODE=PostgreSQL` compatibility mode.

Flyway runs all files in `classpath:db/migration` against whatever datasource
is active. When running locally with the `dev` profile, Flyway hits H2 and
fails on the GIN index in `V1`.

### What Does NOT Work

- H2 `MODE=PostgreSQL` does not add GIN index support — it only handles a
  subset of SQL syntax differences.
- Wrapping the statement in a `BEGIN/EXCEPTION` block inside a migration file
  is not portable across Flyway versions.

### Fix

**Split the index into a PostgreSQL-only migration location.**

1. **Remove** the GIN index line from `V1__initial_schema.sql`
   (all remaining indexes are BTREE — compatible with H2 and PostgreSQL).

2. **Create** `db/migration/postgresql/V1_1__postgresql_indexes.sql`
   containing only the GIN index.

3. **Add** the postgresql subfolder to `spring.flyway.locations` in
   `application-prod.yml` only. The dev profile never sees this folder.

**Migration locations per profile:**

| Profile | `spring.flyway.locations` |
|---|---|
| `dev` (H2) | `classpath:db/migration, classpath:db/seed` |
| `prod` (PostgreSQL) | `classpath:db/migration, classpath:db/migration/postgresql` |

**V1_1__postgresql_indexes.sql (prod only):**
```sql
CREATE INDEX idx_products_name_search
    ON products USING gin(to_tsvector('english', name));
```

### Verification

```bash
cd backend
mvn validate         # project parses cleanly
mvn spring-boot:run -Dspring-boot.run.profiles=dev
# App starts, Flyway runs V1 against H2 — no GIN index error
# GET http://localhost:8080/api/v1/health → { "status": "UP" }
```

### Impact on Search (Feature 2)

The GIN index is a **performance index only** — `ProductRepository.searchByName()`
will still work on PostgreSQL without it (via a sequential scan). The index
makes full-text search fast at scale. On H2 (dev/test), the search query uses
`ILIKE` fallback instead of `to_tsvector` since H2 doesn't support it anyway.

---

## #1 — `flyway-database-postgresql` version missing in pom.xml

**Date:** 2026-04-12
**Status:** Fixed
**File:** `backend/pom.xml`

### Error

```
[ERROR] 'dependencies.dependency.version' for
org.flywaydb:flyway-database-postgresql:jar is missing. @ line 51, column 21
```

### Root Cause

`flyway-database-postgresql` is a **Flyway 10+** artifact. Flyway 10 split
database-specific drivers into separate optional modules, and
`flyway-database-postgresql` is one of them.

Spring Boot 3.2.x manages **Flyway 9.22.x** via its dependency BOM
(`spring-boot-dependencies`). Because `flyway-database-postgresql` does not
exist in Flyway 9.x, it is not listed in the Spring Boot BOM and has no managed
version. Maven therefore throws a missing-version error.

### What Does NOT Work

Adding `flyway-database-postgresql` without a `<version>` tag when the Spring
Boot parent is 3.2.x. Even though Flyway's own BOM for 10.x manages this
artifact, Spring Boot 3.2 never pulls in Flyway 10.

### Fix

Remove `flyway-database-postgresql` entirely from `pom.xml`.
`flyway-core` 9.x includes built-in PostgreSQL dialect support — no separate
artifact is required.

**Before:**
```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-database-postgresql</artifactId>   <!-- removed -->
</dependency>
```

**After:**
```xml
<!-- flyway-core 9.x bundles PostgreSQL support — flyway-database-postgresql
     is a Flyway 10+ only artifact, not available in Spring Boot 3.2.x BOM -->
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

### Verification

```bash
cd backend
mvn validate   # → BUILD SUCCESS
```

### When Would flyway-database-postgresql Be Needed?

Only if we upgrade to **Spring Boot 3.3+** (which manages Flyway 10.x).
In that case, add it back without a version tag — the Spring Boot BOM will
manage the correct Flyway 10.x version automatically.

```xml
<!-- Only for Spring Boot 3.3+ / Flyway 10+ -->
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-database-postgresql</artifactId>
</dependency>
```

---
