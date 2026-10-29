/**
 * src/app.js
 * Inisialisasi aplikasi Express, middleware global, dokumentasi Swagger,
 * mounting route, penyajian aset statis, serta penanganan error global.
 */

'use strict';

const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swaggerSpec');
const productRoutes = require('./routes/productRoutes');
const { notFoundHandler, globalErrorHandler } = require('./middlewares/errorHandler');

const app = express();

// ============================================================================
// 1. Middleware Global
// ============================================================================
app.use(cors()); // Mengizinkan akses Cross-Origin (CORS) dari berbagai client
app.use(express.json()); // Parser body request berformat JSON

// ============================================================================
// 2. Dokumentasi Interaktif Swagger UI
// ============================================================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'E-Commerce Catalog API Docs',
  customCss: '.swagger-ui .topbar { display: none }'
}));

// Endpoint untuk mengambil raw JSON OpenAPI spec
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ============================================================================
// 3. Root Endpoint (Landing Info REST API)
// ============================================================================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'E-Commerce Product Catalog REST API',
    version: '1.0.0',
    developer: 'Jihadul Hanif',
    documentation: 'http://localhost:3000/api-docs',
    endpoints: {
      getAllProducts: 'GET /api/products',
      getProductById: 'GET /api/products/:id',
      createProduct: 'POST /api/products',
      updateProductFull: 'PUT /api/products/:id',
      updateProductPartial: 'PATCH /api/products/:id',
      deleteProduct: 'DELETE /api/products/:id'
    },
    frontendDemo: {
      hardcodedPage: 'http://localhost:3000/product-1.html',
      apiConnectedPage: 'http://localhost:3000/product-2.html'
    }
  });
});

// ============================================================================
// 4. Mounting Static Files (Frontend Demo dari Practical 1)
// ============================================================================
app.use(express.static(path.join(__dirname, '..', 'public')));

// ============================================================================
// 5. Mounting API Routes
// ============================================================================
app.use('/api/products', productRoutes);

// Dukungan alias langsung /products agar ramah client
app.use('/products', productRoutes);

// ============================================================================
// 6. Penanganan Error (404 Not Found & 500 Server Error)
// ============================================================================
app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;
