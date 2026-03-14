// app.js — Lógica principal de Herramientas IA por Profesión
'use strict';

(function () {
  // Referencias DOM
  const categoriesContainer = document.getElementById('categories-container');
  const categoryNavList = document.getElementById('category-nav-list');
  const searchInput = document.getElementById('search-input');
  const counterEl = document.getElementById('counter');
  const emptyState = document.getElementById('empty-state');
  const errorState = document.getElementById('error-state');
  const backToTop = document.getElementById('back-to-top');
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('.theme-toggle__icon');
  const footerUpdate = document.getElementById('footer-update');
  const itemlistJsonLd = document.getElementById('itemlist-jsonld');

  let data = null;
  let debounceTimer = null;

  // Inicialización
  init();

  async function init() {
    loadTheme();
    try {
      const response = await fetch('herramientas.json');
      if (!response.ok) throw new Error('Error de red');
      data = await response.json();
      renderApp(data);
      setupSearch();
      setupScrollSpy();
      setupBackToTop();
      setupThemeToggle();
      generateItemListJsonLd(data);
    } catch (err) {
      errorState.hidden = false;
    }
  }

  // Renderizar toda la aplicación
  function renderApp(appData) {
    const categorias = appData.categorias;
    const totalHerramientas = categorias.reduce(function (sum, cat) {
      return sum + cat.herramientas.length;
    }, 0);

    // Contador
    counterEl.textContent = totalHerramientas + ' herramientas en ' + categorias.length + ' categorías';

    // Fecha actualización en footer
    if (appData.meta && appData.meta.ultima_actualizacion) {
      footerUpdate.textContent = 'Última actualización: ' + appData.meta.ultima_actualizacion;
    }

    // Navegación
    renderNav(categorias);

    // Secciones
    renderCategories(categorias);
  }

  // Renderizar navegación de categorías
  function renderNav(categorias) {
    categoryNavList.textContent = '';
    categorias.forEach(function (cat) {
      var li = document.createElement('li');
      li.className = 'category-nav__item';

      var a = document.createElement('a');
      a.className = 'category-nav__link';
      a.href = '#' + cat.id;
      a.textContent = (cat.emoji || '') + ' ' + cat.nombre;
      a.setAttribute('data-category-id', cat.id);

      li.appendChild(a);
      categoryNavList.appendChild(li);
    });
  }

  // Renderizar categorías y tarjetas
  function renderCategories(categorias, filter) {
    categoriesContainer.textContent = '';
    var visibleCount = 0;

    categorias.forEach(function (cat) {
      var herramientas = cat.herramientas;

      // Filtrar si hay búsqueda
      if (filter) {
        var lowerFilter = filter.toLowerCase();
        herramientas = herramientas.filter(function (h) {
          return (
            h.nombre.toLowerCase().indexOf(lowerFilter) !== -1 ||
            h.descripcion.toLowerCase().indexOf(lowerFilter) !== -1 ||
            h.caso_uso.toLowerCase().indexOf(lowerFilter) !== -1
          );
        });
      }

      if (herramientas.length === 0) return;
      visibleCount += herramientas.length;

      // Sección
      var section = document.createElement('section');
      section.className = 'category-section';
      section.id = cat.id;
      section.setAttribute('aria-labelledby', cat.id + '-title');

      // Header de sección
      var header = document.createElement('div');
      header.className = 'category-section__header';

      var emoji = document.createElement('span');
      emoji.className = 'category-section__emoji';
      emoji.setAttribute('aria-hidden', 'true');
      emoji.textContent = cat.emoji || '';

      var title = document.createElement('h2');
      title.className = 'category-section__title';
      title.id = cat.id + '-title';
      title.textContent = cat.nombre;

      var count = document.createElement('span');
      count.className = 'category-section__count';
      count.textContent = herramientas.length + ' herramientas';

      header.appendChild(emoji);
      header.appendChild(title);
      header.appendChild(count);
      section.appendChild(header);

      // Grid de tarjetas
      var grid = document.createElement('div');
      grid.className = 'tools-grid';

      herramientas.forEach(function (h) {
        grid.appendChild(createToolCard(h));
      });

      section.appendChild(grid);
      categoriesContainer.appendChild(section);
    });

    // Estado vacío
    emptyState.hidden = visibleCount > 0;

    // Actualizar contador si hay filtro
    if (filter) {
      counterEl.textContent = visibleCount + ' resultados encontrados';
    } else if (data) {
      var total = data.categorias.reduce(function (sum, c) {
        return sum + c.herramientas.length;
      }, 0);
      counterEl.textContent = total + ' herramientas en ' + data.categorias.length + ' categorías';
    }
  }

  // Crear tarjeta de herramienta (sin innerHTML)
  function createToolCard(h) {
    var card = document.createElement('article');
    card.className = 'tool-card' + (h.destacado ? ' tool-card--destacado' : '');

    // Header
    var cardHeader = document.createElement('div');
    cardHeader.className = 'tool-card__header';

    var nameEl = document.createElement('h3');
    nameEl.className = 'tool-card__name';

    var link = document.createElement('a');
    link.href = h.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = h.nombre;
    nameEl.appendChild(link);
    cardHeader.appendChild(nameEl);

    if (h.destacado) {
      var badge = document.createElement('span');
      badge.className = 'tool-card__badge-destacado';
      badge.textContent = '⭐ Destacado';
      cardHeader.appendChild(badge);
    }

    card.appendChild(cardHeader);

    // Descripción
    var desc = document.createElement('p');
    desc.className = 'tool-card__desc';
    desc.textContent = h.descripcion;
    card.appendChild(desc);

    // Caso de uso
    if (h.caso_uso) {
      var caso = document.createElement('p');
      caso.className = 'tool-card__caso';
      caso.textContent = '💡 ' + h.caso_uso;
      card.appendChild(caso);
    }

    // Badges
    var badges = document.createElement('div');
    badges.className = 'tool-card__badges';

    // Badge de acceso
    var accessBadge = document.createElement('span');
    var accessClass = 'badge';
    if (h.tipo_acceso === 'gratis') accessClass += ' badge--gratis';
    else if (h.tipo_acceso === 'freemium') accessClass += ' badge--freemium';
    else if (h.tipo_acceso === 'open-source') accessClass += ' badge--open-source';
    accessBadge.className = accessClass;
    accessBadge.textContent = h.tipo_acceso;
    badges.appendChild(accessBadge);

    // Badge de idioma
    if (h.idioma) {
      var langBadge = document.createElement('span');
      langBadge.className = 'badge badge--idioma';
      langBadge.textContent = h.idioma;
      badges.appendChild(langBadge);
    }

    card.appendChild(badges);

    return card;
  }

  // Búsqueda con debounce
  function setupSearch() {
    searchInput.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        var query = searchInput.value.trim();
        renderCategories(data.categorias, query || null);
      }, 300);
    });
  }

  // Scroll spy — marca categoría activa en nav
  function setupScrollSpy() {
    var sections = [];
    var navLinks = {};

    function refreshSections() {
      sections = Array.from(document.querySelectorAll('.category-section'));
      navLinks = {};
      document.querySelectorAll('.category-nav__link').forEach(function (link) {
        navLinks[link.getAttribute('data-category-id')] = link;
      });
    }

    refreshSections();

    // Observar con IntersectionObserver
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var id = entry.target.id;
          if (entry.isIntersecting && navLinks[id]) {
            // Desactivar todos
            Object.values(navLinks).forEach(function (l) {
              l.classList.remove('active');
            });
            navLinks[id].classList.add('active');
            // Scroll nav si es necesario
            navLinks[id].scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    sections.forEach(function (sec) {
      observer.observe(sec);
    });

    // Re-observar tras búsquedas (MutationObserver)
    var mutationObs = new MutationObserver(function () {
      observer.disconnect();
      refreshSections();
      sections.forEach(function (sec) {
        observer.observe(sec);
      });
    });
    mutationObs.observe(categoriesContainer, { childList: true });
  }

  // Botón volver arriba
  function setupBackToTop() {
    window.addEventListener('scroll', function () {
      backToTop.hidden = window.scrollY < 400;
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Tema claro/oscuro
  function loadTheme() {
    var saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    updateThemeIcon();
  }

  function setupThemeToggle() {
    themeToggle.addEventListener('click', function () {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
      updateThemeIcon();
    });
  }

  function updateThemeIcon() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    themeIcon.textContent = isDark ? '☀️' : '🌙';
  }

  // Generar ItemList JSON-LD
  function generateItemListJsonLd(appData) {
    var items = [];
    var position = 1;
    appData.categorias.forEach(function (cat) {
      cat.herramientas.forEach(function (h) {
        items.push({
          '@type': 'ListItem',
          position: position++,
          name: h.nombre,
          url: h.url
        });
      });
    });

    var jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: appData.meta.titulo,
      description: appData.meta.descripcion,
      numberOfItems: items.length,
      itemListElement: items
    };

    itemlistJsonLd.textContent = JSON.stringify(jsonLd);
  }
})();
