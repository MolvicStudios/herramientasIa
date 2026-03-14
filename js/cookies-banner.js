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
    } else if (consent === 'all') {
      loadMonetizationScript();
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
        loadMonetizationScript();
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

  // Carga dinámica del script de monetización (solo tras consentimiento)
  function loadMonetizationScript() {
    // Configurar aquí la URL y el site-id del proveedor publicitario
    var AD_SCRIPT_URL = ''; // Ejemplo: 'https://tu-red-publicitaria.com/script.js'
    var AD_SITE_ID = '';    // Ejemplo: 'TU_SITE_ID'

    if (!AD_SCRIPT_URL) return; // No cargar si no está configurado

    var script = document.createElement('script');
    script.src = AD_SCRIPT_URL;
    if (AD_SITE_ID) {
      script.setAttribute('data-site-id', AD_SITE_ID);
    }
    script.async = true;
    document.head.appendChild(script);
  }
})();
