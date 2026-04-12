-- Seed data — runs only on dev profile
-- Flyway location: classpath:db/seed (configured in application-dev.yml only)

INSERT INTO shops (name, category, phone, address, town, description, is_active) VALUES
    ('Shri Fashion',        'Apparel',     '9876543210', 'Gandhi Chowk, Main Road',   'Singrauli', 'Ready-to-wear kurtas, shirts, sarees and kids wear.',    TRUE),
    ('Bharat Kirana Store', 'Groceries',   '9812345678', 'Nehru Nagar, Near Temple',  'Singrauli', 'Daily groceries, snacks, spices and household items.',   TRUE),
    ('Ravi Electronics',    'Electronics', '9898765432', 'Station Road, Block Market','Singrauli', 'Mobile phones, accessories, repairs and recharges.',      TRUE),
    ('Om Medical Store',    'Pharmacy',    '9765432100', 'Civil Lines, Near Hospital', 'Singrauli', 'Medicines, health products and first aid supplies.',      TRUE),
    ('Ganesh Hardware',     'Hardware',    '9654321098', 'Industrial Area, Gate 2',    'Singrauli', 'Tools, pipes, cement and construction materials.',        TRUE),
    ('Closed Test Shop',    'Apparel',     '9000000001', 'Nowhere Street',             'Singrauli', 'This shop is inactive for testing.',                      FALSE);

-- Products for Shri Fashion (id=1)
INSERT INTO products (shop_id, name, description, price, is_available) VALUES
    (1, 'Blue Cotton Shirt',    'Men''s regular fit, sizes S-XL',      599.00, TRUE),
    (1, 'Black Formal Trousers','Slim fit formal trousers',            899.00, TRUE),
    (1, 'Floral Kurti',         'Women''s cotton kurti, all sizes',    449.00, TRUE),
    (1, 'Kids School Uniform',  'White shirt + grey pants combo',      350.00, FALSE);

-- Products for Bharat Kirana Store (id=2)
INSERT INTO products (shop_id, name, description, price, is_available) VALUES
    (2, 'Tata Salt 1kg',        'Iodised salt',                         20.00, TRUE),
    (2, 'Aashirvaad Atta 5kg',  'Whole wheat flour',                   250.00, TRUE),
    (2, 'Maggi Noodles Pack',   'Pack of 12',                          132.00, TRUE),
    (2, 'Saffola Oil 1L',       'Refined sunflower oil',               150.00, FALSE);

-- Products for Ravi Electronics (id=3)
INSERT INTO products (shop_id, name, description, price, is_available) VALUES
    (3, 'Redmi 12 Mobile',      '6GB RAM, 128GB storage',            9999.00, TRUE),
    (3, 'boAt Type-C Cable',    '1.5m fast charging cable',            299.00, TRUE),
    (3, 'Screen Guard Tempered','Universal fit',                        99.00, TRUE),
    (3, 'JBL Earphones',        'Wired, 3.5mm jack',                  699.00, FALSE);

-- Products for Om Medical Store (id=4)
INSERT INTO products (shop_id, name, description, price, is_available) VALUES
    (4, 'Dettol Antiseptic 250ml','Liquid antiseptic',                 120.00, TRUE),
    (4, 'Paracetamol Strip',    '10 tablets',                          20.00, TRUE),
    (4, 'Bandage Rolls',        'Pack of 5',                           45.00, TRUE);

-- Products for Ganesh Hardware (id=5)
INSERT INTO products (shop_id, name, description, price, is_available) VALUES
    (5, 'Hammer 500g',          'Wooden handle',                       180.00, TRUE),
    (5, 'PVC Pipe 1 inch 3m',   'Water supply grade',                  85.00, TRUE),
    (5, 'White Cement 2kg',     'Birla White',                        120.00, FALSE);
