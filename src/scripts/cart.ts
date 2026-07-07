export interface CartItem {
  slug: string
  title: string
  precio: number
  cantidad: number
  imagen: string
}

const STORAGE_KEY = 'njy-cart'
const CART_EVENT = 'njy-cart-update'

function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  window.dispatchEvent(new CustomEvent(CART_EVENT))
}

export function getItems(): CartItem[] {
  return getCart()
}

export function getCount(): number {
  return getCart().reduce((sum, item) => sum + item.cantidad, 0)
}

export function getTotal(): number {
  return getCart().reduce((sum, item) => sum + item.precio * item.cantidad, 0)
}

export function addItem(slug: string, title: string, precio: number, imagen: string): void {
  const items = getCart()
  const existing = items.find(i => i.slug === slug)
  if (existing) {
    existing.cantidad++
  } else {
    items.push({ slug, title, precio, cantidad: 1, imagen })
  }
  saveCart(items)
}

export function updateQuantity(slug: string, cantidad: number): void {
  const items = getCart()
  if (cantidad <= 0) {
    removeItem(slug)
    return
  }
  const item = items.find(i => i.slug === slug)
  if (item) {
    item.cantidad = cantidad
    saveCart(items)
  }
}

export function removeItem(slug: string): void {
  const items = getCart().filter(i => i.slug !== slug)
  saveCart(items)
}

export function clearCart(): void {
  saveCart([])
}

export function onCartUpdate(callback: () => void): () => void {
  const handler = () => callback()
  window.addEventListener(CART_EVENT, handler)
  return () => window.removeEventListener(CART_EVENT, handler)
}

const WA_NUMBER = '526181578134'

export function checkoutWhatsApp(items: CartItem[], nombreCliente: string = '', telefono: string = ''): void {
  if (items.length === 0) return

  const lines: string[] = []
  lines.push('🛍️ *NUEVO PEDIDO - N&J Accesorios y Belleza*')
  lines.push('')
  lines.push('*Detalles que te hacen brillar* ✨')
  lines.push('')

  if (nombreCliente) {
    lines.push(`👤 *Cliente:* ${nombreCliente}`)
  }
  if (telefono) {
    lines.push(`📱 *Teléfono:* ${telefono}`)
  }
  if (nombreCliente || telefono) {
    lines.push('')
  }

  lines.push('*Productos solicitados:*')

  let total = 0
  items.forEach((item, i) => {
    const subtotal = item.precio * item.cantidad
    total += subtotal
    lines.push(`${i + 1}️⃣ ${item.title} x${item.cantidad} — $${subtotal}`)
  })

  lines.push('')
  lines.push(`💰 *Total: $${total} MXN*`)
  lines.push('')
  lines.push('Quedo atenta a tu confirmación 🙌')

  const mensaje = encodeURIComponent(lines.join('\n'))
  window.open(`https://wa.me/${WA_NUMBER}?text=${mensaje}`, '_blank')
}
