/**
 * src/app.js
 * Inisialisasi aplikasi Express, middleware global, dokumentasi Swagger,
 * mounting route, serta penanganan error global.
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

app.use(cors());
app.use(express.json());

// Endpoint dokumentasi OpenAPI / Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'E-Commerce Catalog API Docs',
  customCss: '.swagger-ui .topbar { display: none }'
}));

app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Endpoint health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Redirect root ke Swagger UI dokumentasi
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Penyajian file statis untuk demo frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

// Mounting route utama
app.use('/api/products', productRoutes);

// Penanganan error
app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;
