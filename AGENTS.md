# N&J Accesorios y Belleza — Proyecto Completo

## Sesión: 2026-07-06

### Stack
- **Framework:** Astro 5 + Tailwind CSS 3 + React
- **Backend:** Cloudflare D1 (SQLite serverless) + Pages Functions
- **Auth:** Sesión por cookie (usuario/clave en DB)
- **Admin:** React SPA en `/admin` con login, dashboard, CRUDs
- **Carrito:** localStorage + checkout WhatsApp
- **WhatsApp:** +52 618 157 8134
- **Instagram:** @accesoriosnyv
- **Hosting:** Cloudflare Pages (https://njy-accesorios.pages.dev)

### Admin Panel
- **URL:** https://njy-accesorios.pages.dev/admin
- **Usuario:** NoraWrite
- **Contraseña:** lcdll22
- Secciones: Dashboard, Productos (CRUD), Categorías (CRUD), Configuración

### Estructura del proyecto
```
njy-accesorios/
├── src/
│   ├── lib/
│   │   ├── db.ts           # Funciones D1 (productos, categorías, settings)
│   │   └── auth.ts         # Login/logout/validación de sesión
│   ├── pages/
│   │   ├── index.astro     # Inicio (SSR, datos desde D1)
│   │   ├── productos.astro # Catálogo con filtros
│   │   ├── producto/[slug].astro  # Detalle de producto
│   │   ├── sobre-nosotros.astro   # Sobre la marca
│   │   ├── api/            # API routes (login, CRUD productos/categorías/settings)
│   │   └── admin/[...path].astro  # Admin SPA shell
│   ├── components/
│   │   ├── admin/          # React components del admin (9 archivos)
│   │   ├── Navbar, Footer, CartDrawer, etc.
│   │   └── ProductCard, ProductGrid
│   ├── layouts/Layout.astro
│   └── styles/global.css
├── db/schema.sql           # Esquema D1
├── wrangler.toml           # Config Cloudflare (binding D1)
├── astro.config.mjs        # output: 'server', adapter: @astrojs/cloudflare
└── package.json
```

### Diseño Visual
- **Paleta:** Rosa pálido #F5E1E4, Rosa medio #E8A0B4, Dorado #D4AF37, Marfil #FFF8F0, Rosa profundo #8B3A4F
- **Tipografía:** Playfair Display (títulos), Montserrat (cuerpo), Great Vibes (script)
- **Mobile-first:** Tab bar inferior en móvil, drawer carrito, filtros swipe

### Comandos
- `npm run dev` — desarrollo local
- `npm run build` — build local
- `npm run db:migrate` — ejecutar schema.sql en D1 remoto
- `npx wrangler pages deploy dist --project-name njy-accesorios --branch main` — deploy directo

### D1 Database
- **Nombre:** njy-db
- **ID:** 6dc110f1-5390-4fb8-8ae3-61396f104def
- **Tablas:** products, categories, settings, sessions
- **Binding:** DB (configurado en Pages dashboard)

### Build
- Comando: `npm run build`
- Output: `dist/` (contiene `_worker.js/` para SSR)
- Adapter: `@astrojs/cloudflare` con `output: 'server'`
