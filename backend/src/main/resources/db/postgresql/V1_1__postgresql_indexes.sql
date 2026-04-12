-- PostgreSQL-specific indexes
-- Location: db/postgresql/ — a sibling of db/migration/, NOT inside it.
-- Flyway scans locations recursively, so placing this inside db/migration/
-- would cause it to run against H2 in the dev profile too.
--
-- This file is only included via application-prod.yml:
--   spring.flyway.locations: classpath:db/migration,classpath:db/postgresql
--
-- Dev profile (H2) only uses classpath:db/migration and classpath:db/seed —
-- it never sees this directory.

-- GIN full-text search index on product name.
-- Enables fast to_tsvector() search used in ProductRepository.searchByName().
CREATE INDEX idx_products_name_search
    ON products USING gin(to_tsvector('english', name));
