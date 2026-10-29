/**
 * src/middlewares/validation.js
 * Middleware validasi request body untuk operasi penambahan (POST),
 * penggantian penuh (PUT), dan perubahan parsial (PATCH).
 */

'use strict';

/**
 * Validasi untuk POST /api/products
 * Memastikan semua field minimal terpenuhi sesuai spesifikasi tugas
 */
function validateCreateProduct(req, res, next) {
  const { name, price, description, variants, image } = req.body;
  const errors = [];

  // Validasi Nama Produk
  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push("Field 'name' wajib diisi berupa teks non-kosong.");
  }

  // Validasi Harga Produk
  if (price === undefined || typeof price !== 'number' || isNaN(price) || price < 0) {
    errors.push("Field 'price' wajib diisi berupa angka positif (>= 0).");
  }

  // Validasi Deskripsi Produk
  if (!description || typeof description !== 'string' || description.trim() === '') {
    errors.push("Field 'description' wajib diisi berupa teks non-kosong.");
  }

  // Validasi Variasi Produk (variants: { colorOrSize, quantity })
  if (!variants || typeof variants !== 'object' || Array.isArray(variants)) {
    errors.push("Field 'variants' wajib berupa object yang memiliki 'colorOrSize' dan 'quantity'.");
  } else {
    if (!variants.colorOrSize || (!Array.isArray(variants.colorOrSize) && typeof variants.colorOrSize !== 'string')) {
      errors.push("Field 'variants.colorOrSize' wajib berupa array teks atau string.");
    }
    if (variants.quantity === undefined || typeof variants.quantity !== 'number' || isNaN(variants.quantity) || variants.quantity < 0) {
      errors.push("Field 'variants.quantity' wajib berupa angka positif (>= 0).");
    }
  }

  // Validasi Image jika dikirim
  if (image !== undefined && (typeof image !== 'string' || image.trim() === '')) {
    errors.push("Field 'image' jika disertakan harus berupa URL string.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      error: 'Validation Error',
      message: 'Data produk tidak memenuhi syarat validasi.',
      details: errors
    });
  }

  next();
}

/**
 * Validasi untuk PUT /api/products/:id
 * Method PUT mewajibkan semua field untuk me-replace seluruh data produk
 */
function validateUpdateProduct(req, res, next) {
  const { name, price, description, variants, image } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push("Field 'name' wajib diisi untuk operasi PUT.");
  }

  if (price === undefined || typeof price !== 'number' || isNaN(price) || price < 0) {
    errors.push("Field 'price' wajib diisi berupa angka positif (>= 0) untuk operasi PUT.");
  }

  if (!description || typeof description !== 'string' || description.trim() === '') {
    errors.push("Field 'description' wajib diisi untuk operasi PUT.");
  }

  if (!variants || typeof variants !== 'object' || Array.isArray(variants)) {
    errors.push("Field 'variants' wajib berupa object dengan 'colorOrSize' dan 'quantity'.");
  } else {
    if (!variants.colorOrSize || (!Array.isArray(variants.colorOrSize) && typeof variants.colorOrSize !== 'string')) {
      errors.push("Field 'variants.colorOrSize' wajib diisi.");
    }
    if (variants.quantity === undefined || typeof variants.quantity !== 'number' || isNaN(variants.quantity) || variants.quantity < 0) {
      errors.push("Field 'variants.quantity' wajib diisi berupa angka positif (>= 0).");
    }
  }

  if (!image || typeof image !== 'string' || image.trim() === '') {
    errors.push("Field 'image' wajib diisi (URL string) untuk operasi PUT.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      error: 'Validation Error',
      message: 'Semua field wajib diisi lengkap untuk operasi PUT (Full Replace).',
      details: errors
    });
  }

  next();
}

/**
 * Validasi untuk PATCH /api/products/:id
 * Hanya memvalidasi field yang dikirimkan oleh client
 */
function validatePatchProduct(req, res, next) {
  const { name, price, description, variants, image } = req.body;
  const errors = [];

  if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
    errors.push("Field 'name' harus berupa teks non-kosong.");
  }

  if (price !== undefined && (typeof price !== 'number' || isNaN(price) || price < 0)) {
    errors.push("Field 'price' harus berupa angka positif (>= 0).");
  }

  if (description !== undefined && (typeof description !== 'string' || description.trim() === '')) {
    errors.push("Field 'description' harus berupa teks non-kosong.");
  }

  if (image !== undefined && (typeof image !== 'string' || image.trim() === '')) {
    errors.push("Field 'image' harus berupa URL string non-kosong.");
  }

  if (variants !== undefined) {
    if (typeof variants !== 'object' || Array.isArray(variants)) {
      errors.push("Field 'variants' harus berupa object.");
    } else {
      if (variants.colorOrSize !== undefined && !Array.isArray(variants.colorOrSize) && typeof variants.colorOrSize !== 'string') {
        errors.push("Field 'variants.colorOrSize' harus berupa array atau string.");
      }
      if (variants.quantity !== undefined && (typeof variants.quantity !== 'number' || isNaN(variants.quantity) || variants.quantity < 0)) {
        errors.push("Field 'variants.quantity' harus berupa angka positif (>= 0).");
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      error: 'Validation Error',
      message: 'Perubahan parsial pada field tidak valid.',
      details: errors
    });
  }

  next();
}

module.exports = {
  validateCreateProduct,
  validateUpdateProduct,
  validatePatchProduct
};

