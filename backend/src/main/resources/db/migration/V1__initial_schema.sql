-- LocalShops initial schema
-- V1: shops, products, reservations, admin_users

CREATE TABLE shops (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(150)  NOT NULL,
    category    VARCHAR(100)  NOT NULL,
    phone       VARCHAR(15)   NOT NULL,
    address     TEXT          NOT NULL,
    town        VARCHAR(100)  NOT NULL DEFAULT 'Singrauli',
    description TEXT,
    is_active   BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
    id           BIGSERIAL PRIMARY KEY,
    shop_id      BIGINT        NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    name         VARCHAR(200)  NOT NULL,
    description  TEXT,
    price        NUMERIC(10,2),
    is_available BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE reservations (
    id              BIGSERIAL    PRIMARY KEY,
    shop_id         BIGINT       NOT NULL REFERENCES shops(id),
    customer_name   VARCHAR(150) NOT NULL,
    customer_phone  VARCHAR(15)  NOT NULL,
    items_text      TEXT         NOT NULL,
    notes           TEXT,
    status          VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE admin_users (
    id            BIGSERIAL    PRIMARY KEY,
    username      VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_shops_is_active        ON shops(is_active);
CREATE INDEX idx_shops_category         ON shops(category);
CREATE INDEX idx_products_shop_id       ON products(shop_id);
CREATE INDEX idx_products_name_search   ON products USING gin(to_tsvector('english', name));
CREATE INDEX idx_reservations_shop_id   ON reservations(shop_id);
CREATE INDEX idx_reservations_status    ON reservations(status);
