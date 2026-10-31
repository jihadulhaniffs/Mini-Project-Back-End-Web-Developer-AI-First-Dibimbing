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

## 💾 Karakteristik Penyimpanan Data (In-Memory Persistence)

Layanan ini menggunakan penyimpanan data *in-memory* (sesuai arahan practical modul). 
- Seluruh perubahan data (penambahan produk melalui POST, pembaruan melalui PUT/PATCH, dan penghapusan melalui DELETE) tersimpan di memori runtime selama server aktif.
- Apabila server dihentikan atau dimulai ulang (*restart*), data katalog akan otomatis kembali ke kondisi awal (*seed data* 5 produk).
- Untuk kebutuhan pengembangan persisten di masa depan, skema relasional SQL telah disediakan di berkas `database/schema.sql`.

---

## 🔄 Perbedaan Endpoint PUT dan PATCH

Layanan ini mengimplementasikan pembaruan data secara semantik sesuai standar RESTful API:
1. **PUT (`/api/products/:id`) — Penggantian Penuh (*Full Replacement*):**  
   - Klien wajib mengirimkan seluruh field produk (`name`, `category`, `price`, `description`, `image`, dan `variants`).  
   - Apabila ada field wajib yang tidak disertakan (misalnya `category`), server akan menolak request dengan status `400 Bad Request`.  
   - Seluruh nilai lama pada produk akan ditimpa dengan nilai baru yang dikirimkan.
2. **PATCH (`/api/products/:id`) — Pembaruan Parsial (*Partial Update*):**  
   - Klien cukup mengirimkan field yang ingin diubah saja (misalnya hanya `price` atau `variants.quantity`).  
   - Field lain yang tidak dikirimkan dalam request body akan tetap mempertahankan nilai sebelumnya.

---

## ✨ Fitur Utama (Key Features)

1. **Operasi CRUD Lengkap (6 Endpoint RESTful):**
   - **GET `/api/products`:** Menampilkan daftar katalog produk dengan dukungan **Pagination** (`page`, `limit`), pencarian kata kunci (`search`), filter kategori (`category`), rentang harga (`minPrice` & `maxPrice`), dan pengurutan (`sort`).
   - **GET `/api/products/:id`:** Menampilkan detail satu produk berdasarkan parameter ID.
   - **POST `/api/products`:** Menambahkan produk baru ke katalog dengan ID berurutan otomatis (*auto-generated integer ID*) dan validasi field wajib.
   - **PUT `/api/products/:id`:** Mengganti seluruh data produk yang ada (*Full Replacement*).
   - **PATCH `/api/products/:id`:** Memperbarui sebagian field data produk tertentu (*Partial Update*).
   - **DELETE `/api/products/:id`:** Menghapus produk dari katalog berdasarkan parameter ID.

2. **Arsitektur Modular & Bersih:**
   - Pemisahan tanggung jawab yang jelas antar lapisan: rute (`routes`), pengontrol (`controllers`), model data (`models`), utilitas (`utils`), dan middleware (`middlewares`).
   - Response diformat secara seragam menggunakan kelas pembantu `ApiResponse`.

3. **Validasi Ketat & Keamanan Error Handling:**
   - Validasi format URL gambar (`http://` atau `https://`).
   - Validasi varian produk: memastikan `colorOrSize` memiliki nilai valid (menolak array kosong atau teks kosong) dan `quantity` berupa bilangan bulat positif.
   - Handler 404 yang aman tanpa membocorkan daftar endpoint internal ke publik.
   - Penanganan error 500 terpusat tanpa mengirimkan pesan error internal mentah ke klien.

4. **Dokumentasi API Ganda:**
   - Antarmuka interaktif **Swagger UI** langsung di browser via `/api-docs`.
   - File koleksi **Postman v2.1** lengkap dengan contoh response tersimpan (*saved examples*) dan script pengujian otomatis (*test assertions*).

---

## 📂 Struktur Folder Proyek

```text
Mini Project WEB AI/
├── src/
│   ├── data/
│   │   └── products.js         # Seed data awal katalog produk (5 produk)
│   ├── models/
│   │   └── productModel.js     # Logika data in-memory, pagination & query filter
│   ├── controllers/
│   │   └── productController.js# Pengontrol HTTP request & response
│   ├── middlewares/
│   │   ├── validation.js       # Validasi input request body (POST, PUT, PATCH)
│   │   └── errorHandler.js     # Middleware terpusat untuk 404 & 500 error
│   ├── routes/
│   │   └── productRoutes.js    # Definisi rute Express /api/products
│   ├── utils/
│   │   └── apiResponse.js      # Kelas standarisasi format response JSON
│   ├── docs/
│   │   └── swaggerSpec.js      # Spesifikasi OpenAPI 3.0.0
│   └── app.js                  # Konfigurasi Express, CORS, Swagger UI, & routing
├── database/
│   └── schema.sql              # Referensi skema SQL relasional (DDL & DML seed)
├── postman/
│   └── Dibimbing_Product_Catalog_API.postman_collection.json # Koleksi Postman v2.1
├── test-api.js                 # Skrip pengujian otomatis menyeluruh (19 uji fungsional)
├── server.js                   # Entry point aplikasi
├── package.json                # Konfigurasi dependensi dan skrip proyek
├── .gitignore                  # Berkas pengabaian git
└── README.md                   # Dokumentasi teknis proyek
```

---

## 🛠️ Prasyarat & Instalasi

Pastikan **Node.js** (versi 16 atau lebih baru) telah terpasang.

1. Buka terminal pada direktori proyek.
2. Pasang dependensi:
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
- **Swagger UI (Dokumentasi Interaktif):** `http://localhost:3000/api-docs`
- **Raw OpenAPI Spec:** `http://localhost:3000/api-docs.json`
- **Health Check:** `http://localhost:3000/health`
- **Endpoint Produk:** `http://localhost:3000/api/products`

---

## 🧪 Pengujian Otomatis

Proyek ini dilengkapi rangkaian pengujian fungsional otomatis untuk memverifikasi setiap endpoint dan skenario validasi:
```bash
npm test
```
*Hasil pengujian akan memverifikasi 19 skenario tes secara otomatis (100% Pass).*

---

## 📖 Spesifikasi Endpoint REST API

| Method | Endpoint | Deskripsi | Status Code Sukses | Status Code Gagal |
| :---: | :--- | :--- | :---: | :---: |
| **GET** | `/api/products` | Mengambil daftar produk (dukung query `page`, `limit`, `search`, `category`, `minPrice`, `maxPrice`, `sort`) | `200 OK` | `400 Bad Request` |
| **GET** | `/api/products/:id` | Mengambil detail satu produk berdasarkan ID | `200 OK` | `404 Not Found` |
| **POST** | `/api/products` | Menambahkan produk baru (semua field wajib diisi) | `201 Created` | `400 Bad Request` |
| **PUT** | `/api/products/:id` | Mengganti seluruh data produk yang ada (*Full Replacement*) | `200 OK` | `400` / `404` |
| **PATCH** | `/api/products/:id` | Mengubah sebagian field data produk (*Partial Update*) | `200 OK` | `400` / `404` |
| **DELETE** | `/api/products/:id` | Menghapus produk dari katalog berdasarkan ID | `200 OK` | `404 Not Found` |

---

## 📝 Format Data & Contoh Request / Response

### Struktur Objek Produk:
```json
{
  "id": 1,
  "name": "Headphone Wireless Noise Cancelling Pro",
  "category": "Elektronik",
  "price": 750000,
  "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  "images": [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
  ],
  "variants": {
    "colorOrSize": ["Hitam", "Silver", "Midnight Blue"],
    "quantity": 15
  },
  "description": "Headphone over-ear nirkabel dengan ANC dan baterai 30 jam."
}
```

### Contoh Response GET `/api/products?page=1&limit=10`:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Daftar produk berhasil diambil.",
  "pagination": {
    "totalItems": 5,
    "currentPage": 1,
    "totalPages": 1,
    "limit": 10
  },
  "filtersApplied": {
    "search": null,
    "category": null,
    "minPrice": null,
    "maxPrice": null,
    "sort": null
  },
  "data": [
    {
      "id": 1,
      "name": "Headphone Wireless Noise Cancelling Pro",
      "category": "Elektronik",
      "price": 750000,
      "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      "images": [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
      ],
      "variants": {
        "colorOrSize": ["Hitam", "Silver", "Midnight Blue"],
        "quantity": 15
      },
      "description": "Headphone over-ear nirkabel dengan ANC dan baterai 30 jam."
    }
  ]
}
```

---

## 📮 Panduan Pengujian via Postman

1. Buka aplikasi **Postman**.
2. Klik tombol **Import** pada menu navigasi.
3. Pilih berkas:  
   `postman/Dibimbing_Product_Catalog_API.postman_collection.json`
4. Koleksi akan memuat 6 endpoint utama lengkap dengan script pengujian otomatis (*Tests*) dan contoh response sukses maupun error (*Saved Examples*).

---

## 🌐 Panduan Pengujian via Swagger UI

1. Jalankan server dengan perintah `npm start`.
2. Buka browser dan kunjungi alamat:  
   `http://localhost:3000/api-docs`
3. Seluruh skema data, parameter pagination, filter, serta operasi CRUD dapat diuji secara interaktif langsung melalui tombol **"Try it out"**.
