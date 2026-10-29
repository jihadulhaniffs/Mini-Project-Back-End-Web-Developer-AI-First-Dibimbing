/**
 * src/docs/swaggerSpec.js
 * Spesifikasi OpenAPI 3.0.0 untuk E-Commerce Product Catalog REST API.
 * Digunakan oleh Swagger UI di /api-docs.
 */

'use strict';

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'E-Commerce Product Catalog REST API',
    version: '1.0.0',
    description: 'REST API sederhana untuk katalog produk e-commerce yang dibangun dengan Node.js dan Express.js sesuai standar Bootcamp Dibimbing Web Development.',
    contact: {
      name: 'Jihadul Hanif',
      url: 'https://github.com/'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local Development Server'
    }
  ],
  tags: [
    {
      name: 'Products',
      description: 'Operasi CRUD data katalog produk'
    }
  ],
  paths: {
    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'Mengambil seluruh daftar produk (GET)',
        description: 'Mengembalikan daftar produk dengan dukungan filter kata kunci, kategori, rentang harga, dan sorting.',
        parameters: [
          {
            name: 'search',
            in: 'query',
            description: 'Pencarian kata kunci pada nama atau deskripsi produk',
            required: false,
            schema: { type: 'string', example: 'headphone' }
          },
          {
            name: 'category',
            in: 'query',
            description: 'Filter kategori spesifik (contoh: Elektronik, Pakaian, Aksesoris)',
            required: false,
            schema: { type: 'string', example: 'Elektronik' }
          },
          {
            name: 'minPrice',
            in: 'query',
            description: 'Batas harga minimum (angka)',
            required: false,
            schema: { type: 'number', example: 100000 }
          },
          {
            name: 'maxPrice',
            in: 'query',
            description: 'Batas harga maksimum (angka)',
            required: false,
            schema: { type: 'number', example: 1000000 }
          },
          {
            name: 'sort',
            in: 'query',
            description: 'Pilihan pengurutan: price_asc, price_desc, name_asc, name_desc',
            required: false,
            schema: {
              type: 'string',
              enum: ['price_asc', 'price_desc', 'name_asc', 'name_desc'],
              example: 'price_asc'
            }
          }
        ],
        responses: {
          200: {
            description: 'Berhasil mengambil daftar produk',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    statusCode: { type: 'integer', example: 200 },
                    message: { type: 'string', example: 'Daftar produk berhasil diambil.' },
                    count: { type: 'integer', example: 5 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Product' }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Parameter query tidak valid',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      post: {
        tags: ['Products'],
        summary: 'Menambahkan produk baru (POST / API PUSH)',
        description: 'Menambahkan data produk baru ke dalam katalog in-memory. ID di-generate otomatis.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductInput' },
              example: {
                name: 'Keyboard Mechanical Wireless RGB',
                category: 'Elektronik',
                price: 650000,
                image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
                variants: {
                  colorOrSize: ['Red Switch', 'Blue Switch', 'Brown Switch'],
                  quantity: 20
                },
                description: 'Keyboard mechanical kompak 75% dengan konektivitas Bluetooth 5.0 dan switch hot-swappable.'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Produk berhasil ditambahkan',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    statusCode: { type: 'integer', example: 201 },
                    message: { type: 'string', example: 'Produk baru berhasil ditambahkan ke katalog.' },
                    data: { $ref: '#/components/schemas/Product' }
                  }
                }
              }
            }
          },
          400: {
            description: 'Validasi input gagal',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Mengambil detail produk berdasarkan ID (GET)',
        description: 'Mengembalikan informasi detail untuk satu produk tertentu berdasarkan parameter ID.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID produk yang dicari',
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          200: {
            description: 'Produk ditemukan',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    statusCode: { type: 'integer', example: 200 },
                    message: { type: 'string', example: 'Detail produk ID 1 berhasil ditemukan.' },
                    data: { $ref: '#/components/schemas/Product' }
                  }
                }
              }
            }
          },
          404: {
            description: 'Produk tidak ditemukan',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      put: {
        tags: ['Products'],
        summary: 'Mengganti seluruh data produk (PUT)',
        description: 'Mengganti seluruh nilai field pada produk yang sudah ada (Full Replacement). Semua field wajib disertakan.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID produk yang akan diganti',
            schema: { type: 'integer', example: 1 }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductInput' },
              example: {
                name: 'Headphone Wireless Noise Cancelling Pro Gen 2',
                category: 'Elektronik',
                price: 890000,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
                variants: {
                  colorOrSize: ['Hitam Doff', 'Silver Titanium'],
                  quantity: 35
                },
                description: 'Headphone versi 2 dengan ANC hybrid yang ditingkatkan dan baterai 45 jam.'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Produk berhasil diperbarui',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    statusCode: { type: 'integer', example: 200 },
                    message: { type: 'string', example: 'Seluruh data produk berhasil diperbarui.' },
                    data: { $ref: '#/components/schemas/Product' }
                  }
                }
              }
            }
          },
          400: {
            description: 'Field wajib tidak lengkap',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          404: {
            description: 'Produk tidak ditemukan',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      patch: {
        tags: ['Products'],
        summary: 'Mengubah sebagian data produk (PATCH)',
        description: 'Mengubah satu atau beberapa field tanpa harus mengirimkan seluruh objek produk.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID produk yang akan diubah',
            schema: { type: 'integer', example: 1 }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object' },
              example: {
                price: 820000,
                variants: {
                  quantity: 18
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Data produk berhasil diubah secara parsial',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    statusCode: { type: 'integer', example: 200 },
                    message: { type: 'string', example: 'Sebagian data produk berhasil diubah.' },
                    data: { $ref: '#/components/schemas/Product' }
                  }
                }
              }
            }
          },
          400: {
            description: 'Nilai field tidak valid',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          404: {
            description: 'Produk tidak ditemukan',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Products'],
        summary: 'Menghapus produk berdasarkan ID (DELETE)',
        description: 'Menghapus satu produk dari katalog in-memory berdasarkan parameter ID.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID produk yang akan dihapus',
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          200: {
            description: 'Produk berhasil dihapus',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    statusCode: { type: 'integer', example: 200 },
                    message: { type: 'string', example: 'Produk berhasil dihapus dari katalog.' },
                    data: { $ref: '#/components/schemas/Product' }
                  }
                }
              }
            }
          },
          404: {
            description: 'Produk tidak ditemukan',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Product: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Headphone Wireless Noise Cancelling Pro' },
          category: { type: 'string', example: 'Elektronik' },
          price: { type: 'number', example: 750000 },
          image: { type: 'string', example: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
          images: {
            type: 'array',
            items: { type: 'string' }
          },
          variants: {
            type: 'object',
            properties: {
              colorOrSize: {
                type: 'array',
                items: { type: 'string' },
                example: ['Hitam', 'Silver', 'Midnight Blue']
              },
              quantity: { type: 'integer', example: 15 }
            }
          },
          description: { type: 'string', example: 'Headphone over-ear nirkabel dengan ANC...' }
        }
      },
      ProductInput: {
        type: 'object',
        required: ['name', 'price', 'description', 'variants'],
        properties: {
          name: { type: 'string', example: 'Mouse Wireless Silent Click' },
          category: { type: 'string', example: 'Elektronik' },
          price: { type: 'number', example: 175000 },
          image: { type: 'string', example: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80' },
          variants: {
            type: 'object',
            required: ['colorOrSize', 'quantity'],
            properties: {
              colorOrSize: {
                type: 'array',
                items: { type: 'string' },
                example: ['Matte Black', 'Off White']
              },
              quantity: { type: 'integer', example: 40 }
            }
          },
          description: { type: 'string', example: 'Mouse tanpa kabel ergonomis dengan tombol hening dan sensor 2400 DPI.' }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          statusCode: { type: 'integer', example: 400 },
          error: { type: 'string', example: 'Validation Error' },
          message: { type: 'string', example: 'Field name wajib diisi.' },
          details: {
            type: 'array',
            items: { type: 'string' }
          }
        }
      }
    }
  }
};

module.exports = swaggerSpec;

