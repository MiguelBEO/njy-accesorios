import { useState, useEffect, FormEvent } from 'react'

interface Props {
  onSaved: () => void
}

export default function SettingsPage({ onSaved }: Props) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [siteName, setSiteName] = useState('')
  const [siteTagline, setSiteTagline] = useState('')
  const [siteLogo, setSiteLogo] = useState('')

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => {
      setSiteName(data.site_name || 'N&J Accesorios y Belleza')
      setSiteTagline(data.site_tagline || 'Detalles que te hacen brillar')
      setSiteLogo(data.site_logo || '/images/placeholder.svg')
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site_name: siteName,
          site_tagline: siteTagline,
          site_logo: siteLogo,
        }),
      })

      if (res.ok) {
        setSuccess('Configuración guardada correctamente ✨')
        onSaved()
      } else {
        setError('Error al guardar')
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
        <p style={{ color: '#8B3A4F', fontSize: 14 }}>Cargando configuración...</p>
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
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, color: '#8B3A4F', marginBottom: 4 }}>⚙️ Configuración</h1>
        <p style={{ color: '#C05A7A', fontSize: 14 }}>Personaliza los datos de tu tienda</p>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: 16, border: '1px solid #F5E1E4', padding: 28, maxWidth: 600 }}>
        {error && (
          <div style={{ background: '#FFF0F0', border: '1px solid #FFC0C0', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#D04040' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: '#F0FFF4', border: '1px solid #C0FFD0', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#208040' }}>
            {success}
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>NOMBRE DE LA TIENDA</label>
          <input style={inputStyle} value={siteName} onChange={e => setSiteName(e.target.value)} placeholder="N&J Accesorios y Belleza" required />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>ESLOGAN / TAGLINE</label>
          <input style={inputStyle} value={siteTagline} onChange={e => setSiteTagline(e.target.value)} placeholder="Detalles que te hacen brillar" />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>URL DEL LOGO</label>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <input style={inputStyle} value={siteLogo} onChange={e => setSiteLogo(e.target.value)} placeholder="/images/placeholder.svg" />
            </div>
            {siteLogo && (
              <img src={siteLogo} alt="Preview" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', border: '1px solid #F5E1E4' }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}
          </div>
          <p style={{ fontSize: 11, color: '#C05A7A', marginTop: 4 }}>URL de la imagen del logo (puedes subirla a un servicio gratuito como ImgBB)</p>
        </div>

        <div style={{ borderTop: '1px solid #F5E1E4', paddingTop: 24, marginTop: 8 }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, color: '#8B3A4F', marginBottom: 16 }}>🔐 Credenciales de Administración</h2>
          <p style={{ fontSize: 13, color: '#C05A7A', marginBottom: 16 }}>
            Para cambiar usuario y contraseña, edita directamente en la base de datos D1.
          </p>
          <div style={{ background: '#FFF5F6', borderRadius: 10, padding: 16, fontSize: 13, color: '#8B3A4F' }}>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>Credenciales actuales:</p>
            <p>👤 Usuario: <code style={{ background: '#FFE8EB', padding: '2px 8px', borderRadius: 4, fontSize: 13 }}>NoraWrite</code></p>
            <p>🔑 Contraseña: <code style={{ background: '#FFE8EB', padding: '2px 8px', borderRadius: 4, fontSize: 13 }}>lcdll22</code></p>
          </div>
        </div>

        <button type="submit" disabled={saving} style={{ marginTop: 24, padding: '12px 28px', borderRadius: 12, border: 'none', background: saving ? '#E8A0B4' : 'linear-gradient(135deg, #E8A0B4, #D4AF37)', color: 'white', fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </form>
    </div>
  )
}
