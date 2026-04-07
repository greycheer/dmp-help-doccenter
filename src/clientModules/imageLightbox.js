/**
 * Image Lightbox — Client Module
 * Adds click-to-zoom functionality for all document images.
 * Also enforces max-width for portrait (height > width) images.
 */

function initLightbox() {
  // Create lightbox overlay
  const overlay = document.createElement('div');
  overlay.className = 'dmp-lightbox';
  const img = document.createElement('img');
  overlay.appendChild(img);
  document.body.appendChild(overlay);

  // Close on click
  overlay.addEventListener('click', () => {
    overlay.classList.remove('dmp-lightbox--active');
    document.body.style.overflow = '';
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('dmp-lightbox--active')) {
      overlay.classList.remove('dmp-lightbox--active');
      document.body.style.overflow = '';
    }
  });

  // Observe DOM for image loading (handles SPA navigation)
  function processImages() {
    const images = document.querySelectorAll('.markdown img:not(.dmp-img-processed)');
    images.forEach((el) => {
      el.classList.add('dmp-img-processed');

      // Wait for image to load to detect orientation
      if (el.complete && el.naturalWidth > 0) {
        applyImageSize(el);
      } else {
        el.addEventListener('load', () => applyImageSize(el), { once: true });
      }

      // Click to zoom
      el.addEventListener('click', () => {
        img.src = el.src;
        img.alt = el.alt || '';
        overlay.classList.add('dmp-lightbox--active');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  function applyImageSize(el) {
    const screenH = window.innerHeight;
    const maxH = Math.round(screenH / 3); // never exceed 1/3 viewport height
    const w = el.naturalWidth;
    const h = el.naturalHeight;

    if (h > maxH) {
      // Scale down proportionally
      const ratio = maxH / h;
      el.style.maxWidth = Math.round(w * ratio) + 'px';
      el.style.maxHeight = maxH + 'px';
    } else if (h > w) {
      // Portrait but already shorter than 1/3 screen — still cap width
      el.style.maxWidth = Math.min(w, 360) + 'px';
    }
    // Landscape / square: cap at 100% (Docusaurus container handles width)
    el.style.display = 'block';
    el.style.marginLeft = 'auto';
    el.style.marginRight = 'auto';
  }

  // Run on load and after SPA navigation
  processImages();

  // MutationObserver for dynamic content
  const observer = new MutationObserver(() => {
    processImages();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// Wrap in browser-only execution
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
  } else {
    initLightbox();
  }
}
