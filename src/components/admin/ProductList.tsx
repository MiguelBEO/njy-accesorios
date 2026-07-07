import { useState, useEffect } from 'react'

interface Product { id: number; slug: string; title: string; precio: number; categoria: string; imagen: string; destacado: number; created_at: string }

interface Props {
  onNew: () => void
  onEdit: (slug: string) => void
}

export default function ProductList({ onNew, onEdit }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const load = () => {
    setLoading(true)
    fetch('/api/products').then(r => r.json()).then(setProducts).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)) return
    setDeleting(slug)
    await fetch(`/api/products/${slug}`, { method: 'DELETE' })
    setDeleting(null)
    load()
  }

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.categoria.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #F5E1E4', borderTopColor: '#E8A0B4', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: '#8B3A4F', fontSize: 14 }}>Cargando productos...</p>
        <style>{'@keyframes spin { to { transform: rotate(360deg) } }'}</style>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, color: '#8B3A4F', marginBottom: 4 }}>💎 Productos</h1>
          <p style={{ color: '#C05A7A', fontSize: 14 }}>{products.length} producto(s) registrados</p>
        </div>
        <button
          onClick={onNew}
          style={{
            padding: '10px 20px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, #E8A0B4, #D4AF37)', color: 'white',
            fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          + Nuevo Producto
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', maxWidth: 400, padding: '10px 16px', borderRadius: 12,
            border: '1.5px solid #F5E1E4', fontSize: 14, outline: 'none', background: 'white', color: '#2D2D2D',
          }}
          onFocus={e => e.currentTarget.style.borderColor = '#E8A0B4'}
          onBlur={e => e.currentTarget.style.borderColor = '#F5E1E4'}
        />
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 16, border: '1px solid #F5E1E4' }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>💎</p>
          <p style={{ color: '#8B3A4F', fontSize: 16, fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 8 }}>No hay productos</p>
          <p style={{ color: '#C05A7A', fontSize: 13, marginBottom: 20 }}>
            {search ? 'No se encontraron productos con ese término.' : 'Comienza agregando tu primer producto.'}
          </p>
          {!search && (
            <button onClick={onNew} style={{ padding: '10px 24px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #E8A0B4, #D4AF37)', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              + Crear Producto
            </button>
          )}
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #F5E1E4', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#FFF5F6', borderBottom: '1px solid #F5E1E4' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#8B3A4F', fontWeight: 600, fontSize: 12, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Producto</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#8B3A4F', fontWeight: 600, fontSize: 12, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Categoría</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', color: '#8B3A4F', fontWeight: 600, fontSize: 12, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Precio</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: '#8B3A4F', fontWeight: 600, fontSize: 12, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Destacado</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: '#8B3A4F', fontWeight: 600, fontSize: 12, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #FFE8EB', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FFFCF7'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {p.imagen ? (
                          <img src={p.imagen} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', background: '#F5E1E4' }} />
                        ) : (
                          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#F5E1E4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>💎</div>
                        )}
                        <span style={{ fontWeight: 600, color: '#2D2D2D' }}>{p.title}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#C05A7A', fontSize: 12 }}>{p.categoria}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#D4AF37' }}>${p.precio}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      {p.destacado ? <span style={{ fontSize: 16 }}>⭐</span> : <span style={{ color: '#F5E1E4', fontSize: 16 }}>☆</span>}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button
                          onClick={() => onEdit(p.slug)}
                          style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #E8A0B4', background: 'white', color: '#8B3A4F', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#FFF5F6' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'white' }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(p.slug, p.title)}
                          disabled={deleting === p.slug}
                          style={{
                            padding: '6px 12px', borderRadius: 8, border: '1px solid #FFC0C0',
                            background: deleting === p.slug ? '#FFF0F0' : 'white', color: '#D04040',
                            fontSize: 12, cursor: deleting === p.slug ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s', opacity: deleting === p.slug ? 0.6 : 1,
                          }}
                          onMouseEnter={e => { if (!deleting) e.currentTarget.style.background = '#FFF0F0' }}
                          onMouseLeave={e => { if (!deleting) e.currentTarget.style.background = 'white' }}
                        >
                          {deleting === p.slug ? '...' : 'Eliminar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
