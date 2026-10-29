// public/gallery-slider.js
// ---------------------------------------------------------------------------
// Modul Slider Galeri Foto Produk Interaktif (Dibimbing Bootcamp)
// Fitur:
// - Mendukung multiple images (slide/geser)
// - Tombol navigasi panah kiri/kanan (< >)
// - Indikator titik (dots) aktif
// - Counter foto (1 / 3, 2 / 3, 3 / 3)
// - Strip thumbnail yang bisa diklik
// - Mendukung Swipe Gestures (Layar Sentuh HP & Mouse Drag Desktop)
// ---------------------------------------------------------------------------

'use strict';

function setupGallerySlider(config) {
  const {
    galleryEl,
    images = [],
    altText = 'Foto Produk',
    badgeText = null
  } = config;

  if (!galleryEl || !images || images.length === 0) return null;

  // Bersihkan konten galeri sebelumnya
  galleryEl.innerHTML = '';

  let currentIndex = 0;
  const total = images.length;

  // 1. Wadah Gambar Utama (Slider Frame)
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'image-wrapper';
  imageWrapper.id = 'productSlider';

  // Badge Produk (misal: "Produk #1 (Hardcode)" atau "ID: 2 (API)")
  if (badgeText) {
    const badge = document.createElement('span');
    badge.className = 'product-badge';
    badge.id = 'productBadge';
    badge.textContent = badgeText;
    imageWrapper.appendChild(badge);
  }

  // Counter Slide (1 / 3)
  const counter = document.createElement('span');
  counter.className = 'slider-counter';
  counter.id = 'sliderCounter';
  counter.textContent = `1 / ${total}`;
  imageWrapper.appendChild(counter);

  // Track Slide (bergerak horizontal)
  const track = document.createElement('div');
  track.className = 'slider-track';
  track.id = 'sliderTrack';

  images.forEach((imgUrl, i) => {
    const slide = document.createElement('div');
    slide.className = `slider-slide ${i === 0 ? 'active' : ''}`;
    slide.dataset.index = i;

    const img = document.createElement('img');
    img.src = imgUrl;
    img.alt = `${altText} - Foto ke-${i + 1}`;
    img.className = 'product-img';
    if (i === 0) img.id = 'productImage'; // Kompatibilitas dengan selector yang ada
    img.loading = i === 0 ? 'eager' : 'lazy';

    slide.appendChild(img);
    track.appendChild(slide);
  });
  imageWrapper.appendChild(track);

  // Tombol Navigasi Panah (Kiri & Kanan)
  let prevBtn, nextBtn;
  if (total > 1) {
    prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'slider-arrow slider-arrow-prev';
    prevBtn.id = 'sliderPrev';
    prevBtn.setAttribute('aria-label', 'Gambar Sebelumnya');
    prevBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    `;

    nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'slider-arrow slider-arrow-next';
    nextBtn.id = 'sliderNext';
    nextBtn.setAttribute('aria-label', 'Gambar Selanjutnya');
    nextBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    `;

    imageWrapper.appendChild(prevBtn);
    imageWrapper.appendChild(nextBtn);
  }

  // Dots Indikator
  const dotElements = [];
  if (total > 1) {
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slider-dots';
    dotsContainer.id = 'sliderDots';

    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Lihat foto ke-${i + 1}`);
      dot.dataset.index = i;
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(i);
      });
      dotsContainer.appendChild(dot);
      dotElements.push(dot);
    }
    imageWrapper.appendChild(dotsContainer);
  }

  galleryEl.appendChild(imageWrapper);

  // 2. Baris Thumbnail di Bawah Gambar Utama
  const thumbElements = [];
  if (total > 1) {
    const thumbsContainer = document.createElement('div');
    thumbsContainer.className = 'gallery-thumbnails';
    thumbsContainer.id = 'galleryThumbnails';

    images.forEach((imgUrl, i) => {
      const thumb = document.createElement('button');
      thumb.type = 'button';
      thumb.className = `thumbnail-item ${i === 0 ? 'active' : ''}`;
      thumb.dataset.index = i;
      thumb.setAttribute('aria-label', `Thumbnail foto ke-${i + 1}`);

      const thumbImg = document.createElement('img');
      thumbImg.src = imgUrl;
      thumbImg.alt = `Thumbnail ke-${i + 1}`;
      thumb.appendChild(thumbImg);

      thumb.addEventListener('click', () => {
        goToSlide(i);
      });

      thumbsContainer.appendChild(thumb);
      thumbElements.push(thumb);
    });

    galleryEl.appendChild(thumbsContainer);
  }

  // 3. Teks Keterangan di Bawah Galeri
  const caption = document.createElement('p');
  caption.className = 'image-caption';
  caption.textContent = total > 1
    ? '✓ Geser foto (swipe), gunakan panah, atau klik thumbnail untuk melihat variasi'
    : '✓ Foto resmi bersertifikasi garansi produk asli';
  galleryEl.appendChild(caption);

  // Fungsi Pindah Slide
  function goToSlide(index) {
    if (index < 0) {
      currentIndex = total - 1; // Loop ke foto terakhir
    } else if (index >= total) {
      currentIndex = 0; // Loop kembali ke foto pertama
    } else {
      currentIndex = index;
    }

    // Geser lintasan track
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Perbarui teks counter
    counter.textContent = `${currentIndex + 1} / ${total}`;

    // Perbarui dot aktif
    dotElements.forEach((d, idx) => {
      d.classList.toggle('active', idx === currentIndex);
    });

    // Perbarui thumbnail aktif
    thumbElements.forEach((t, idx) => {
      t.classList.toggle('active', idx === currentIndex);
    });
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  // Event Klik Tombol Panah
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      prevSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nextSlide();
    });
  }

  // Interaktivitas Swipe / Geser (Touch Screen & Mouse Drag)
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  // Touch Events untuk Mobile / Layar Sentuh
  imageWrapper.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    currentX = startX;
    isDragging = true;
  }, { passive: true });

  imageWrapper.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
  }, { passive: true });

  imageWrapper.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    const diff = startX - currentX;
    const threshold = 40; // Batas minimal jarak usap (pixel)
    if (diff > threshold) {
      nextSlide();
    } else if (diff < -threshold) {
      prevSlide();
    }
  });

  // Mouse Drag Events untuk Komputer / Laptop
  imageWrapper.addEventListener('mousedown', (e) => {
    if (e.target.closest('.slider-arrow') || e.target.closest('.slider-dots')) return;
    startX = e.clientX;
    currentX = startX;
    isDragging = true;
    imageWrapper.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    currentX = e.clientX;
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    imageWrapper.style.cursor = '';
    const diff = startX - currentX;
    const threshold = 40;
    if (diff > threshold) {
      nextSlide();
    } else if (diff < -threshold) {
      prevSlide();
    }
  });

  return {
    goToSlide,
    nextSlide,
    prevSlide
  };
}

// Inisialisasi otomatis jika terdapat data attributes di .product-gallery
document.addEventListener('DOMContentLoaded', () => {
  const galleries = document.querySelectorAll('.product-gallery[data-images]');
  galleries.forEach((gallery) => {
    try {
      const images = JSON.parse(gallery.getAttribute('data-images'));
      const altText = gallery.getAttribute('data-alt') || 'Foto Produk';
      const badgeText = gallery.getAttribute('data-badge') || null;
      setupGallerySlider({
        galleryEl: gallery,
        images,
        altText,
        badgeText
      });
    } catch (e) {
      console.error('Gagal inisialisasi slider galeri:', e);
    }
  });
});

