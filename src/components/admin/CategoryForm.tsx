import { useState, useEffect, FormEvent } from 'react'

interface Props {
  slug?: string
  onSave: () => void
  onCancel: () => void
}

export default function CategoryForm({ slug, onSave, onCancel }: Props) {
  const isEdit = !!slug
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [catSlug, setCatSlug] = useState('')
  const [descripcion, setDescripcion] = useState('')

  useEffect(() => {
    if (isEdit && slug) {
      fetch(`/api/categories/${slug}`).then(r => r.json()).then(c => {
        if (c.error) { setError(c.error); return }
        setTitle(c.title)
        setCatSlug(c.slug)
        setDescripcion(c.descripcion || '')
      }).catch(() => setError('Error al cargar')).finally(() => setLoading(false))
    }
  }, [slug, isEdit])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const body: any = { title, descripcion }
    if (!isEdit) body.slug = catSlug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    try {
      let res: Response
      if (isEdit && slug) {
        res = await fetch(`/api/categories/${slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      } else {
        res = await fetch('/api/categories', {
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #F5E1E4', borderTopColor: '#E8A0B4', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: '#8B3A4F', fontSize: 14 }}>Cargando categoría...</p>
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
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, color: '#8B3A4F' }}>
          {isEdit ? '✏️ Editar Categoría' : '➕ Nueva Categoría'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: 16, border: '1px solid #F5E1E4', padding: 28, maxWidth: 500 }}>
        {error && (
          <div style={{ background: '#FFF0F0', border: '1px solid #FFC0C0', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#D04040' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>NOMBRE</label>
          <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Collares" required />
        </div>

        {!isEdit && (
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>SLUG (URL)</label>
            <input style={inputStyle} value={catSlug} onChange={e => setCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} placeholder="Ej: collares" />
            <p style={{ fontSize: 11, color: '#C05A7A', marginTop: 4 }}>Se generará automáticamente si se deja vacío</p>
          </div>
        )}

        <div style={{ marginBottom: 28 }}>
          <label style={labelStyle}>DESCRIPCIÓN</label>
          <textarea
            style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            placeholder="Breve descripción de la categoría..."
          />
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button type="button" onClick={onCancel} style={{ padding: '10px 24px', borderRadius: 10, border: '1px solid #F5E1E4', background: 'white', color: '#8B3A4F', fontSize: 14, cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = '#FFF5F6'}
            onMouseLeave={e => e.currentTarget.style.background = 'white'}
          >Cancelar</button>
          <button type="submit" disabled={saving} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: saving ? '#E8A0B4' : 'linear-gradient(135deg, #E8A0B4, #D4AF37)', color: 'white', fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Guardando...' : isEdit ? 'Guardar Cambios' : 'Crear Categoría'}
          </button>
        </div>
      </form>
    </div>
  )
}
