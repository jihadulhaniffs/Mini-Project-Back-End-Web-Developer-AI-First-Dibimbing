/**
 * src/controllers/productController.js
 * Controller untuk menangani alur logika HTTP request dan response API Product.
 * Menjamin status code HTTP tepat dan format JSON konsisten.
 */

'use strict';

const ProductModel = require('../models/productModel');

const productController = {
  /**
   * 1. GET /api/products
   * Mengambil semua daftar produk dengan fitur pencarian, filter, dan sorting.
   */
  getAllProducts(req, res) {
    try {
      const { search, category, minPrice, maxPrice, sort } = req.query;

      const parsedMin = minPrice !== undefined && minPrice !== '' ? Number(minPrice) : undefined;
      const parsedMax = maxPrice !== undefined && maxPrice !== '' ? Number(maxPrice) : undefined;

      // Validasi logika rentang harga
      if (parsedMin !== undefined && isNaN(parsedMin)) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error: 'Bad Request',
          message: "Parameter 'minPrice' harus berupa angka yang valid."
        });
      }

      if (parsedMax !== undefined && isNaN(parsedMax)) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error: 'Bad Request',
          message: "Parameter 'maxPrice' harus berupa angka yang valid."
        });
      }

      if (parsedMin !== undefined && parsedMax !== undefined && parsedMin > parsedMax) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error: 'Bad Request',
          message: "'minPrice' tidak boleh lebih besar dari 'maxPrice'."
        });
      }

      // Validasi nilai sorting
      const allowedSorts = ['price_asc', 'price_desc', 'name_asc', 'name_desc'];
      if (sort && !allowedSorts.includes(sort)) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error: 'Bad Request',
          message: `Nilai 'sort' tidak valid. Pilihan yang didukung: ${allowedSorts.join(', ')}`
        });
      }

      const products = ProductModel.findAll({
        search,
        category,
        minPrice: parsedMin,
        maxPrice: parsedMax,
        sort
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Daftar produk berhasil diambil.',
        count: products.length,
        filtersApplied: {
          search: search || null,
          category: category || null,
          minPrice: parsedMin ?? null,
          maxPrice: parsedMax ?? null,
          sort: sort || null
        },
        data: products
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        error: 'Internal Server Error',
        message: error.message
      });
    }
  },

  /**
   * 2. GET /api/products/:id
   * Mengambil detail satu produk berdasarkan ID.
   */
  getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = ProductModel.findById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          error: 'Product Not Found',
          message: `Produk dengan ID '${id}' tidak ditemukan di katalog.`
        });
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: `Detail produk ID '${id}' berhasil ditemukan.`,
        data: product
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        error: 'Internal Server Error',
        message: error.message
      });
    }
  },

  /**
   * 3. POST /api/products (API PUSH)
   * Menambahkan produk baru ke dalam katalog.
   */
  createProduct(req, res) {
    try {
      const newProduct = ProductModel.create(req.body);

      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: 'Produk baru berhasil ditambahkan ke katalog.',
        data: newProduct
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        error: 'Internal Server Error',
        message: error.message
      });
    }
  },

  /**
   * 4. PUT /api/products/:id
   * Mengganti seluruh data produk (Full Update).
   */
  updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updatedProduct = ProductModel.update(id, req.body);

      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          error: 'Product Not Found',
          message: `Produk dengan ID '${id}' tidak ditemukan untuk diperbarui.`
        });
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: `Seluruh data produk ID '${id}' berhasil diperbarui.`,
        data: updatedProduct
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        error: 'Internal Server Error',
        message: error.message
      });
    }
  },

  /**
   * 5. PATCH /api/products/:id
   * Memperbarui sebagian field produk (Partial Update).
   */
  patchProduct(req, res) {
    try {
      const { id } = req.params;
      const patchedProduct = ProductModel.patch(id, req.body);

      if (!patchedProduct) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          error: 'Product Not Found',
          message: `Produk dengan ID '${id}' tidak ditemukan untuk diubah.`
        });
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: `Sebagian data produk ID '${id}' berhasil diubah.`,
        data: patchedProduct
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        error: 'Internal Server Error',
        message: error.message
      });
    }
  },

  /**
   * 6. DELETE /api/products/:id
   * Menghapus produk dari katalog berdasarkan ID.
   */
  deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const deletedProduct = ProductModel.delete(id);

      if (!deletedProduct) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          error: 'Product Not Found',
          message: `Produk dengan ID '${id}' tidak ditemukan untuk dihapus.`
        });
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: `Produk '${deletedProduct.name}' (ID: ${deletedProduct.id}) berhasil dihapus dari katalog.`,
        data: deletedProduct
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }
};

module.exports = productController;

