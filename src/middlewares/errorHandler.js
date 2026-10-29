/**
 * src/middlewares/errorHandler.js
 * Middleware penanganan error terpusat dan penanganan rute tidak terdaftar (404).
 * Memastikan API selalu mengembalikan format JSON yang konsisten dan informatif.
 */

'use strict';

/**
 * Handler untuk request ke URL/Method yang tidak ditemukan
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    statusCode: 404,
    error: 'Route Not Found',
    message: `Rute '${req.method} ${req.originalUrl}' tidak terdaftar pada REST API.`,
    availableEndpoints: [
      'GET /api/products',
      'GET /api/products/:id',
      'POST /api/products',
      'PUT /api/products/:id',
      'PATCH /api/products/:id',
      'DELETE /api/products/:id',
      'GET /api-docs (Dokumentasi Swagger UI)'
    ]
  });
}

/**
 * Handler untuk menangani error internal dan parsing JSON yang rusak
 */
function globalErrorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  // Tangkap error jika client mengirim JSON body yang tidak valid sintaksnya
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      error: 'Malformed JSON',
      message: 'Format JSON pada request body tidak valid. Periksa tanda koma, tanda kurung, dan tanda petik ganda.'
    });
  }

  // Tangkap error tidak terduga lainnya
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'Terjadi kesalahan internal pada server. Silakan hubungi pengelola API.'
  });
}

module.exports = {
  notFoundHandler,
  globalErrorHandler
};

