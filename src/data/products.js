/**
 * src/data/products.js
 * Seed data awal untuk katalog produk e-commerce.
 * Sesuai dengan spesifikasi Practical Guidance Dibimbing:
 * 1. id (number)
 * 2. name (string)
 * 3. price (number)
 * 4. image (string URL)
 * 5. variants (object dengan colorOrSize [array] dan quantity [number])
 * 6. description (string)
 */

'use strict';

const initialProducts = [
  {
    id: 1,
    name: "Headphone Wireless Noise Cancelling Pro",
    category: "Elektronik",
    price: 750000,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80"
    ],
    variants: {
      colorOrSize: ["Hitam", "Silver", "Midnight Blue"],
      quantity: 15
    },
    description: "Headphone over-ear nirkabel dengan teknologi Active Noise Cancelling (ANC), driver audio 40mm resolusi tinggi, dan baterai tahan hingga 30 jam pemakaian terus menerus."
  },
  {
    id: 2,
    name: "Speaker Bluetooth Mini Portable Waterproof IPX7",
    category: "Elektronik",
    price: 350000,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80"
    ],
    variants: {
      colorOrSize: ["Matte Black", "Ocean Blue", "Forest Green", "Ruby Red"],
      quantity: 25
    },
    description: "Speaker portable ringkas dengan dentuman bass dinamis 360 derajat. Dilengkapi sertifikasi tahan air IPX7 dan baterai tahan hingga 12 jam, sangat pas untuk outdoor."
  },
  {
    id: 3,
    name: "Smartwatch Fitness Tracker Amoled Display",
    category: "Elektronik",
    price: 1200000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80"
    ],
    variants: {
      colorOrSize: ["Space Gray", "Rose Gold", "Titanium Silver"],
      quantity: 10
    },
    description: "Jam tangan pintar dengan layar sentuh AMOLED jernih, sensor pemantau detak jantung 24/7, SpO2, pelacak tidur, dan lebih dari 100 mode olahraga profesional."
  },
  {
    id: 4,
    name: "Tas Ransel Laptop Ergonomis Anti Air",
    category: "Aksesoris",
    price: 285000,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80"
    ],
    variants: {
      colorOrSize: ["Hitam Karbon", "Abu-Abu Elegan", "Biru Navy"],
      quantity: 30
    },
    description: "Tas ransel multifungsi dengan kompartemen laptop hingga 15.6 inci, bahan kain oxford waterproof, bantalan punggung breathable, dan port pengisian daya USB eksternal."
  },
  {
    id: 5,
    name: "Kaos Polos Premium Cotton Combed 30s",
    category: "Pakaian",
    price: 85000,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80"
    ],
    variants: {
      colorOrSize: ["S", "M", "L", "XL", "XXL"],
      quantity: 50
    },
    description: "Kaos polos berbahan 100% katun combed 30s berkualitas tinggi yang adem, halus, menyerap keringat, dan tidak mudah melar setelah dicuci berkali-kali."
  }
];

module.exports = initialProducts;

