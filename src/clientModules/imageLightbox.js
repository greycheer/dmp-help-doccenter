/**
 * Image Lightbox — Client Module (v2)
 * Fixes: page freeze on GitHub Pages, pointer-events isolation,
 *        backdrop-filter removal, touch-action safety.
 */

function initLightbox() {
  // Create lightbox overlay
  const overlay = document.createElement('div');
  overlay.className = 'dmp-lightbox';
  const img = document.createElement('img');
  img.setAttribute('role', 'dialog');
  img.setAttribute('aria-label', 'Image preview');
  overlay.appendChild(img);
  document.body.appendChild(overlay);

  let isOpen = false;

  function openLightbox(src, alt) {
    if (isOpen) return;
    isOpen = true;
    img.src = src;
    img.alt = alt || '';
    overlay.classList.add('dmp-lightbox--active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!isOpen) return;
    isOpen = false;
    overlay.classList.remove('dmp-lightbox--active');
    document.body.style.overflow = '';
    img.src = '';
  }

  // Close on overlay click (but not on the image itself)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });

  // Close on image click (toggle behavior)
  img.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      e.preventDefault();
      e.stopPropagation();
      closeLightbox();
    }
  }, true); // capture phase to intercept before other handlers

  // Observe DOM for image loading (handles SPA navigation)
  function processImages() {
    const images = document.querySelectorAll('.markdown img:not(.dmp-img-processed)');
    images.forEach((el) => {
      el.classList.add('dmp-img-processed');
      el.style.cursor = 'zoom-in';

      // Wait for image to load to detect orientation
      if (el.complete && el.naturalWidth > 0) {
        applyImageSize(el);
      } else {
        el.addEventListener('load', () => applyImageSize(el), { once: true });
      }

      // Click to zoom — use capture to avoid Docusaurus interference
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openLightbox(el.src, el.alt || '');
      }, true);
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

  // MutationObserver for dynamic content (debounced)
  let rafId = null;
  const observer = new MutationObserver(() => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(processImages);
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
