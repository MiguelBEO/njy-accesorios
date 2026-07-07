import { useState, useEffect } from 'react'

interface Product { id: number; title: string; precio: number; slug: string; categoria: string }
interface Category { id: number; title: string; slug: string }

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [lastProducts, setLastProducts] = useState<Product[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([prods, cats]) => {
      setProducts(prods)
      setCategories(cats)
      setLastProducts(prods.slice(0, 5))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #F5E1E4', borderTopColor: '#E8A0B4', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: '#8B3A4F', fontSize: 14 }}>Cargando...</p>
        <style>{'@keyframes spin { to { transform: rotate(360deg) } }'}</style>
      </div>
    )
  }

  const totalValue = products.reduce((s, p) => s + p.precio, 0)
  const avgPrice = products.length > 0 ? Math.round(totalValue / products.length) : 0

  const cardStyle: React.CSSProperties = {
    background: 'white', borderRadius: 16, padding: '20px 24px',
    border: '1px solid #F5E1E4', boxShadow: '0 2px 8px rgba(139,58,79,0.06)',
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, color: '#8B3A4F', marginBottom: 4 }}>Dashboard</h1>
        <p style={{ color: '#C05A7A', fontSize: 14 }}>Bienvenida al panel de administración de N&J</p>
      </div>

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={cardStyle}>
          <p style={{ fontSize: 12, color: '#C05A7A', fontWeight: 600, letterSpacing: '0.5px', marginBottom: 8, textTransform: 'uppercase' }}>Total Productos</p>
          <p style={{ fontSize: 32, fontWeight: 700, color: '#8B3A4F', fontFamily: "'Playfair Display', Georgia, serif" }}>{products.length}</p>
        </div>
        <div style={cardStyle}>
          <p style={{ fontSize: 12, color: '#C05A7A', fontWeight: 600, letterSpacing: '0.5px', marginBottom: 8, textTransform: 'uppercase' }}>Categorías</p>
          <p style={{ fontSize: 32, fontWeight: 700, color: '#8B3A4F', fontFamily: "'Playfair Display', Georgia, serif" }}>{categories.length}</p>
        </div>
        <div style={cardStyle}>
          <p style={{ fontSize: 12, color: '#C05A7A', fontWeight: 600, letterSpacing: '0.5px', marginBottom: 8, textTransform: 'uppercase' }}>Precio Promedio</p>
          <p style={{ fontSize: 32, fontWeight: 700, color: '#D4AF37', fontFamily: "'Playfair Display', Georgia, serif" }}>${avgPrice}</p>
        </div>
        <div style={cardStyle}>
          <p style={{ fontSize: 12, color: '#C05A7A', fontWeight: 600, letterSpacing: '0.5px', marginBottom: 8, textTransform: 'uppercase' }}>Valor Total</p>
          <p style={{ fontSize: 32, fontWeight: 700, color: '#D4AF37', fontFamily: "'Playfair Display', Georgia, serif" }}>${totalValue}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, '@media (max-width: 767px)': { gridTemplateColumns: '1fr' } }}>
        {/* Últimos productos */}
        <div style={cardStyle}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, color: '#8B3A4F', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>💎</span> Últimos Productos
          </h2>
          {lastProducts.length === 0 ? (
            <p style={{ color: '#C05A7A', fontSize: 13, fontStyle: 'italic' }}>Aún no hay productos. ¡Crea tu primer producto!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {lastProducts.map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#FFFCF7', borderRadius: 10, border: '1px solid #FFE8EB' }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#2D2D2D', marginBottom: 2 }}>{p.title}</p>
                    <p style={{ fontSize: 11, color: '#C05A7A' }}>{p.categoria}</p>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#D4AF37' }}>${p.precio}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Categorías */}
        <div style={cardStyle}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, color: '#8B3A4F', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🏷️</span> Categorías
          </h2>
          {categories.length === 0 ? (
            <p style={{ color: '#C05A7A', fontSize: 13, fontStyle: 'italic' }}>No hay categorías definidas.</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {categories.map(c => (
                <span key={c.id} style={{ padding: '6px 14px', background: 'linear-gradient(135deg, #FFF5F6, #FFE8EB)', borderRadius: 20, fontSize: 13, color: '#8B3A4F', fontWeight: 500, border: '1px solid #FED5DC' }}>
                  {c.title}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Accesos rápidos */}
      <div style={{ ...cardStyle, marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#8B3A4F', marginRight: 8 }}>Acciones rápidas:</span>
        <ActionButton href="/admin" label="➕ Nuevo Producto" onClick={() => window.location.href = '/admin'} />
        <ActionButton href="/admin" label="📋 Ver Productos" onClick={() => window.location.href = '/admin'} />
        <ActionButton href="/" label="🌐 Ver Tienda" onClick={() => window.open('/', '_blank')} />
      </div>
    </div>
  )
}

function ActionButton({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px', borderRadius: 10, border: '1px solid #E8A0B4',
        background: 'white', color: '#8B3A4F', fontSize: 13, fontWeight: 500,
        cursor: 'pointer', transition: 'all 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#FFF5F6' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'white' }}
    >
      {label}
    </button>
  )
}
