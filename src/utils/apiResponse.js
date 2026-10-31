/**
 * src/utils/apiResponse.js
 * Kelas utilitas untuk standarisasi format response HTTP JSON di seluruh aplikasi.
 */

'use strict';

class ApiResponse {
  /**
   * Mengembalikan response sukses berstandar
   * @param {Object} res - Express response object
   * @param {number} statusCode - Kode status HTTP (200, 201)
   * @param {string} message - Pesan sukses
   * @param {*} [data=null] - Payload data response
   * @param {Object} [meta={}] - Metadata tambahan (misal pagination, filtersApplied)
   */
  static success(res, statusCode, message, data = null, meta = {}) {
    const payload = {
      success: true,
      statusCode,
      message,
      ...meta
    };

    if (data !== null) {
      payload.data = data;
    }

    return res.status(statusCode).json(payload);
  }

  /**
   * Mengembalikan response error berstandar
   * @param {Object} res - Express response object
   * @param {number} statusCode - Kode status HTTP (400, 404, 500)
   * @param {string} error - Tipe error
   * @param {string} message - Pesan error
   * @param {Array|Object} [details=null] - Detail error tambahan jika ada
   */
  static error(res, statusCode, error, message, details = null) {
    const payload = {
      success: false,
      statusCode,
      error,
      message
    };

    if (details) {
      payload.details = details;
    }

    return res.status(statusCode).json(payload);
  }
}

module.exports = ApiResponse;

