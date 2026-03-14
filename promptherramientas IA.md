# Prompt Maestro - Directorio de Herramientas IA por Profesion

## Rol

Actua como un desarrollador web fullstack senior, experto en UX, SEO tecnico, accesibilidad y rendimiento.

## Objetivo

Crea una web estatica, moderna y responsive llamada **"Herramientas IA por Profesion"** para descubrir herramientas de inteligencia artificial clasificadas por perfiles profesionales.

La web debe cargar todos los datos desde un unico archivo `herramientas.json` para permitir actualizaciones rapidas sin tocar HTML/CSS/JS.

La solucion debe quedar preparada para monetizacion mediante **script publicitario externo configurable** (no hardcodear ningun proveedor concreto).

## Requisitos Tecnicos

- Stack: HTML5 semantico + CSS3 + JavaScript vanilla ES6+.
- Sin frameworks ni librerias externas para UI.
- Mobile-first y responsive.
- Accesibilidad WCAG 2.1 AA.
- Rendimiento: carga inicial rapida y render progresivo de listados.
- Seguridad: no usar `innerHTML` para contenido del JSON; usar `createElement` y `textContent`.

## Estructura del Proyecto

```txt
proyecto/
|- index.html
|- terminos.html
|- privacidad.html
|- cookies.html
|- sitemap.xml
|- robots.txt
|- css/
|  |- styles.css
|- js/
|  |- app.js
|  |- cookies-banner.js
|- herramientas.json
|- img/
|  |- favicon.svg
```

## Categorias (20 Profesiones)

Usa exactamente estas 20 categorias como secciones del directorio:

1. Marketing y Growth
2. Ventas y CRM
3. Diseno UX/UI
4. Diseno Grafico e Ilustracion
5. Desarrollo de Software
6. Data Science y BI
7. Finanzas y Contabilidad
8. Legal y Compliance
9. Recursos Humanos
10. Educacion y Formacion
11. Atencion al Cliente
12. Ecommerce
13. Salud y Bienestar
14. Arquitectura e Ingenieria
15. Medios y Periodismo
16. Productividad Personal
17. Creadores de Contenido
18. Video y Edicion
19. Audio y Podcast
20. Operaciones y Logistica

## Requisitos de Research de Herramientas

- Minimo 12 herramientas por categoria (minimo total: 240).
- Cobertura de idiomas: ES, EN, PT, FR, DE e IT cuando sea posible.
- Evitar duplicados globales (una herramienta no debe repetirse salvo justificacion).
- Priorizar herramientas reales, activas y legitimamente accesibles.
- Incluir solo URLs `https://`.

## Formato de herramientas.json

```json
{
  "meta": {
    "titulo": "Herramientas IA por Profesion",
    "descripcion": "Directorio de herramientas de inteligencia artificial clasificadas por profesion",
    "version": "1.0",
    "ultima_actualizacion": "2026-03-14"
  },
  "categorias": [
    {
      "id": "marketing-growth",
      "nombre": "Marketing y Growth",
      "emoji": "📈",
      "descripcion": "Herramientas IA para estrategia, anuncios y contenido",
      "herramientas": [
        {
          "nombre": "Nombre herramienta",
          "url": "https://ejemplo.com",
          "descripcion": "Descripcion breve orientada a uso profesional (max 120 caracteres)",
          "idioma": "ES|EN|PT|FR|DE|IT|Multi",
          "tipo_acceso": "gratis|freemium|open-source",
          "caso_uso": "Que problema resuelve en esa profesion",
          "notas": "Opcional. Limites del plan gratuito",
          "destacado": false,
          "verificado": true
        }
      ]
    }
  ]
}
```

## Reglas de Calidad de Datos

- Cada categoria debe tener 12 o mas herramientas.
- `id` en kebab-case y unico por categoria.
- No placeholders (`ejemplo.com`, `tudominio.com`, etc.) en dataset final.
- Campo `verificado: true` solo si el enlace y el acceso free/freemium fueron comprobados.
- Descripciones claras, cortas y orientadas al valor para el usuario final.

## Diseño y UX

### Header
- Titulo: "Herramientas IA por Profesion".
- Subtitulo orientado a valor: "Encuentra herramientas de IA para tu trabajo en minutos".
- Buscador global con debounce 300ms.
- Contador dinamico: "X herramientas en Y categorias".

### Navegacion
- Barra horizontal de categorias (scrollable en mobile).
- Scroll suave y categoria activa con Intersection Observer.

### Tarjetas de Herramientas
- Nombre + enlace externo (`target="_blank"` y `rel="noopener noreferrer"`).
- Descripcion corta.
- Badge de idioma.
- Badge de tipo de acceso (gratis/freemium/open-source).
- Etiqueta de "Destacado".
- Texto de caso de uso profesional.

### Footer
- Fecha de ultima actualizacion desde JSON.
- Enlaces a terminos, privacidad y cookies.
- Link "Sugerir herramienta".

## SEO (Obligatorio)

### On-Page
- `<title>` unico y orientado a keyword principal.
- Meta description entre 150 y 160 caracteres.
- Canonical.
- Open Graph y Twitter Cards.
- Jerarquia H1/H2/H3 coherente.
- `lang="es"` en `<html>`.

### Datos Estructurados
- JSON-LD con `WebSite` y `ItemList`.
- Incluir `SearchAction` para el buscador interno.

### Indexacion
- Generar `sitemap.xml` con index + paginas legales.
- Generar `robots.txt` con ruta al sitemap.

## Monetizacion (Script Externo Propio)

- Preparar contenedores de anuncios:
  - `ad-slot--header`
  - `ad-slot--in-content`
  - `ad-slot--footer`
- No cargar script publicitario antes del consentimiento.
- En `cookies-banner.js`, cargar dinamicamente el script solo si `cookie_consent === 'all'`.

Ejemplo:

```javascript
function loadMonetizationScript() {
  const script = document.createElement('script');
  script.src = 'https://tu-red-publicitaria.com/script.js';
  script.setAttribute('data-site-id', 'TU_SITE_ID');
  script.async = true;
  document.head.appendChild(script);
}
```

## Consentimiento y Cookies (GDPR/LOPD)

- Banner visible en primera visita con:
  - Aceptar todo
  - Solo esenciales
  - Ver politica de cookies
- Guardar eleccion en `localStorage` (`cookie_consent`).
- Opcion para reabrir preferencias desde footer.
- No ejecutar analitica/publicidad sin consentimiento.

## Paginas Legales (Obligatorias)

1. `terminos.html`
- Objeto del sitio, responsabilidad sobre enlaces externos, propiedad intelectual, jurisdiccion.

2. `privacidad.html`
- Responsable, datos tratados, finalidad, base legal, derechos del usuario, transferencias internacionales.

3. `cookies.html`
- Tabla de cookies esenciales, analiticas y publicitarias.
- Guia para revocar consentimiento.

## Funcionalidades JavaScript

1. Cargar y renderizar `herramientas.json`.
2. Busqueda global por nombre, descripcion y caso de uso.
3. Filtro por categoria.
4. Tema claro/oscuro con persistencia en `localStorage`.
5. Scroll spy de categorias.
6. Estado vacio por categoria.
7. Manejo de error de carga JSON.
8. Boton "volver arriba".
9. Banner de cookies y carga condicional de monetizacion.

## Restricciones

- No usar frameworks UI.
- No usar `innerHTML` con datos externos.
- Enlaces externos siempre con `rel="noopener noreferrer"`.
- Codigo comentado en espanol, de forma breve y util.

## Entregables

Genera estos archivos completos:

1. `index.html`
2. `css/styles.css`
3. `js/app.js`
4. `js/cookies-banner.js`
5. `terminos.html`
6. `privacidad.html`
7. `cookies.html`
8. `sitemap.xml`
9. `robots.txt`
10. `herramientas.json` (ya generado con 250+ herramientas reales)

## Criterio de Aceptacion

- Web funcional y responsive.
- SEO tecnico implementado.
- Consentimiento de cookies funcionando.
- Preparada para conectar script de monetizacion externo.
- Dataset valido con 20 categorias y minimo 250 herramientas totales.
