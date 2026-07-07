import { useState, FormEvent } from 'react'

interface Props {
  onLogin: (username: string) => void
}

export default function LoginPage({ onLogin }: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (res.ok) {
        onLogin(username)
      } else {
        setError('Usuario o contraseña incorrectos')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FFF8F0 0%, #F5E1E4 50%, #FFE8EB 100%)', padding: 20 }}>
      <div style={{ background: 'white', borderRadius: 24, padding: '2.5rem 2rem', width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(139,58,79,0.12)', border: '1px solid #F5E1E4' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #E8A0B4, #D4AF37)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: 'white', fontSize: 20, fontWeight: 700 }}>N&J</div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, color: '#8B3A4F', marginBottom: 4 }}>Panel Admin</h1>
          <p style={{ color: '#C05A7A', fontSize: 13 }}>N&J Accesorios y Belleza</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8B3A4F', marginBottom: 6, letterSpacing: '0.5px' }}>USUARIO</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              required
              autoFocus
              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #F5E1E4', fontSize: 14, outline: 'none', background: '#FFFCF7', color: '#2D2D2D', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#E8A0B4'}
              onBlur={e => e.target.style.borderColor = '#F5E1E4'}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8B3A4F', marginBottom: 6, letterSpacing: '0.5px' }}>CONTRASEÑA</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #F5E1E4', fontSize: 14, outline: 'none', background: '#FFFCF7', color: '#2D2D2D', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#E8A0B4'}
              onBlur={e => e.target.style.borderColor = '#F5E1E4'}
            />
          </div>

          {error && (
            <div style={{ background: '#FFF0F0', border: '1px solid #FFC0C0', borderRadius: 12, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#D04040', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px', borderRadius: 12, border: 'none',
              background: loading ? '#E8A0B4' : 'linear-gradient(135deg, #E8A0B4, #D4AF37)',
              color: 'white', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s', letterSpacing: '0.3px',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Entrando...' : 'Entrar al Panel'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: '#C05A7A' }}>
          <a href="/" style={{ color: '#D4AF37', textDecoration: 'none' }}>← Volver a la tienda</a>
        </p>
      </div>
    </div>
  )
}
