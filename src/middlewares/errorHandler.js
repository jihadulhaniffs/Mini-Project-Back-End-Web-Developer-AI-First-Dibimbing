/**
 * src/middlewares/errorHandler.js
 * Middleware penanganan error terpusat dan penanganan rute tidak terdaftar (404).
 */

'use strict';

const ApiResponse = require('../utils/apiResponse');

/**
 * Handler untuk request ke URL/Method yang tidak terdaftar
 */
function notFoundHandler(req, res) {
  return ApiResponse.error(
    res,
    404,
    'Route Not Found',
    `Rute '${req.method} ${req.originalUrl}' tidak terdaftar pada API.`
  );
}

/**
 * Handler global untuk menangani error tak terduga dan parsing JSON rusak
 */
function globalErrorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return ApiResponse.error(
      res,
      400,
      'Malformed JSON',
      'Format JSON pada request body tidak valid. Periksa kembali struktur data yang dikirim.'
    );
  }

  console.error('Unhandled Server Error:', err);
  return ApiResponse.error(
    res,
    500,
    'Internal Server Error',
    'Terjadi kesalahan internal pada server.'
  );
}

module.exports = {
  notFoundHandler,
  globalErrorHandler
};
