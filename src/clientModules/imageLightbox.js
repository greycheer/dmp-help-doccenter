/**
 * Image Lightbox — Client Module (v3.1)
 * 
 * v3.1: plain overflow:hidden lock (no position:fixed scroll jump on close)
 * v3: display:none/flex, remove CSS transitions, stopImmediatePropagation
 * v2: backdrop-filter removal, pointer-events isolation (didn't fix freeze)
 */

(function () {
  if (typeof window === 'undefined') return;

  let overlay = null;
  let lbImg = null;
  let isOpen = false;

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

    lbImg.src = src;
    lbImg.alt = alt || '';

    overlay.classList.add('dmp-lightbox--active');

    // Simple overflow lock — no position:fixed to avoid scroll jump on close
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!isOpen) return;
    isOpen = false;

    overlay.classList.remove('dmp-lightbox--active');

    // Restore immediately — no scrollTo needed since scroll position is preserved
    document.body.style.overflow = '';

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
