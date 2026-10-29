-- database/schema.sql
-- Skema Database Relasional (SQL) untuk E-Commerce Product Catalog Service
-- Disediakan sebagai referensi arsitektur data persisten.

-- 1. Buat Tabel Produk Utama
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'General',
    price DECIMAL(12, 2) NOT NULL CHECK (price >= 0),
    image TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Buat Tabel Relasi Variasi Produk
CREATE TABLE IF NOT EXISTS product_variants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    color_or_size VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 3. Seed Data Awal (DML)
INSERT INTO products (id, name, category, price, image, description) VALUES
(1, 'Headphone Wireless Noise Cancelling Pro', 'Elektronik', 750000, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', 'Headphone over-ear nirkabel dengan teknologi ANC dan baterai 30 jam.'),
(2, 'Speaker Bluetooth Mini Portable Waterproof IPX7', 'Elektronik', 350000, 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80', 'Speaker portable ringkas tahan air IPX7 dengan bass dinamis 360 derajat.'),
(3, 'Smartwatch Fitness Tracker Amoled Display', 'Elektronik', 1200000, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', 'Jam tangan pintar layar sentuh AMOLED dengan sensor detak jantung dan SpO2.'),
(4, 'Tas Ransel Laptop Ergonomis Anti Air', 'Aksesoris', 285000, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', 'Tas ransel laptop hingga 15.6 inci berbahan oxford waterproof.'),
(5, 'Kaos Polos Premium Cotton Combed 30s', 'Pakaian', 85000, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', 'Kaos polos 100% katun combed 30s berkualitas tinggi yang adem dan halus.');

INSERT INTO product_variants (product_id, color_or_size, quantity) VALUES
(1, 'Hitam', 5),
(1, 'Silver', 5),
(1, 'Midnight Blue', 5),
(2, 'Matte Black', 10),
(2, 'Ocean Blue', 15),
(3, 'Space Gray', 4),
(3, 'Rose Gold', 6),
(4, 'Hitam Karbon', 15),
(4, 'Abu-Abu Elegan', 15),
(5, 'S', 10),
(5, 'M', 15),
(5, 'L', 15),
(5, 'XL', 10);

