/**
 * src/docs/swaggerSpec.js
 * Spesifikasi OpenAPI 3.0.0 untuk E-Commerce Product Catalog REST API.
 */

'use strict';

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'E-Commerce Product Catalog REST API',
    version: '1.0.0',
    description: 'REST API untuk katalog produk e-commerce yang dibangun dengan Node.js dan Express.js sesuai standar Bootcamp Dibimbing Web Development.',
    contact: {
      name: 'Jihadul Hanif'
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
        summary: 'Mengambil daftar produk (GET)',
        description: 'Mengembalikan daftar produk dengan dukungan pagination, pencarian kata kunci, filter kategori, rentang harga, dan sorting.',
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Nomor halaman (default: 1)',
            required: false,
            schema: { type: 'integer', default: 1, example: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Jumlah item per halaman (default: 10, max: 100)',
            required: false,
            schema: { type: 'integer', default: 10, example: 10 }
          },
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
            description: 'Batas harga minimum (angka positif)',
            required: false,
            schema: { type: 'number', example: 100000 }
          },
          {
            name: 'maxPrice',
            in: 'query',
            description: 'Batas harga maksimum (angka positif)',
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
                    pagination: {
                      type: 'object',
                      properties: {
                        totalItems: { type: 'integer', example: 5 },
                        currentPage: { type: 'integer', example: 1 },
                        totalPages: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 10 }
                      }
                    },
                    filtersApplied: {
                      type: 'object',
                      properties: {
                        search: { type: 'string', nullable: true, example: 'headphone' },
                        category: { type: 'string', nullable: true, example: 'Elektronik' },
                        minPrice: { type: 'number', nullable: true, example: 100000 },
                        maxPrice: { type: 'number', nullable: true, example: 1000000 },
                        sort: { type: 'string', nullable: true, example: 'price_asc' }
                      }
                    },
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
        summary: 'Menambahkan produk baru (POST)',
        description: 'Menambahkan data produk baru ke dalam katalog. ID di-generate secara otomatis. Semua field wajib diisi.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductInput' }
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
        summary: 'Mengganti seluruh data produk (PUT - Full Replacement)',
        description: 'Mengganti seluruh nilai field pada produk yang sudah ada. Berbeda dengan PATCH, method PUT mewajibkan SELURUH field (name, category, price, image, variants, description) dikirim ulang untuk menggantikan data lama.',
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
              schema: { $ref: '#/components/schemas/ProductInput' }
            }
          }
        },
        responses: {
          200: {
            description: 'Seluruh data produk berhasil diperbarui',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    statusCode: { type: 'integer', example: 200 },
                    message: { type: 'string', example: 'Seluruh data produk ID 1 berhasil diperbarui.' },
                    data: { $ref: '#/components/schemas/Product' }
                  }
                }
              }
            }
          },
          400: {
            description: 'Field wajib tidak lengkap atau tidak valid',
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
        summary: 'Memperbarui sebagian data produk (PATCH - Partial Update)',
        description: 'Memperbarui hanya satu atau beberapa field data produk tanpa harus mengirimkan seluruh objek. Field yang tidak disertakan akan mempertahankan nilai sebelumnya.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID produk yang akan diubah sebagian',
            schema: { type: 'integer', example: 1 }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Headphone Wireless Pro Black' },
                  category: { type: 'string', example: 'Elektronik' },
                  price: { type: 'number', example: 820000 },
                  image: { type: 'string', example: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e' },
                  variants: {
                    type: 'object',
                    properties: {
                      colorOrSize: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['Hitam Doff']
                      },
                      quantity: { type: 'integer', example: 25 }
                    }
                  },
                  description: { type: 'string', example: 'Pembaruan deskripsi ringkas.' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Sebagian data produk berhasil diubah',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    statusCode: { type: 'integer', example: 200 },
                    message: { type: 'string', example: 'Sebagian data produk ID 1 berhasil diubah.' },
                    data: { $ref: '#/components/schemas/Product' }
                  }
                }
              }
            }
          },
          400: {
            description: 'Nilai field yang dikirim tidak valid',
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
          description: { type: 'string', example: 'Headphone over-ear nirkabel dengan ANC dan baterai 30 jam.' }
        }
      },
      ProductInput: {
        type: 'object',
        required: ['name', 'category', 'price', 'description', 'image', 'variants'],
        properties: {
          name: { type: 'string', example: 'Keyboard Mechanical RGB Hot-Swappable' },
          category: { type: 'string', example: 'Elektronik' },
          price: { type: 'number', example: 650000 },
          image: { type: 'string', example: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80' },
          variants: {
            type: 'object',
            required: ['colorOrSize', 'quantity'],
            properties: {
              colorOrSize: {
                type: 'array',
                items: { type: 'string' },
                example: ['Red Switch', 'Blue Switch']
              },
              quantity: { type: 'integer', example: 20 }
            }
          },
          description: { type: 'string', example: 'Keyboard mechanical 75% dengan konektivitas Bluetooth 5.0 dan baterai 4000mAh.' }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          statusCode: { type: 'integer', example: 400 },
          error: { type: 'string', example: 'Validation Error' },
          message: { type: 'string', example: 'Data produk tidak memenuhi syarat validasi.' },
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
