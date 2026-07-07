# N&J Accesorios y Belleza — Proyecto Completo

## Sesión: 2026-07-06

### Stack
- **Framework:** Astro 5 + Tailwind CSS 3
- **CMS:** Decap CMS (panel admin en /admin)
- **Hosting:** Cloudflare Pages
- **Carrito:** localStorage + checkout WhatsApp
- **WhatsApp:** +52 618 157 8134
- **Instagram:** @accesoriosnyv

### Estructura del proyecto
```
njy-accesorios/
├── src/
│   ├── layouts/Layout.astro       # Layout principal
│   ├── pages/
│   │   ├── index.astro            # Inicio
│   │   ├── productos.astro        # Catálogo con filtros
│   │   ├── producto/[slug].astro  # Detalle de producto
│   │   └── sobre-nosotros.astro   # Sobre la marca
│   ├── components/
│   │   ├── Navbar.astro           # Header con logo + IG
│   │   ├── Footer.astro           # Footer completo
│   │   ├── WhatsAppFloat.astro    # Botón flotante WhatsApp
│   │   ├── MobileTabBar.astro     # Navegación inferior móvil
│   │   ├── CartIcon.astro         # Ícono carrito con badge
│   │   ├── CartDrawer.astro       # Drawer carrito con checkout
│   │   ├── ProductCard.astro      # Tarjeta de producto
│   │   ├── ProductGrid.astro      # Grid de productos
│   │   └── AddToCartBtn.astro     # Botón agregar al carrito
│   ├── content/
│   │   ├── config.ts              # Schema de productos
│   │   └── productos/             # Productos en .md
│   ├── scripts/cart.ts            # Lógica de carrito
│   └── styles/global.css          # Estilos globales + Tailwind
├── public/
│   ├── admin/                     # Decap CMS
│   │   ├── index.html             # Punto de entrada
│   │   └── config.yml             # Configuración del CMS
│   ├── images/placeholder.svg     # Placeholder para productos
│   └── favicon.svg                # Favicon
├── astro.config.mjs
├── tailwind.config.mjs            # Paleta de colores N&J
└── package.json
```

### Diseño Visual
- **Paleta:** Rosa pálido #F5E1E4, Rosa medio #E8A0B4, Dorado #D4AF37, Marfil #FFF8F0, Rosa profundo #8B3A4F
- **Tipografía:** Playfair Display (títulos), Montserrat (cuerpo), Great Vibes (script)
- **Mobile-first:** Tab bar inferior en móvil, drawer carrito, filtros swipe

### Carrito + WhatsApp
- Los productos se agregan al carrito (almacenado en localStorage)
- El carrito persiste entre páginas
- Checkout genera mensaje personalizado con todos los items y total
- Número WhatsApp: 526181578134 (formato wa.me)

### Para desplegar
1. Crear repo en GitHub
2. Subir código
3. Conectar Cloudflare Pages al repo
4. Configurar build: `npm run build` / output: `dist`
5. Configurar variable de entorno si es necesario
6. Para el admin: crear GitHub OAuth App y configurar en config.yml

### Build
- Comando: `npm run build`
- Output: `dist/`
- Dev: `npm run dev`
