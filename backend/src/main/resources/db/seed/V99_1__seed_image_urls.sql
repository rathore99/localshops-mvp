-- Seed image URLs for dev shops — runs only on dev profile.
-- Uses Unsplash CDN: free, no API key, crop to 800x400 banner size.
UPDATE shops SET image_url = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=400&fit=crop&q=80' WHERE name = 'Shri Fashion';
UPDATE shops SET image_url = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop&q=80' WHERE name = 'Bharat Kirana Store';
UPDATE shops SET image_url = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=400&fit=crop&q=80' WHERE name = 'Ravi Electronics';
UPDATE shops SET image_url = 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&h=400&fit=crop&q=80' WHERE name = 'Om Medical Store';
UPDATE shops SET image_url = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=400&fit=crop&q=80' WHERE name = 'Ganesh Hardware';
