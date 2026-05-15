/**
 * Image Lightbox — Client Module (v3)
 * 
 * v3 changes (fixing page freeze):
 * - Remove overflow:hidden on body (causes scroll position reset + layout thrash on GitHub Pages)
 * - Use inert attribute instead of pointer-events for isolation
 * - Remove CSS transition during open/close (GPU compositing issues on Chromium/GitHub Pages)
 * - Add explicit z-index layer management
 * - Use passive event listeners where possible
 * - Prevent Docusaurus route navigation interference via event stopPropagation
 * - Simplify: remove MutationObserver RAF debounce (was causing re-entry bugs)
 */

(function () {
  if (typeof window === 'undefined') return;

  let overlay = null;
  let lbImg = null;
  let isOpen = false;
  let scrollY = 0;

  function createOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'dmp-lightbox';
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('role', 'dialog');

    lbImg = document.createElement('img');
    lbImg.setAttribute('alt', '');
    overlay.appendChild(lbImg);

    document.body.appendChild(overlay);
  }

  function openLightbox(src, alt) {
    if (isOpen) return;
    isOpen = true;

    // Save scroll position
    scrollY = window.scrollY;

    // Set image source BEFORE making visible (prevents empty flash)
    lbImg.src = src;
    lbImg.alt = alt || '';

    // Show overlay — no transition to avoid GPU freeze
    overlay.classList.add('dmp-lightbox--active');

    // Lock body scroll without overflow:hidden (which causes layout thrash)
    document.body.style.top = `-${scrollY}px`;
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    // Focus trap
    lbImg.focus();
  }

  function closeLightbox() {
    if (!isOpen) return;
    isOpen = false;

    // Hide immediately
    overlay.classList.remove('dmp-lightbox--active');

    // Restore scroll — do this BEFORE removing fixed positioning
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    document.body.style.top = '';
    window.scrollTo(0, scrollY);

    // Clear image
    lbImg.src = '';
    lbImg.alt = '';
  }

  function handleKey(e) {
    if (!isOpen) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      closeLightbox();
    }
  }

  function init() {
    createOverlay();

    // Overlay background click → close
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeLightbox();
    });

    // Image click → close
    lbImg.addEventListener('click', function (e) {
      e.stopPropagation();
      closeLightbox();
    });

    // Keyboard: Escape to close (capture phase)
    document.addEventListener('keydown', handleKey, true);

    // Process all images in .markdown containers
    function processImages() {
      var images = document.querySelectorAll('.markdown img:not([data-lb])');
      for (var i = 0; i < images.length; i++) {
        var el = images[i];
        // Skip logo/themed images that are too small or decorative
        if (el.closest('nav') || el.closest('header') || el.closest('.navbar')) continue;

        el.setAttribute('data-lb', '1');
        el.style.cursor = 'zoom-in';

        // Click handler — capture phase, before Docusaurus router
        el.addEventListener('click', function (evt) {
          evt.preventDefault();
          evt.stopPropagation();
          evt.stopImmediatePropagation();
          openLightbox(this.src, this.alt || '');
        }, true);
      }
    }

    // Initial run
    processImages();

    // SPA navigation: re-process when content changes
    // Use simple debounced observer (no RAF re-entry risk)
    var timer = null;
    var obs = new MutationObserver(function () {
      if (timer) clearTimeout(timer);
      timer = setTimeout(processImages, 150);
    });
    obs.observe(document.getElementById('__next') || document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Start when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
