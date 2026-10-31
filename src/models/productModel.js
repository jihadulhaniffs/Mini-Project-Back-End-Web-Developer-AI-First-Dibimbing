/**
 * src/models/productModel.js
 * Model in-memory untuk mengelola data katalog produk.
 * Catatan: Perubahan data bersifat in-memory dan akan kembali ke seed data awal saat server dimulai ulang.
 */

'use strict';

const initialProducts = require('../data/products');

// Salinan mendalam (deep copy) dari seed data
let products = initialProducts.map(p => ({
  ...p,
  images: Array.isArray(p.images) ? [...p.images] : [p.image],
  variants: {
    colorOrSize: [...p.variants.colorOrSize],
    quantity: p.variants.quantity
  }
}));

function generateNextId() {
  const maxId = products.reduce((max, item) => {
    const num = Number(item.id);
    return !isNaN(num) && num > max ? num : max;
  }, 0);
  return maxId + 1;
}

const ProductModel = {
  findAll(filters = {}) {
    let result = products.map(p => ({
      ...p,
      images: [...p.images],
      variants: {
        colorOrSize: [...p.variants.colorOrSize],
        quantity: p.variants.quantity
      }
    }));

    if (filters.search && typeof filters.search === 'string') {
      const keyword = filters.search.trim().toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(keyword) ||
        p.description.toLowerCase().includes(keyword)
      );
    }

    if (filters.category && typeof filters.category === 'string') {
      const cat = filters.category.trim().toLowerCase();
      result = result.filter(p => p.category && p.category.toLowerCase() === cat);
    }

    if (typeof filters.minPrice === 'number' && !isNaN(filters.minPrice)) {
      result = result.filter(p => p.price >= filters.minPrice);
    }

    if (typeof filters.maxPrice === 'number' && !isNaN(filters.maxPrice)) {
      result = result.filter(p => p.price <= filters.maxPrice);
    }

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

    const totalItems = result.length;

    if (filters.page && filters.limit) {
      const startIndex = (filters.page - 1) * filters.limit;
      result = result.slice(startIndex, startIndex + filters.limit);
    }

    return { items: result, totalItems };
  },

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

  create(data) {
    const newId = generateNextId();
    const primaryImage = String(data.image).trim();
    const imageList = Array.isArray(data.images) && data.images.length > 0
      ? data.images.map(img => String(img).trim())
      : [primaryImage];

    const variantColors = Array.isArray(data.variants.colorOrSize)
      ? data.variants.colorOrSize.map(v => String(v).trim())
      : [String(data.variants.colorOrSize).trim()];

    const newProduct = {
      id: newId,
      name: String(data.name).trim(),
      category: String(data.category).trim(),
      price: Number(data.price),
      image: primaryImage,
      images: imageList,
      variants: {
        colorOrSize: variantColors,
        quantity: Number(data.variants.quantity)
      },
      description: String(data.description).trim()
    };

    products.push(newProduct);
    return newProduct;
  },

  update(id, data) {
    const index = products.findIndex(p => String(p.id) === String(id));
    if (index === -1) return null;

    const existingId = products[index].id;
    const primaryImage = String(data.image).trim();
    const imageList = Array.isArray(data.images) && data.images.length > 0
      ? data.images.map(img => String(img).trim())
      : [primaryImage];

    const variantColors = Array.isArray(data.variants.colorOrSize)
      ? data.variants.colorOrSize.map(v => String(v).trim())
      : [String(data.variants.colorOrSize).trim()];

    const updatedProduct = {
      id: existingId,
      name: String(data.name).trim(),
      category: String(data.category).trim(),
      price: Number(data.price),
      image: primaryImage,
      images: imageList,
      variants: {
        colorOrSize: variantColors,
        quantity: Number(data.variants.quantity)
      },
      description: String(data.description).trim()
    };

    products[index] = updatedProduct;
    return updatedProduct;
  },

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

  delete(id) {
    const index = products.findIndex(p => String(p.id) === String(id));
    if (index === -1) return null;

    const deletedItem = products.splice(index, 1)[0];
    return deletedItem;
  },

  count() {
    return products.length;
  }
};

module.exports = ProductModel;
