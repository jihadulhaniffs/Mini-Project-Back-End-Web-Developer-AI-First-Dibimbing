/**
 * server.js
 * Entry point untuk menjalankan E-Commerce Product Catalog REST API.
 */

'use strict';

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  console.log(`Dokumentasi API: http://localhost:${PORT}/api-docs`);
});
