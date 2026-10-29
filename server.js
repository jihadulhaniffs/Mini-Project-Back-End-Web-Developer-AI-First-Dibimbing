/**
 * server.js
 * Entry point untuk menjalankan E-Commerce Product Catalog REST API.
 * Jalankan dengan perintah: npm start atau node server.js
 */

'use strict';

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log('\n' + '='.repeat(68));
  console.log(`🚀 E-COMMERCE PRODUCT CATALOG REST API TELAH AKTIF`);
  console.log('='.repeat(68));
  console.log(`📍 Base URL        : http://localhost:${PORT}`);
  console.log(`📖 Swagger UI Docs : http://localhost:${PORT}/api-docs`);
  console.log(`📄 Raw OpenAPI Spec: http://localhost:${PORT}/api-docs.json`);
  console.log('-'.repeat(68));
  console.log('📌 Endpoint REST API Tersedia:');
  console.log(`  [GET]    /api/products           (Ambil semua produk, filter & sort)`);
  console.log(`  [GET]    /api/products/:id       (Ambil detail produk berdasarkan ID)`);
  console.log(`  [POST]   /api/products           (Tambah produk baru - API PUSH)`);
  console.log(`  [PUT]    /api/products/:id       (Ganti seluruh data produk)`);
  console.log(`  [PATCH]  /api/products/:id       (Ubah sebagian data produk)`);
  console.log(`  [DELETE] /api/products/:id       (Hapus produk dari katalog)`);
  console.log('='.repeat(68) + '\n');
});

module.exports = server;

