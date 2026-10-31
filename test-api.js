/**
 * test-api.js
 * Script pengujian otomatis untuk memverifikasi seluruh endpoint REST API:
 * Health check, GET (Pagination, Filter, Sort), POST (Validasi ketat),
 * PUT (Full Replacement), PATCH (Partial Update), DELETE, Error Handling, dan Swagger Docs.
 * Jalankan dengan: npm test
 */

'use strict';

const app = require('./src/app');

const TEST_PORT = 3001;
let server;

async function request(path, options = {}) {
  const url = `http://localhost:${TEST_PORT}${path}`;
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  return { status: response.status, data };
}

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    console.error(`  ❌ [FAIL] ${testName}`);
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 MEMULAI PENGUJIAN OTOMATIS REST API');
  console.log('======================================================\n');

  server = app.listen(TEST_PORT);

  try {
    // 1. Health Check
    console.log('📌 1. Pengujian Health Check');
    const healthRes = await request('/health');
    assert(healthRes.status === 200 && healthRes.data.status === 'UP', 'GET /health mengembalikan status 200 dan UP');

    // 2. GET All Products dengan Pagination
    console.log('\n📌 2. Pengujian GET /api/products (List, Pagination & Filter)');
    const allRes = await request('/api/products?page=1&limit=5');
    assert(
      allRes.status === 200 &&
      allRes.data.success === true &&
      allRes.data.pagination.totalItems >= 5 &&
      Array.isArray(allRes.data.data),
      'GET /api/products mengembalikan struktur response standar dengan pagination'
    );

    // 3. GET All Products dengan Filter & Sort
    const filterRes = await request('/api/products?search=wireless&category=Elektronik&sort=price_asc');
    assert(
      filterRes.status === 200 &&
      filterRes.data.filtersApplied.search === 'wireless' &&
      filterRes.data.filtersApplied.category === 'Elektronik' &&
      filterRes.data.data.length > 0,
      'GET /api/products dengan query search, category, dan sort berhasil'
    );

    // 4. GET All Products Validasi Parameter Batas (Page/Limit/Price)
    const invalidQueryRes = await request('/api/products?page=0&limit=200');
    assert(invalidQueryRes.status === 400, 'GET /api/products menolak nilai parameter page/limit tidak valid');

    // 5. GET Product By ID (200 OK)
    console.log('\n📌 3. Pengujian GET /api/products/:id (Detail Produk)');
    const singleRes = await request('/api/products/1');
    assert(singleRes.status === 200 && singleRes.data.data.id === 1, 'GET /api/products/1 mengembalikan detail produk ID 1');

    // 6. GET Product By ID (404 Not Found)
    const notFoundRes = await request('/api/products/999');
    assert(notFoundRes.status === 404 && notFoundRes.data.success === false, 'GET /api/products/999 mengembalikan status 404');

    // 7. POST /api/products (201 Created)
    console.log('\n📌 4. Pengujian POST /api/products (Tambah Produk Baru)');
    const newProductPayload = {
      name: 'Mechanical Gaming Keyboard RGB',
      category: 'Elektronik',
      price: 650000,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
      variants: {
        colorOrSize: ['Blue Switch', 'Red Switch'],
        quantity: 15
      },
      description: 'Keyboard mechanical responsif dengan RGB backlit dan hot-swappable switch.'
    };
    const postRes = await request('/api/products', {
      method: 'POST',
      body: JSON.stringify(newProductPayload)
    });
    assert(postRes.status === 201 && postRes.data.data.name === newProductPayload.name, 'POST /api/products berhasil membuat produk baru (status 201)');
    const createdId = postRes.data.data.id;

    // 8. POST Validasi Gagal: Field Hilang
    const missingFieldRes = await request('/api/products', {
      method: 'POST',
      body: JSON.stringify({ name: 'Tanpa Kategori', price: 10000 })
    });
    assert(missingFieldRes.status === 400, 'POST tanpa category dan description mengembalikan 400');

    // 9. POST Validasi Gagal: Format URL Salah
    const invalidUrlRes = await request('/api/products', {
      method: 'POST',
      body: JSON.stringify({
        ...newProductPayload,
        image: 'bukan-url-valid'
      })
    });
    assert(invalidUrlRes.status === 400, 'POST dengan format image bukan URL (http/https) ditolak dengan status 400');

    // 10. POST Validasi Gagal: Array Varian Kosong
    const emptyVariantsRes = await request('/api/products', {
      method: 'POST',
      body: JSON.stringify({
        ...newProductPayload,
        variants: { colorOrSize: [], quantity: 5 }
      })
    });
    assert(emptyVariantsRes.status === 400, 'POST dengan variants.colorOrSize berupa array kosong ditolak dengan status 400');

    // 11. PUT /api/products/:id (200 OK - Full Replacement)
    console.log('\n📌 5. Pengujian PUT /api/products/:id (Full Replacement)');
    const putPayload = {
      name: 'Mechanical Gaming Keyboard RGB V2 Pro',
      category: 'Elektronik',
      price: 720000,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
      variants: {
        colorOrSize: ['Brown Switch', 'Silver Speed'],
        quantity: 25
      },
      description: 'Keyboard mechanical versi pembaruan dengan peredam busa EVA.'
    };
    const putRes = await request(`/api/products/${createdId}`, {
      method: 'PUT',
      body: JSON.stringify(putPayload)
    });
    assert(
      putRes.status === 200 &&
      putRes.data.data.name === putPayload.name &&
      putRes.data.data.price === 720000,
      'PUT /api/products/:id berhasil mengganti seluruh data produk (status 200)'
    );

    // 12. PUT Validasi Gagal: Category Tidak Disertakan (Membuktikan Full Replacement)
    const putMissingCategoryRes = await request(`/api/products/${createdId}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: 'Keyboard Tanpa Kategori',
        price: 500000,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
        variants: { colorOrSize: ['Red'], quantity: 10 },
        description: 'Test full replacement'
      })
    });
    assert(putMissingCategoryRes.status === 400, 'PUT mewajibkan seluruh field termasuk category (status 400)');

    // 13. PUT 404 Not Found
    const putNotFoundRes = await request('/api/products/999', {
      method: 'PUT',
      body: JSON.stringify(putPayload)
    });
    assert(putNotFoundRes.status === 404, 'PUT /api/products/999 mengembalikan status 404');

    // 14. PATCH /api/products/:id (200 OK - Partial Update)
    console.log('\n📌 6. Pengujian PATCH /api/products/:id (Partial Update)');
    const patchRes = await request(`/api/products/${createdId}`, {
      method: 'PATCH',
      body: JSON.stringify({ price: 699000 })
    });
    assert(
      patchRes.status === 200 &&
      patchRes.data.data.price === 699000 &&
      patchRes.data.data.name === putPayload.name,
      'PATCH /api/products/:id berhasil mengubah sebagian field tanpa mengubah field lain'
    );

    // 15. PATCH 404 Not Found
    const patchNotFoundRes = await request('/api/products/999', {
      method: 'PATCH',
      body: JSON.stringify({ price: 100000 })
    });
    assert(patchNotFoundRes.status === 404, 'PATCH /api/products/999 mengembalikan status 404');

    // 16. DELETE /api/products/:id (200 OK)
    console.log('\n📌 7. Pengujian DELETE /api/products/:id');
    const deleteRes = await request(`/api/products/${createdId}`, {
      method: 'DELETE'
    });
    assert(deleteRes.status === 200 && deleteRes.data.data.id === createdId, 'DELETE /api/products/:id berhasil menghapus produk (status 200)');

    // 17. DELETE 404 Not Found
    const deleteNotFoundRes = await request('/api/products/999', {
      method: 'DELETE'
    });
    assert(deleteNotFoundRes.status === 404, 'DELETE /api/products/999 mengembalikan status 404');

    // 18. Security Check: 404 Handler Tidak Membocorkan Endpoint
    console.log('\n📌 8. Pengujian Keamanan Penanganan Error');
    const unknownRouteRes = await request('/api/unknown-endpoint');
    assert(
      unknownRouteRes.status === 404 &&
      !unknownRouteRes.data.availableEndpoints,
      'Handler 404 aman dan tidak membocorkan daftar endpoint internal'
    );

    // 19. Swagger Docs OpenAPI 3.0
    console.log('\n📌 9. Pengujian Spesifikasi OpenAPI / Swagger');
    const swaggerJsonRes = await request('/api-docs.json');
    assert(swaggerJsonRes.status === 200 && swaggerJsonRes.data.openapi === '3.0.0', 'GET /api-docs.json mengembalikan OpenAPI 3.0 valid');

    console.log('\n======================================================');
    console.log(`📊 HASIL PENGUJIAN: ${passedTests} / ${totalTests} BERHASIL`);
    console.log('======================================================\n');

    if (passedTests === totalTests) {
      console.log('🎉 SELURUH PENGUJIAN OTOMATIS BERHASIL (100% PASS)!\n');
    }
  } catch (err) {
    console.error('Terjadi kesalahan saat pengujian:', err);
  } finally {
    server.close();
  }
}

runTests();
