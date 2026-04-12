-- PostgreSQL-specific indexes
-- This file runs ONLY in the prod profile (application-prod.yml includes
-- classpath:db/migration/postgresql in spring.flyway.locations).
-- H2 does not run this file — it is not in the dev flyway locations.

-- GIN full-text search index on product name.
-- Used by ProductRepository.searchByName() native query in Feature 2.
CREATE INDEX idx_products_name_search
    ON products USING gin(to_tsvector('english', name));
