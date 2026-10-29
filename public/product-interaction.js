// public/product-interaction.js
// ---------------------------------------------------------------------------
// Modul Interaktivitas JavaScript Vanilla - Dibimbing Bootcamp
// Praktik: Tipe Data, Operator (Aritmatika & Logika), dan Manipulasi DOM
// ---------------------------------------------------------------------------

'use strict';

// ===========================================================================
// LANGKAH 3: Memahami Tipe Data dari Product (Demonstrasi di Console)
// ===========================================================================
console.log('--- [Dibimbing] Inisialisasi JavaScript Fundamentals ---');

// Variabel contoh sesuai Langkah 3 slide materi:
const sampleProductName = 'Nama Product'; // string
const sampleUnitPrice = 150000;          // number
const sampleQuantity = 2;                // number
const sampleHasSelection = true;         // boolean
let sampleSelectedVariant = null;        // null (nilai sengaja dikosongkan)
let sampleNotes;                         // undefined (belum diberi nilai)

console.log('Tipe data sampleProductName:', typeof sampleProductName); // 'string'
console.log('Tipe data sampleUnitPrice:', typeof sampleUnitPrice);     // 'number'
console.log('Tipe data sampleHasSelection:', typeof sampleHasSelection); // 'boolean'
console.log('Apakah sampleSelectedVariant === null?', sampleSelectedVariant === null); // true
console.log('Tipe data sampleNotes:', typeof sampleNotes);             // 'undefined'
console.log('Catatan: typeof null di JS menghasilkan: "' + typeof sampleSelectedVariant + '" (historis bug spesifikasi JS)');
console.log('---------------------------------------------------------');

// ===========================================================================
// LANGKAH 4 & 5: Menghubungkan Input, Event Listener, dan Subtotal
// ===========================================================================

// Selector Elemen DOM sesuai standar instruksi slide:
const form = document.querySelector('#productForm');
const priceElement = document.querySelector('#productPrice');
const variantInput = document.querySelector('#variant');
const quantityInput = document.querySelector('#quantity');
const summary = document.querySelector('#selectionSummary');
const btnUpdate = document.querySelector('#btnUpdate');

// Helper: Format angka menjadi representasi mata uang Rupiah
function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number);
}

// Fungsi utama kalkulasi subtotal dan pembaruan ringkasan
function updateSelectionSummary() {
  if (!form || !priceElement || !variantInput || !quantityInput || !summary) {
    return;
  }

  // 1. Konversi data-price dari string ke number menggunakan Number()
  //    (Langkah 3 & 4: Konversi tipe data)
  const price = Number(priceElement.dataset.price);

  // 2. Konversi nilai input quantity dari string ke number
  const quantity = Number(quantityInput.value);

  // 3. Membaca nilai varian (string)
  const variant = variantInput.value;

  // 4. Operator Aritmatika & Assignment: menghitung subtotal
  let subtotal = 0;
  subtotal += price * quantity; // subtotal = subtotal + (price * quantity)

  // 5. Operator Perbandingan & Logika: mengecek apakah varian terisi dan quantity > 0
  const hasSelection = variant !== '' && quantity > 0;

  // 6. Manipulasi DOM: menampilkan summary sesuai format persis di slide:
  //    "Varian [variant] | Jumlah [quantity] | Subtotal Rp [subtotal] | Pilihan terisi: [hasSelection]"
  summary.textContent = 'Varian ' + (variant || '-')
    + ' | Jumlah ' + quantity
    + ' | Subtotal Rp ' + subtotal
    + ' | Pilihan terisi: ' + hasSelection;

  // Styling visual feedback untuk summary
  summary.classList.remove('has-error');
  summary.classList.add('is-updated');

  // Log ke console untuk verifikasi pengujian
  console.log('[Kalkulasi Berhasil]', {
    price: price,
    quantity: quantity,
    subtotal: subtotal,
    variant: variant,
    hasSelection: hasSelection
  });
}

// Event Listener saat form di-submit (Klik tombol "Update Pilihan")
if (form) {
  form.addEventListener('submit', (event) => {
    // Mencegah halaman me-reload (default action browser saat form submit)
    event.preventDefault();

    // Validasi nilai quantity sebelum menghitung
    const rawQty = quantityInput.value;
    if (rawQty === '' || Number(rawQty) < 1 || !Number.isInteger(Number(rawQty))) {
      summary.textContent = 'Peringatan: Jumlah pembelian harus bilangan bulat positif (minimal 1)!';
      summary.classList.add('has-error');
      return;
    }

    updateSelectionSummary();
  });
}

// Tambahan UX Interaktif: update langsung saat dropdown varian atau input quantity berubah
if (variantInput) {
  variantInput.addEventListener('change', () => {
    if (form && !form.hasAttribute('data-disabled')) {
      updateSelectionSummary();
    }
  });
}

if (quantityInput) {
  quantityInput.addEventListener('input', () => {
    if (form && !form.hasAttribute('data-disabled')) {
      // Pastikan bilangan positif
      if (Number(quantityInput.value) >= 1) {
        updateSelectionSummary();
      }
    }
  });
}

// Inisialisasi awal saat DOM siap jika bukan mode API async
document.addEventListener('DOMContentLoaded', () => {
  // Jika data-price sudah ada (mode hardcode di Halaman 1), jalankan kalkulasi awal
  if (priceElement && priceElement.dataset.price && priceElement.dataset.price !== '') {
    updateSelectionSummary();
  }
});
