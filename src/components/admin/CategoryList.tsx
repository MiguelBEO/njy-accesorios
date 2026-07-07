import { useState, useEffect } from 'react'

interface Category { id: number; slug: string; title: string; descripcion: string }

interface Props {
  onNew: () => void
  onEdit: (slug: string) => void
}

export default function CategoryList({ onNew, onEdit }: Props) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`¿Eliminar la categoría "${title}"?`)) return
    setDeleting(slug)
    await fetch(`/api/categories/${slug}`, { method: 'DELETE' })
    setDeleting(null)
    load()
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #F5E1E4', borderTopColor: '#E8A0B4', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: '#8B3A4F', fontSize: 14 }}>Cargando categorías...</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, color: '#8B3A4F', marginBottom: 4 }}>🏷️ Categorías</h1>
          <p style={{ color: '#C05A7A', fontSize: 14 }}>{categories.length} categoría(s)</p>
        </div>
        <button
          onClick={onNew}
          style={{
            padding: '10px 20px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, #E8A0B4, #D4AF37)', color: 'white',
            fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          + Nueva Categoría
        </button>
      </div>

      {categories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 16, border: '1px solid #F5E1E4' }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>🏷️</p>
          <p style={{ color: '#8B3A4F', fontSize: 16, fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 8 }}>No hay categorías</p>
          <p style={{ color: '#C05A7A', fontSize: 13, marginBottom: 20 }}>Crea categorías para organizar tus productos.</p>
          <button onClick={onNew} style={{ padding: '10px 24px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #E8A0B4, #D4AF37)', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            + Crear Categoría
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {categories.map(c => (
            <div key={c.id} style={{ background: 'white', borderRadius: 16, border: '1px solid #F5E1E4', padding: 20, boxShadow: '0 2px 8px rgba(139,58,79,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, color: '#8B3A4F' }}>{c.title}</h3>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => onEdit(c.slug)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #E8A0B4', background: 'white', color: '#8B3A4F', fontSize: 11, cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FFF5F6'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  >✏️</button>
                  <button onClick={() => handleDelete(c.slug, c.title)} disabled={deleting === c.slug} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #FFC0C0', background: 'white', color: '#D04040', fontSize: 11, cursor: deleting === c.slug ? 'not-allowed' : 'pointer', opacity: deleting === c.slug ? 0.6 : 1 }}
                    onMouseEnter={e => { if (!deleting) e.currentTarget.style.background = '#FFF0F0' }}
                    onMouseLeave={e => { if (!deleting) e.currentTarget.style.background = 'white' }}
                  >🗑️</button>
                </div>
              </div>
              <p style={{ color: '#C05A7A', fontSize: 12 }}>{c.descripcion || 'Sin descripción'}</p>
              <div style={{ marginTop: 8, fontSize: 11, color: '#E8A0B4' }}>
                Slug: <code style={{ background: '#FFF5F6', padding: '1px 6px', borderRadius: 4 }}>{c.slug}</code>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
