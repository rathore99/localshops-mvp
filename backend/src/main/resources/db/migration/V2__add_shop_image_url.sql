-- Add optional image URL to shops.
-- Nullable — existing shops keep working; image shown when present.
ALTER TABLE shops ADD COLUMN image_url VARCHAR(500);
