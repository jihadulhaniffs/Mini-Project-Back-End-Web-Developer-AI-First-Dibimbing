# E-Commerce Product Catalog REST API
> **Dibimbing Back-End Web Development Bootcamp — Mini Project Back-End**  
> **Topik:** Modern Back-End Development with AI (E-Commerce Catalog Service)  
> **Student:** Jihadul Hanif  

---

## 🤖 Pernyataan Penggunaan AI (AI Usage Disclosure)

Dalam penyusunan proyek ini, Artificial Intelligence (AI) coding assistant dimanfaatkan sebagai sarana interaktif untuk sesi tanya-jawab konseptual, eksplorasi praktik terbaik (*best practices*), serta penjelasan alur kerja (*workflow*) arsitektur sistem backend. Seluruh perancangan logika bisnis, struktur modular, validasi data, pengujian fungsional, dan pemahaman alur eksekusi ditinjau serta diverifikasi secara mandiri untuk memastikan integritas dan kualitas kode.

---

## 📌 Deskripsi Proyek

Proyek ini merupakan implementasi layanan **REST API E-Commerce Catalog Service** menggunakan **JavaScript (Node.js & Express.js)** dengan arsitektur modular (*Layered Architecture*) yang terstruktur, efisien, dan mudah dipelihara.

Layanan ini mengelola data katalog produk secara *in-memory* dengan operasi **CRUD (Create, Read, Update, Delete)** lengkap, disertai validasi input yang ketat, penanganan error terpusat (*centralized error handling*), dokumentasi interaktif **Swagger / OpenAPI 3.0**, serta **Postman Collection v2.1** untuk pengujian menyeluruh.

---

## ✨ Fitur Utama (Key Features)

1. **Operasi CRUD Lengkap:**
   - **GET (Membaca Data):** Menampilkan seluruh katalog produk dengan dukungan pencarian kata kunci (*search*), filter kategori, rentang harga (*minPrice* & *maxPrice*), dan pengurutan (*sorting*), serta endpoint detail produk berdasarkan ID.
   - **POST (Menambah Data):** Menambahkan produk baru ke katalog dengan ID berurutan otomatis (*auto-generated ID*) dan validasi field wajib.
   - **PUT (Memperbarui Seluruh Data):** Mengganti seluruh data produk yang ada (*Full Replacement*) dengan validasi kelengkapan field.
   - **PATCH (Memperbarui Parsial):** Mengubah sebagian field data produk tertentu secara fleksibel.
   - **DELETE (Menghapus Data):** Menghapus produk dari katalog berdasarkan parameter ID.

2. **Arsitektur Modular & Bersih:**
   - Pemisahan tanggung jawab yang jelas antara lapisan rute (*routes*), pengontrol (*controllers*), model data (*models*), dan *middlewares*.

3. **Validasi & Penanganan Error Terpusat:**
   - Pengecekan tipe data, harga non-negatif, kelengkapan varian produk, serta proteksi terhadap format JSON yang rusak (*malformed JSON*).
   - Penggunaan status code HTTP standar industri (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`).

4. **Dokumentasi API Ganda:**
   - Antarmuka interaktif **Swagger UI** langsung di browser.
   - File koleksi **Postman v2.1** siap pakai untuk pengujian otomatis maupun manual.

---

## 📂 Struktur Folder Proyek

```text
Mini Project WEB AI/
├── src/
│   ├── data/
│   │   └── products.js         # Seed data awal katalog produk (hardcoded 5 produk)
│   ├── models/
│   │   └── productModel.js     # Logika abstraksi data in-memory & query filter
│   ├── controllers/
│   │   └── productController.js# Pengontrol HTTP request & penentuan status code
│   ├── middlewares/
│   │   ├── validation.js       # Validasi input request body (POST, PUT, PATCH)
│   │   └── errorHandler.js     # Middleware terpusat untuk 404 & 500 error
│   ├── routes/
│   │   └── productRoutes.js    # Definisi rute Express /api/products
│   ├── docs/
│   │   └── swaggerSpec.js      # Spesifikasi OpenAPI 3.0.0
│   └── app.js                  # Konfigurasi Express, CORS, Swagger UI, & routing
├── database/
│   └── schema.sql              # Referensi skema SQL relasional (DDL & DML seed)
├── postman/
│   └── Dibimbing_Product_Catalog_API.postman_collection.json # Koleksi Postman v2.1
├── test-api.js                 # Skrip pengujian otomatis (13 uji fungsional)
├── server.js                   # Entry point aplikasi
├── package.json                # Konfigurasi dependensi dan skrip proyek
├── .gitignore                  # Berkas pengabaian git
└── README.md                   # Dokumentasi teknis proyek
```

---

## 🛠️ Prasyarat & Instalasi

Pastikan **Node.js** (versi 16 atau lebih baru) telah terpasang.

1. Buka terminal pada direktori proyek.
2. Pasang dependensi yang diperlukan:
   ```bash
   npm install
   ```

---

## 🚀 Menjalankan Server

Jalankan perintah berikut:
```bash
npm start
```
Server akan aktif pada: **`http://localhost:3000`**

Daftar akses cepat:
- **Informasi Servis:** `http://localhost:3000/`
- **Swagger UI (Dokumentasi Interaktif):** `http://localhost:3000/api-docs`
- **Raw OpenAPI Spec:** `http://localhost:3000/api-docs.json`
- **Endpoint Produk:** `http://localhost:3000/api/products`

---

## 🧪 Pengujian Otomatis

Proyek ini dilengkapi rangkaian pengujian fungsional otomatis untuk memverifikasi setiap endpoint:
```bash
npm test
```
*Hasil pengujian akan memverifikasi 13 skenario tes sekaligus dengan hasil 100% Pass.*

---

## 📖 Spesifikasi Endpoint REST API

| Method | Endpoint | Deskripsi | Status Code Sukses | Status Code Gagal |
| :---: | :--- | :--- | :---: | :---: |
| **GET** | `/api/products` | Mengambil seluruh daftar produk (dukung query `search`, `category`, `minPrice`, `maxPrice`, `sort`) | `200 OK` | `400 Bad Request` |
| **GET** | `/api/products/:id` | Mengambil detail satu produk berdasarkan ID | `200 OK` | `404 Not Found` |
| **POST** | `/api/products` | Menambahkan produk baru dengan validasi data | `201 Created` | `400 Bad Request` |
| **PUT** | `/api/products/:id` | Mengganti seluruh data produk yang ada | `200 OK` | `400` / `404` |
| **PATCH** | `/api/products/:id` | Mengubah sebagian field data produk | `200 OK` | `400` / `404` |
| **DELETE** | `/api/products/:id` | Menghapus produk dari katalog berdasarkan ID | `200 OK` | `404 Not Found` |

---

## 📝 Format Data & Contoh Request / Response

Struktur objek data produk:
```json
{
  "id": 1,
  "name": "Headphone Wireless Noise Cancelling Pro",
  "category": "Elektronik",
  "price": 750000,
  "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  "variants": {
    "colorOrSize": ["Hitam", "Silver", "Midnight Blue"],
    "quantity": 15
  },
  "description": "Headphone over-ear nirkabel dengan ANC dan baterai 30 jam."
}
```

### Contoh POST `/api/products` (Tambah Produk)
**Request Body:**
```json
{
  "name": "Keyboard Mechanical RGB Hot-Swappable",
  "category": "Elektronik",
  "price": 650000,
  "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
  "variants": {
    "colorOrSize": ["Red Switch", "Blue Switch", "Brown Switch"],
    "quantity": 20
  },
  "description": "Keyboard mechanical 75% dengan konektivitas Bluetooth 5.0 dan baterai 4000mAh."
}
```

**Response `201 Created`:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Produk baru berhasil ditambahkan ke katalog.",
  "data": {
    "id": 6,
    "name": "Keyboard Mechanical RGB Hot-Swappable",
    "category": "Elektronik",
    "price": 650000,
    "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    "variants": {
      "colorOrSize": ["Red Switch", "Blue Switch", "Brown Switch"],
      "quantity": 20
    },
    "description": "Keyboard mechanical 75% dengan konektivitas Bluetooth 5.0 dan baterai 4000mAh."
  }
}
```

---

## 📮 Panduan Pengujian via Postman

1. Buka aplikasi **Postman**.
2. Klik tombol **Import** pada menu navigasi.
3. Pilih berkas:  
   `postman/Dibimbing_Product_Catalog_API.postman_collection.json`
4. Koleksi **Dibimbing - E-Commerce Product Catalog REST API** akan muncul di sidebar dengan 11 request pengujian yang siap dieksekusi ke `http://localhost:3000`.

---

## 🌐 Panduan Pengujian via Swagger UI

1. Jalankan server dengan perintah `npm start`.
2. Buka browser dan arahkan ke alamat:  
   `http://localhost:3000/api-docs`
3. Pengujian dapat dilakukan langsung melalui tombol **"Try it out"** pada masing-masing endpoint.
