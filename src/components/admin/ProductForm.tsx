import { useState, useEffect, FormEvent } from 'react'

interface Props {
  slug?: string
  onSave: () => void
  onCancel: () => void
}

interface Category { slug: string; title: string }

export default function ProductForm({ slug, onSave, onCancel }: Props) {
  const isEdit = !!slug
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<Category[]>([])

  const [title, setTitle] = useState('')
  const [precio, setPrecio] = useState('')
  const [categoria, setCategoria] = useState('')
  const [categoriaSlug, setCategoriaSlug] = useState('')
  const [imagen, setImagen] = useState('')
  const [destacado, setDestacado] = useState(false)
  const [descripcion, setDescripcion] = useState('')

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(cats => {
      setCategories(cats)
      if (cats.length > 0 && !isEdit) {
        setCategoria(cats[0].title)
        setCategoriaSlug(cats[0].slug)
      }
    }).catch(() => {})

    if (isEdit && slug) {
      fetch(`/api/products/${slug}`).then(r => r.json()).then(p => {
        if (p.error) { setError(p.error); return }
        setTitle(p.title)
        setPrecio(String(p.precio))
        setCategoria(p.categoria)
        setCategoriaSlug(p.categoria_slug)
        setImagen(p.imagen || '')
        setDestacado(!!p.destacado)
        setDescripcion(p.descripcion || '')
      }).catch(() => setError('Error al cargar producto')).finally(() => setLoading(false))
    }
  }, [slug, isEdit])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const body = {
      title,
      precio: Number(precio),
      categoria,
      categoria_slug: categoriaSlug,
      imagen,
      destacado,
      descripcion,
    }

    try {
      let res: Response
      if (isEdit && slug) {
        res = await fetch(`/api/products/${slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      }

      if (res.ok) {
        onSave()
      } else {
        const data = await res.json()
        setError(data.error || 'Error al guardar')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  const handleCategoryChange = (catTitle: string) => {
    setCategoria(catTitle)
    const cat = categories.find(c => c.title === catTitle)
    if (cat) setCategoriaSlug(cat.slug)
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #F5E1E4', borderTopColor: '#E8A0B4', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: '#8B3A4F', fontSize: 14 }}>Cargando producto...</p>
      </div>
    )
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #F5E1E4',
    fontSize: 14, outline: 'none', background: '#FFFCF7', color: '#2D2D2D',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 12, fontWeight: 600, color: '#8B3A4F', marginBottom: 6, letterSpacing: '0.3px',
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, color: '#8B3A4F' }}>
          {isEdit ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: 16, border: '1px solid #F5E1E4', padding: 28, maxWidth: 700 }}>
        {error && (
          <div style={{ background: '#FFF0F0', border: '1px solid #FFC0C0', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#D04040' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div>
            <label style={labelStyle}>NOMBRE DEL PRODUCTO</label>
            <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Collar de Perlas" required />
          </div>
          <div>
            <label style={labelStyle}>PRECIO (MXN)</label>
            <input style={inputStyle} type="number" step="0.01" min="0" value={precio} onChange={e => setPrecio(e.target.value)} placeholder="Ej: 149.99" required />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>CATEGORÍA</label>
          <select style={inputStyle} value={categoria} onChange={e => handleCategoryChange(e.target.value)} required>
            <option value="">Seleccionar categoría</option>
            {categories.map(c => (
              <option key={c.slug} value={c.title}>{c.title}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>URL DE LA IMAGEN</label>
          <input style={inputStyle} value={imagen} onChange={e => setImagen(e.target.value)} placeholder="https://ejemplo.com/imagen.jpg" />
          <p style={{ fontSize: 11, color: '#C05A7A', marginTop: 4 }}>Pega la URL de la imagen del producto (puedes subirla a ImgBB, Imgur, etc.)</p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>DESCRIPCIÓN</label>
          <textarea
            style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            placeholder="Describe tu producto..."
          />
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={destacado}
              onChange={e => setDestacado(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: '#D4AF37', cursor: 'pointer' }}
            />
            <span style={{ fontSize: 14, color: '#8B3A4F', fontWeight: 500 }}>Marcar como producto destacado ⭐</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '10px 24px', borderRadius: 10, border: '1px solid #F5E1E4',
              background: 'white', color: '#8B3A4F', fontSize: 14, cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#FFF5F6'}
            onMouseLeave={e => e.currentTarget.style.background = 'white'}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '10px 24px', borderRadius: 10, border: 'none',
              background: saving ? '#E8A0B4' : 'linear-gradient(135deg, #E8A0B4, #D4AF37)',
              color: 'white', fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Guardando...' : isEdit ? 'Guardar Cambios' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  )
}
