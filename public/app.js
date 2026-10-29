// public/app.js
// Client-side script untuk mengambil data dari REST API Backend
// dan mengisi field Halaman Detail Produk secara otomatis (Langkah 2)

// Konfigurasi Base URL API
const API_BASE_URL = window.location.origin.includes('http')
  ? `${window.location.origin}/api/products`
  : 'http://localhost:3000/api/products';

// DOM Elements
const productSelect = document.getElementById('productSelect');
const btnReload = document.getElementById('btnReload');
const statusEndpoint = document.getElementById('statusEndpoint');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const errorMessageTitle = document.getElementById('errorMessageTitle');
const errorMessageDesc = document.getElementById('errorMessageDesc');
const productDetailCard = document.getElementById('productDetailCard');

// Field-field produk yang wajib diisi dari API:
const productName = document.getElementById('productName');
const breadcrumbName = document.getElementById('breadcrumbName');
const productBadge = document.getElementById('productBadge');
const productImage = document.getElementById('productImage');
const productPrice = document.getElementById('productPrice');
const variantOptions = document.getElementById('variantOptions');
const selectedVariantName = document.getElementById('selectedVariantName');
const inputQuantity = document.getElementById('inputQuantity');
const productQuantity = document.getElementById('productQuantity');
const productDescription = document.getElementById('productDescription');
const btnMinus = document.getElementById('btnMinus');
const btnPlus = document.getElementById('btnPlus');
const btnAddToCart = document.getElementById('btnAddToCart');
const btnBuyNow = document.getElementById('btnBuyNow');

// Live Inspector
const jsonResponsePreview = document.getElementById('jsonResponsePreview');
const btnToggleInspector = document.getElementById('btnToggleInspector');
const inspectorBody = document.getElementById('inspectorBody');

// State aktif
let currentProduct = null;
let maxStock = 1;

// Format angka ke format mata uang Rupiah
function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number);
}

// Fungsi utama: Fetch detail produk dari REST API
async function loadProductDetail(productId = 2) {
  // Tampilkan state loading
  loadingState.style.display = 'block';
  errorState.style.display = 'none';
  productDetailCard.style.opacity = '0.4';
  
  const endpointUrl = `${API_BASE_URL}/${productId}`;
  statusEndpoint.innerHTML = `Mengambil data: <code>GET ${endpointUrl}</code>`;

  try {
    const response = await fetch(endpointUrl);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} (${response.statusText})`);
    }

    const data = await response.json();
    currentProduct = data;

    // Render data ke tampilan halaman secara otomatis (Bukan Hardcode)
    renderProductDetail(data);

    // Tampilkan JSON di Live Inspector
    jsonResponsePreview.textContent = JSON.stringify(data, null, 2);
    statusEndpoint.innerHTML = `Status: <span style="color: #10b981; font-weight: bold;">200 OK</span> • Endpoint: <code>GET /api/products/${productId}</code>`;
  } catch (error) {
    console.error('Error saat fetch detail produk:', error);
    showError(
      'Gagal Menghubungi REST API',
      `Tidak dapat mengambil data dari ${endpointUrl}. Pastikan server backend Node.js sedang berjalan di http://localhost:3000. Error: ${error.message}`
    );
  } finally {
    loadingState.style.display = 'none';
    productDetailCard.style.opacity = '1';
  }
}

// Render data JSON API ke elemen DOM
function renderProductDetail(product) {
  // 1. Nama Product
  productName.textContent = product.name || 'Nama Produk Tidak Tersedia';
  breadcrumbName.textContent = product.name || 'Detail';
  productBadge.textContent = `ID: ${product.id}`;

  // 2. Harga Product
  if (typeof product.price === 'number') {
    productPrice.textContent = formatRupiah(product.price);
  } else {
    productPrice.textContent = `Rp ${product.price}`;
  }

  // 3. Foto Product
  productImage.src = product.image || 'https://via.placeholder.com/600x600?text=No+Image';
  productImage.alt = product.name || 'Foto Produk';

  // 4a. Variasi Product: Warna / Ukuran
  variantOptions.innerHTML = '';
  const variantsList = product.variants?.colorOrSize || [];
  
  if (Array.isArray(variantsList) && variantsList.length > 0) {
    variantsList.forEach((variant, index) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `variant-chip ${index === 0 ? 'active' : ''}`;
      chip.textContent = variant;
      
      chip.addEventListener('click', () => {
        document.querySelectorAll('.variant-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectedVariantName.textContent = variant;
      });

      variantOptions.appendChild(chip);
    });

    selectedVariantName.textContent = variantsList[0];
  } else {
    variantOptions.innerHTML = '<span style="color: #94a3b8; font-size: 0.85rem;">Tidak ada pilihan variasi</span>';
    selectedVariantName.textContent = '-';
  }

  // 4b. Variasi Product: Jumlah / Quantity
  maxStock = product.variants?.quantity || 1;
  productQuantity.textContent = maxStock;
  inputQuantity.value = 1;
  inputQuantity.max = maxStock;

  // 5. Deskripsi
  productDescription.textContent = product.description || 'Tidak ada deskripsi.';
}

// Tampilkan Pesan Error
function showError(title, desc) {
  errorMessageTitle.textContent = title;
  errorMessageDesc.textContent = desc;
  errorState.style.display = 'flex';
  jsonResponsePreview.textContent = `// Error:\n// ${desc}`;
  statusEndpoint.innerHTML = `Status: <span style="color: #ef4444; font-weight: bold;">Error</span> • Periksa koneksi backend`;
}

// Event Listeners: Kontrol Quantity
btnMinus.addEventListener('click', () => {
  let val = parseInt(inputQuantity.value, 10) || 1;
  if (val > 1) {
    inputQuantity.value = val - 1;
  }
});

btnPlus.addEventListener('click', () => {
  let val = parseInt(inputQuantity.value, 10) || 1;
  if (val < maxStock) {
    inputQuantity.value = val + 1;
  }
});

inputQuantity.addEventListener('change', () => {
  let val = parseInt(inputQuantity.value, 10);
  if (isNaN(val) || val < 1) val = 1;
  if (val > maxStock) val = maxStock;
  inputQuantity.value = val;
});

// Event Listeners: Switcher Dropdown Produk
productSelect.addEventListener('change', (e) => {
  const selectedId = e.target.value;
  loadProductDetail(selectedId);
});

// Event Listeners: Tombol Refresh
btnReload.addEventListener('click', () => {
  loadProductDetail(productSelect.value);
});

// Event Listeners: Toggle Live Inspector JSON
btnToggleInspector.addEventListener('click', () => {
  if (inspectorBody.style.display === 'none') {
    inspectorBody.style.display = 'block';
  } else {
    inspectorBody.style.display = 'none';
  }
});

// Feedback Tombol Aksi
btnAddToCart.addEventListener('click', () => {
  const selectedVariant = selectedVariantName.textContent;
  const qty = inputQuantity.value;
  alert(`Berhasil ditambahkan ke keranjang!\nProduk: ${currentProduct?.name}\nVariasi: ${selectedVariant}\nJumlah: ${qty}`);
});

btnBuyNow.addEventListener('click', () => {
  const selectedVariant = selectedVariantName.textContent;
  const qty = inputQuantity.value;
  const total = (currentProduct?.price || 0) * qty;
  alert(`Melanjutkan ke Checkout!\nProduk: ${currentProduct?.name}\nVariasi: ${selectedVariant}\nJumlah: ${qty}\nTotal: ${formatRupiah(total)}`);
});

// Inisialisasi awal saat halaman dibuka:
// Sesuai requirement tugas Langkah 2: Langsung muat detail produk 2!
document.addEventListener('DOMContentLoaded', () => {
  loadProductDetail(2);
});
