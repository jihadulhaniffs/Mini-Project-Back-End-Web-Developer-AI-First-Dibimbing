/**
 * src/routes/productRoutes.js
 * Definisi rute Express untuk endpoint /api/products
 * Menghubungkan path URL dengan middleware validasi dan controller.
 */

'use strict';

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const {
  validateCreateProduct,
  validateUpdateProduct,
  validatePatchProduct
} = require('../middlewares/validation');

// 1. GET /api/products - List semua produk (dukung query search, filter, sort)
router.get('/', productController.getAllProducts);

// 2. GET /api/products/:id - Detail produk berdasarkan ID
router.get('/:id', productController.getProductById);

// 3. POST /api/products - Tambah produk baru (validasi body)
router.post('/', validateCreateProduct, productController.createProduct);

// 4. PUT /api/products/:id - Ganti seluruh data produk (validasi semua field)
router.put('/:id', validateUpdateProduct, productController.updateProduct);

// 5. PATCH /api/products/:id - Ubah sebagian field produk (validasi parsial)
router.patch('/:id', validatePatchProduct, productController.patchProduct);

// 6. DELETE /api/products/:id - Hapus produk berdasarkan ID
router.delete('/:id', productController.deleteProduct);

module.exports = router;

