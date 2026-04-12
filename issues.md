# Issues Log

> Running record of bugs, errors, and their resolutions.
> Format: one section per issue, newest at the top.

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
