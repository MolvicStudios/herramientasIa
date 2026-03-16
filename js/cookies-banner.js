// cookies-banner.js — Gestión de consentimiento de cookies (GDPR/LOPD)
'use strict';

(function () {
  var STORAGE_KEY = 'cookie_consent';
  var banner = document.getElementById('cookie-banner');
  var acceptAllBtn = document.getElementById('cookie-accept-all');
  var essentialBtn = document.getElementById('cookie-essential');
  var preferencesBtn = document.getElementById('cookie-preferences');

  init();

  function init() {
    var consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      showBanner();
    }
    setupListeners();
  }

  function showBanner() {
    if (banner) banner.hidden = false;
  }

  function hideBanner() {
    if (banner) banner.hidden = true;
  }

  function setupListeners() {
    if (acceptAllBtn) {
      acceptAllBtn.addEventListener('click', function () {
        localStorage.setItem(STORAGE_KEY, 'all');
        hideBanner();
      });
    }

    if (essentialBtn) {
      essentialBtn.addEventListener('click', function () {
        localStorage.setItem(STORAGE_KEY, 'essential');
        hideBanner();
      });
    }

    // Reabrir preferencias desde footer
    if (preferencesBtn) {
      preferencesBtn.addEventListener('click', function () {
        localStorage.removeItem(STORAGE_KEY);
        showBanner();
      });
    }
  }
})();
