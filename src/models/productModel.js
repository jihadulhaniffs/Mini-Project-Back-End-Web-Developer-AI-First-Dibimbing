/**
 * src/models/productModel.js
 * Model In-Memory untuk mengelola data produk selama runtime.
 * Mengenkapsulasi operasi CRUD: Create, Read, Update, Delete.
 */

'use strict';

const initialProducts = require('../data/products');

// Salinan mendalam (deep copy) dari seed data agar data master tidak terubah secara langsung
let products = initialProducts.map(p => ({
  ...p,
  images: Array.isArray(p.images) ? [...p.images] : [p.image],
  variants: {
    colorOrSize: [...p.variants.colorOrSize],
    quantity: p.variants.quantity
  }
}));

/**
 * Helper: Menghasilkan ID integer baru yang unik
 * @returns {number} ID baru
 */
function generateNextId() {
  const maxId = products.reduce((max, item) => {
    const num = Number(item.id);
    return !isNaN(num) && num > max ? num : max;
  }, 0);
  return maxId + 1;
}

const ProductModel = {
  /**
   * Mengambil semua produk dengan filter opsional
   * @param {Object} filters
   * @param {string} [filters.search] - Pencarian di nama & deskripsi
   * @param {string} [filters.category] - Filter kategori persis
   * @param {number} [filters.minPrice] - Batas minimum harga
   * @param {number} [filters.maxPrice] - Batas maksimum harga
   * @param {string} [filters.sort] - 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc'
   * @returns {Array} Daftar produk yang cocok
   */
  findAll(filters = {}) {
    let result = products.map(p => ({
      ...p,
      images: [...p.images],
      variants: {
        colorOrSize: [...p.variants.colorOrSize],
        quantity: p.variants.quantity
      }
    }));

    // Filter berdasarkan kata kunci pencarian (nama atau deskripsi)
    if (filters.search && typeof filters.search === 'string') {
      const keyword = filters.search.trim().toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(keyword) ||
        p.description.toLowerCase().includes(keyword)
      );
    }

    // Filter berdasarkan kategori
    if (filters.category && typeof filters.category === 'string') {
      const cat = filters.category.trim().toLowerCase();
      result = result.filter(p => p.category && p.category.toLowerCase() === cat);
    }

    // Filter batas harga minimum
    if (typeof filters.minPrice === 'number' && !isNaN(filters.minPrice)) {
      result = result.filter(p => p.price >= filters.minPrice);
    }

    // Filter batas harga maksimum
    if (typeof filters.maxPrice === 'number' && !isNaN(filters.maxPrice)) {
      result = result.filter(p => p.price <= filters.maxPrice);
    }

    // Pengurutan (Sorting)
    if (filters.sort) {
      switch (filters.sort) {
        case 'price_asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'name_asc':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name_desc':
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        default:
          break;
      }
    }

    return result;
  },

  /**
   * Mengambil satu produk berdasarkan ID
   * @param {number|string} id
   * @returns {Object|null} Objek produk atau null jika tidak ada
   */
  findById(id) {
    const product = products.find(p => String(p.id) === String(id));
    if (!product) return null;
    return {
      ...product,
      images: [...product.images],
      variants: {
        colorOrSize: [...product.variants.colorOrSize],
        quantity: product.variants.quantity
      }
    };
  },

  /**
   * Menambahkan produk baru ke dalam katalog
   * @param {Object} data - Payload produk
   * @returns {Object} Produk baru yang dibuat beserta ID otomatis
   */
  create(data) {
    const newId = generateNextId();
    const primaryImage = data.image ? String(data.image).trim() : 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80';
    const imageList = Array.isArray(data.images) && data.images.length > 0
      ? data.images.map(img => String(img).trim())
      : [primaryImage];

    const newProduct = {
      id: newId,
      name: String(data.name).trim(),
      category: data.category ? String(data.category).trim() : 'General',
      price: Number(data.price),
      image: primaryImage,
      images: imageList,
      variants: {
        colorOrSize: Array.isArray(data.variants?.colorOrSize) && data.variants.colorOrSize.length > 0
          ? data.variants.colorOrSize.map(v => String(v).trim())
          : ['Standard'],
        quantity: typeof data.variants?.quantity === 'number' && data.variants.quantity >= 0
          ? Number(data.variants.quantity)
          : 0
      },
      description: data.description ? String(data.description).trim() : ''
    };

    products.push(newProduct);
    return newProduct;
  },

  /**
   * Mengganti seluruh data produk (Full Update - PUT)
   * @param {number|string} id
   * @param {Object} data
   * @returns {Object|null} Data produk baru atau null jika ID tidak ditemukan
   */
  update(id, data) {
    const index = products.findIndex(p => String(p.id) === String(id));
    if (index === -1) return null;

    const existingId = products[index].id;
    const primaryImage = data.image ? String(data.image).trim() : products[index].image;
    const imageList = Array.isArray(data.images) && data.images.length > 0
      ? data.images.map(img => String(img).trim())
      : [primaryImage];

    const updatedProduct = {
      id: existingId,
      name: String(data.name).trim(),
      category: data.category ? String(data.category).trim() : products[index].category || 'General',
      price: Number(data.price),
      image: primaryImage,
      images: imageList,
      variants: {
        colorOrSize: Array.isArray(data.variants?.colorOrSize)
          ? data.variants.colorOrSize.map(v => String(v).trim())
          : [String(data.variants?.colorOrSize || 'Standard')],
        quantity: Number(data.variants?.quantity) || 0
      },
      description: String(data.description).trim()
    };

    products[index] = updatedProduct;
    return updatedProduct;
  },

  /**
   * Mengubah sebagian field produk (Partial Update - PATCH)
   * @param {number|string} id
   * @param {Object} partialData
   * @returns {Object|null} Data produk setelah patch atau null jika ID tidak ditemukan
   */
  patch(id, partialData) {
    const index = products.findIndex(p => String(p.id) === String(id));
    if (index === -1) return null;

    const current = products[index];

    if (partialData.name !== undefined) current.name = String(partialData.name).trim();
    if (partialData.category !== undefined) current.category = String(partialData.category).trim();
    if (partialData.price !== undefined) current.price = Number(partialData.price);
    if (partialData.description !== undefined) current.description = String(partialData.description).trim();
    if (partialData.image !== undefined) current.image = String(partialData.image).trim();
    if (partialData.images !== undefined && Array.isArray(partialData.images)) {
      current.images = partialData.images.map(img => String(img).trim());
    }

    if (partialData.variants && typeof partialData.variants === 'object') {
      if (partialData.variants.colorOrSize !== undefined) {
        current.variants.colorOrSize = Array.isArray(partialData.variants.colorOrSize)
          ? partialData.variants.colorOrSize.map(v => String(v).trim())
          : [String(partialData.variants.colorOrSize).trim()];
      }
      if (partialData.variants.quantity !== undefined) {
        current.variants.quantity = Number(partialData.variants.quantity);
      }
    }

    return current;
  },

  /**
   * Menghapus produk dari katalog berdasarkan ID
   * @param {number|string} id
   * @returns {Object|null} Objek yang dihapus atau null jika ID tidak ditemukan
   */
  delete(id) {
    const index = products.findIndex(p => String(p.id) === String(id));
    if (index === -1) return null;

    const deletedItem = products.splice(index, 1)[0];
    return deletedItem;
  },

  /**
   * Mengembalikan jumlah produk yang ada
   * @returns {number}
   */
  count() {
    return products.length;
  }
};

module.exports = ProductModel;

