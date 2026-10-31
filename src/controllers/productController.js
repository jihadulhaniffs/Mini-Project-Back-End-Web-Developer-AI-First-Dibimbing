/**
 * src/controllers/productController.js
 * Controller untuk menangani alur request dan response API Product.
 */

'use strict';

const ProductModel = require('../models/productModel');
const ApiResponse = require('../utils/apiResponse');

const productController = {
  /**
   * GET /api/products
   * Mengambil daftar produk dengan pagination, filter, dan sorting
   */
  getAllProducts(req, res) {
    try {
      const { search, category, minPrice, maxPrice, sort, page, limit } = req.query;

      const parsedPage = page !== undefined && page !== '' ? parseInt(page, 10) : 1;
      const parsedLimit = limit !== undefined && limit !== '' ? parseInt(limit, 10) : 10;

      if (isNaN(parsedPage) || parsedPage < 1) {
        return ApiResponse.error(res, 400, 'Bad Request', "Parameter 'page' harus berupa bilangan bulat positif (>= 1).");
      }

      if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
        return ApiResponse.error(res, 400, 'Bad Request', "Parameter 'limit' harus berupa bilangan bulat antara 1 dan 100.");
      }

      const parsedMin = minPrice !== undefined && minPrice !== '' ? Number(minPrice) : undefined;
      const parsedMax = maxPrice !== undefined && maxPrice !== '' ? Number(maxPrice) : undefined;

      if (parsedMin !== undefined && isNaN(parsedMin)) {
        return ApiResponse.error(res, 400, 'Bad Request', "Parameter 'minPrice' harus berupa angka yang valid.");
      }

      if (parsedMax !== undefined && isNaN(parsedMax)) {
        return ApiResponse.error(res, 400, 'Bad Request', "Parameter 'maxPrice' harus berupa angka yang valid.");
      }

      if (parsedMin !== undefined && parsedMax !== undefined && parsedMin > parsedMax) {
        return ApiResponse.error(res, 400, 'Bad Request', "'minPrice' tidak boleh lebih besar dari 'maxPrice'.");
      }

      const allowedSorts = ['price_asc', 'price_desc', 'name_asc', 'name_desc'];
      if (sort && !allowedSorts.includes(sort)) {
        return ApiResponse.error(res, 400, 'Bad Request', `Nilai 'sort' tidak valid. Pilihan yang didukung: ${allowedSorts.join(', ')}`);
      }

      const { items, totalItems } = ProductModel.findAll({
        search,
        category,
        minPrice: parsedMin,
        maxPrice: parsedMax,
        sort,
        page: parsedPage,
        limit: parsedLimit
      });

      const totalPages = Math.ceil(totalItems / parsedLimit) || 1;

      return ApiResponse.success(res, 200, 'Daftar produk berhasil diambil.', items, {
        pagination: {
          totalItems,
          currentPage: parsedPage,
          totalPages,
          limit: parsedLimit
        },
        filtersApplied: {
          search: search || null,
          category: category || null,
          minPrice: parsedMin ?? null,
          maxPrice: parsedMax ?? null,
          sort: sort || null
        }
      });
    } catch (error) {
      console.error('Error pada getAllProducts:', error);
      return ApiResponse.error(res, 500, 'Internal Server Error', 'Terjadi kesalahan internal pada server.');
    }
  },

  /**
   * GET /api/products/:id
   * Mengambil detail satu produk berdasarkan ID
   */
  getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = ProductModel.findById(id);

      if (!product) {
        return ApiResponse.error(res, 404, 'Product Not Found', `Produk dengan ID '${id}' tidak ditemukan di katalog.`);
      }

      return ApiResponse.success(res, 200, `Detail produk ID '${id}' berhasil ditemukan.`, product);
    } catch (error) {
      console.error('Error pada getProductById:', error);
      return ApiResponse.error(res, 500, 'Internal Server Error', 'Terjadi kesalahan internal pada server.');
    }
  },

  /**
   * POST /api/products
   * Menambahkan produk baru ke katalog
   */
  createProduct(req, res) {
    try {
      const newProduct = ProductModel.create(req.body);
      return ApiResponse.success(res, 201, 'Produk baru berhasil ditambahkan ke katalog.', newProduct);
    } catch (error) {
      console.error('Error pada createProduct:', error);
      return ApiResponse.error(res, 500, 'Internal Server Error', 'Terjadi kesalahan internal pada server.');
    }
  },

  /**
   * PUT /api/products/:id
   * Mengganti seluruh data produk yang ada (Full Replacement)
   */
  updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updatedProduct = ProductModel.update(id, req.body);

      if (!updatedProduct) {
        return ApiResponse.error(res, 404, 'Product Not Found', `Produk dengan ID '${id}' tidak ditemukan untuk diperbarui.`);
      }

      return ApiResponse.success(res, 200, `Seluruh data produk ID '${id}' berhasil diperbarui.`, updatedProduct);
    } catch (error) {
      console.error('Error pada updateProduct:', error);
      return ApiResponse.error(res, 500, 'Internal Server Error', 'Terjadi kesalahan internal pada server.');
    }
  },

  /**
   * PATCH /api/products/:id
   * Memperbarui sebagian field data produk (Partial Update)
   */
  patchProduct(req, res) {
    try {
      const { id } = req.params;
      const patchedProduct = ProductModel.patch(id, req.body);

      if (!patchedProduct) {
        return ApiResponse.error(res, 404, 'Product Not Found', `Produk dengan ID '${id}' tidak ditemukan untuk diubah.`);
      }

      return ApiResponse.success(res, 200, `Sebagian data produk ID '${id}' berhasil diubah.`, patchedProduct);
    } catch (error) {
      console.error('Error pada patchProduct:', error);
      return ApiResponse.error(res, 500, 'Internal Server Error', 'Terjadi kesalahan internal pada server.');
    }
  },

  /**
   * DELETE /api/products/:id
   * Menghapus produk dari katalog berdasarkan ID
   */
  deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const deletedProduct = ProductModel.delete(id);

      if (!deletedProduct) {
        return ApiResponse.error(res, 404, 'Product Not Found', `Produk dengan ID '${id}' tidak ditemukan untuk dihapus.`);
      }

      return ApiResponse.success(res, 200, `Produk '${deletedProduct.name}' (ID: ${deletedProduct.id}) berhasil dihapus dari katalog.`, deletedProduct);
    } catch (error) {
      console.error('Error pada deleteProduct:', error);
      return ApiResponse.error(res, 500, 'Internal Server Error', 'Terjadi kesalahan internal pada server.');
    }
  }
};

module.exports = productController;
