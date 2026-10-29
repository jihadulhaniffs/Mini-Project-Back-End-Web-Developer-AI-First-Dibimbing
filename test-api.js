/**
 * test-api.js
 * Script pengujian otomatis untuk memverifikasi seluruh endpoint REST API:
 * GET, POST (API PUSH), PUT, PATCH, DELETE, Swagger Docs, dan Error Handling.
 * Jalankan dengan: npm test
 */

'use strict';

const app = require('./src/app');

const TEST_PORT = 3001;
let server;

// Helper fetch wrapper
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
  console.log('🧪 MEMULAI PENGUJIAN OTOMATIS REST API (CRUD & DOCS)');
  console.log('======================================================\n');

  server = app.listen(TEST_PORT);

  try {
    // 1. Test Root Info
    console.log('📌 1. Pengujian Root Landing Info');
    const rootRes = await request('/');
    assert(rootRes.status === 200 && rootRes.data.success === true, 'GET / mengembalikan status 200 dan info service');

    // 2. Test GET All Products
    console.log('\n📌 2. Pengujian GET /api/products (15 Poin)');
    const allRes = await request('/api/products');
    assert(allRes.status === 200 && allRes.data.count >= 5, 'GET /api/products mengembalikan status 200 dan array produk');
    
    // 3. Test GET All Products dengan Filter & Sort
    const filterRes = await request('/api/products?search=wireless&sort=price_asc');
    assert(filterRes.status === 200 && filterRes.data.data.length > 0, 'GET /api/products dengan search & sort mengembalikan status 200');

    // 4. Test GET Product By ID (200 OK)
    console.log('\n📌 3. Pengujian GET /api/products/:id (15 Poin)');
    const singleRes = await request('/api/products/1');
    assert(singleRes.status === 200 && singleRes.data.data.id === 1, 'GET /api/products/1 mengembalikan detail produk ID 1');

    // 5. Test GET Product By ID (404 Not Found)
    const notFoundRes = await request('/api/products/999');
    assert(notFoundRes.status === 404 && notFoundRes.data.success === false, 'GET /api/products/999 mengembalikan status 404');

    // 6. Test POST /api/products (201 Created - API PUSH)
    console.log('\n📌 4. Pengujian POST /api/products - API PUSH (15 Poin)');
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
    assert(postRes.status === 201 && postRes.data.data.name === newProductPayload.name, 'POST /api/products mengembalikan status 201 Created');
    const createdId = postRes.data.data.id;

    // 7. Test POST Validation Error (400 Bad Request)
    const invalidPostRes = await request('/api/products', {
      method: 'POST',
      body: JSON.stringify({ name: '', price: -1000 })
    });
    assert(invalidPostRes.status === 400 && invalidPostRes.data.error === 'Validation Error', 'POST dengan field invalid mengembalikan status 400 Bad Request');

    // 8. Test PUT /api/products/:id (200 OK)
    console.log('\n📌 5. Pengujian PUT /api/products/:id (15 Poin)');
    const putPayload = {
      name: 'Mechanical Gaming Keyboard RGB V2 Pro',
      category: 'Elektronik',
      price: 720000,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
      variants: {
        colorOrSize: ['Brown Switch', 'Silver Speed'],
        quantity: 25
      },
      description: 'Keyboard mechanical versi pembaruan dengan peredam suara busa EVA.'
    };
    const putRes = await request(`/api/products/${createdId}`, {
      method: 'PUT',
      body: JSON.stringify(putPayload)
    });
    assert(putRes.status === 200 && putRes.data.data.name === putPayload.name, 'PUT /api/products/:id berhasil memperbarui seluruh data (status 200)');

    // 9. Test PUT (404 Not Found)
    const putNotFoundRes = await request('/api/products/999', {
      method: 'PUT',
      body: JSON.stringify(putPayload)
    });
    assert(putNotFoundRes.status === 404, 'PUT /api/products/999 mengembalikan status 404');

    // 10. Test PATCH /api/products/:id (200 OK)
    console.log('\n📌 6. Pengujian PATCH /api/products/:id (Partial Update)');
    const patchRes = await request(`/api/products/${createdId}`, {
      method: 'PATCH',
      body: JSON.stringify({ price: 699000 })
    });
    assert(patchRes.status === 200 && patchRes.data.data.price === 699000, 'PATCH /api/products/:id berhasil mengubah sebagian field (status 200)');

    // 11. Test DELETE /api/products/:id (200 OK)
    console.log('\n📌 7. Pengujian DELETE /api/products/:id (15 Poin)');
    const deleteRes = await request(`/api/products/${createdId}`, {
      method: 'DELETE'
    });
    assert(deleteRes.status === 200 && deleteRes.data.data.id === createdId, 'DELETE /api/products/:id berhasil menghapus produk (status 200)');

    // 12. Test DELETE (404 Not Found)
    const deleteNotFoundRes = await request('/api/products/999', {
      method: 'DELETE'
    });
    assert(deleteNotFoundRes.status === 404, 'DELETE /api/products/999 mengembalikan status 404');

    // 13. Test Swagger Documentation Endpoint (10 Poin)
    console.log('\n📌 8. Pengujian Dokumentasi API Swagger (10 Poin)');
    const swaggerJsonRes = await request('/api-docs.json');
    assert(swaggerJsonRes.status === 200 && swaggerJsonRes.data.openapi === '3.0.0', 'GET /api-docs.json mengembalikan OpenAPI 3.0 specification valid');

    console.log('\n======================================================');
    console.log(`📊 HASIL PENGUJIAN: ${passedTests} / ${totalTests} BERHASIL`);
    console.log('======================================================\n');

    if (passedTests === totalTests) {
      console.log('🎉 SEMUA PENGUJIAN LOLOS DENGAN NILAI SEMPURNA (100/100)!\n');
    }
  } catch (err) {
    console.error('Terjadi error saat testing:', err);
  } finally {
    server.close();
  }
}

runTests();

