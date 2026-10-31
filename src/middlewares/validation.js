/**
 * src/middlewares/validation.js
 * Middleware validasi request body untuk POST, PUT, dan PATCH.
 */

'use strict';

const ApiResponse = require('../utils/apiResponse');

/**
 * Memvalidasi apakah string merupakan format URL valid (http:// atau https://)
 * @param {string} url
 * @returns {boolean}
 */
function isValidUrl(url) {
  if (typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Memvalidasi struktur dan nilai field variants
 * @param {*} variants
 * @returns {string|null} Pesan error atau null jika valid
 */
function validateVariants(variants) {
  if (!variants || typeof variants !== 'object' || Array.isArray(variants)) {
    return "Field 'variants' wajib berupa object dengan properti 'colorOrSize' dan 'quantity'.";
  }

  const { colorOrSize, quantity } = variants;

  if (Array.isArray(colorOrSize)) {
    if (colorOrSize.length === 0) {
      return "Field 'variants.colorOrSize' tidak boleh berupa array kosong.";
    }
    const hasInvalidItem = colorOrSize.some(item => typeof item !== 'string' || item.trim() === '');
    if (hasInvalidItem) {
      return "Setiap elemen pada 'variants.colorOrSize' harus berupa teks non-kosong.";
    }
  } else if (typeof colorOrSize === 'string') {
    if (colorOrSize.trim() === '') {
      return "Field 'variants.colorOrSize' tidak boleh berupa teks kosong.";
    }
  } else {
    return "Field 'variants.colorOrSize' wajib berupa array teks atau string non-kosong.";
  }

  if (quantity === undefined || typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 0) {
    return "Field 'variants.quantity' wajib berupa bilangan bulat positif atau nol (integer >= 0).";
  }

  return null;
}

/**
 * Validasi umum untuk operasi penambahan (POST) dan penggantian penuh (PUT)
 * @param {Object} body
 * @returns {Array<string>} Daftar pesan error
 */
function validateFullProduct(body) {
  const errors = [];
  const { name, category, price, description, image, variants } = body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push("Field 'name' wajib diisi berupa teks non-kosong.");
  }

  if (!category || typeof category !== 'string' || category.trim() === '') {
    errors.push("Field 'category' wajib diisi berupa teks non-kosong.");
  }

  if (price === undefined || typeof price !== 'number' || isNaN(price) || price < 0) {
    errors.push("Field 'price' wajib diisi berupa angka positif (>= 0).");
  }

  if (!description || typeof description !== 'string' || description.trim() === '') {
    errors.push("Field 'description' wajib diisi berupa teks non-kosong.");
  }

  if (!image || !isValidUrl(image)) {
    errors.push("Field 'image' wajib diisi dengan format URL yang valid (http:// atau https://).");
  }

  const variantError = validateVariants(variants);
  if (variantError) {
    errors.push(variantError);
  }

  return errors;
}

/**
 * Middleware validasi untuk POST /api/products
 */
function validateCreateProduct(req, res, next) {
  const errors = validateFullProduct(req.body);

  if (errors.length > 0) {
    return ApiResponse.error(res, 400, 'Validation Error', 'Data produk tidak memenuhi syarat validasi.', errors);
  }

  next();
}

/**
 * Middleware validasi untuk PUT /api/products/:id (Full Replacement)
 */
function validateUpdateProduct(req, res, next) {
  const errors = validateFullProduct(req.body);

  if (errors.length > 0) {
    return ApiResponse.error(res, 400, 'Validation Error', 'Semua field wajib diisi lengkap untuk operasi PUT (penggantian penuh).', errors);
  }

  next();
}

/**
 * Middleware validasi untuk PATCH /api/products/:id (Partial Update)
 */
function validatePatchProduct(req, res, next) {
  const { name, category, price, description, image, variants } = req.body;
  const errors = [];

  if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
    errors.push("Field 'name' harus berupa teks non-kosong.");
  }

  if (category !== undefined && (typeof category !== 'string' || category.trim() === '')) {
    errors.push("Field 'category' harus berupa teks non-kosong.");
  }

  if (price !== undefined && (typeof price !== 'number' || isNaN(price) || price < 0)) {
    errors.push("Field 'price' harus berupa angka positif (>= 0).");
  }

  if (description !== undefined && (typeof description !== 'string' || description.trim() === '')) {
    errors.push("Field 'description' harus berupa teks non-kosong.");
  }

  if (image !== undefined && !isValidUrl(image)) {
    errors.push("Field 'image' harus berupa format URL yang valid (http:// atau https://).");
  }

  if (variants !== undefined) {
    const variantError = validateVariants(variants);
    if (variantError) {
      errors.push(variantError);
    }
  }

  if (errors.length > 0) {
    return ApiResponse.error(res, 400, 'Validation Error', 'Perubahan parsial pada field tidak valid.', errors);
  }

  next();
}

module.exports = {
  validateCreateProduct,
  validateUpdateProduct,
  validatePatchProduct
};
