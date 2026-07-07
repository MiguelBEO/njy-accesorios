import { ReactNode } from 'react'

type Page = 'dashboard' | 'productos' | 'producto-nuevo' | 'producto-editar' | 'categorias' | 'categoria-nueva' | 'categoria-editar' | 'configuracion'

interface Props {
  children: ReactNode
  username: string
  onLogout: () => void
  currentPage: Page
  onNavigate: (page: Page) => void
}

interface NavItem {
  id: Page
  label: string
  icon: string
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'productos', label: 'Productos', icon: '💎' },
  { id: 'categorias', label: 'Categorías', icon: '🏷️' },
  { id: 'configuracion', label: 'Configuración', icon: '⚙️' },
]

export default function AdminLayout({ children, username, onLogout, currentPage, onNavigate }: Props) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <style>{`
        @media (max-width: 767px) {
          .admin-sidebar { display: none; }
          .admin-main { margin-left: 0 !important; }
        }
      `}</style>

      {/* Sidebar */}
      <div className="admin-sidebar" style={{
        width: 240, background: 'linear-gradient(180deg, #8B3A4F 0%, #6E2E40 100%)',
        color: 'white', display: 'flex', flexDirection: 'column', position: 'fixed',
        top: 0, left: 0, bottom: 0, zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #D4AF37, #E8C566)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>N&J</div>
            <div>
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 600, lineHeight: 1.2 }}>Admin Panel</p>
              <p style={{ fontSize: 12, opacity: 0.7, fontFamily: "'Great Vibes', cursive" }}>Detalles que te hacen brillar</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px' }}>
          {navItems.map(item => {
            const active = currentPage === item.id || (currentPage.startsWith('producto') && item.id === 'productos') || (currentPage.startsWith('categoria') && item.id === 'categorias')
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 14px',
                  borderRadius: 10, border: 'none', background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: active ? 'white' : 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: active ? 600 : 400,
                  cursor: 'pointer', transition: 'all 0.2s', marginBottom: 2, textAlign: 'left',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* User */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#8B3A4F' }}>
              {username.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: 13, opacity: 0.9 }}>{username}</span>
          </div>
          <button
            onClick={onLogout}
            style={{ width: '100%', padding: '8px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'rgba(255,255,255,0.7)', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Mobile header */}
      <div style={{
        display: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
        background: 'white', borderBottom: '1px solid #F5E1E4', padding: '12px 16px',
      }} className="mobile-admin-header">
        <style>{`
          @media (max-width: 767px) {
            .mobile-admin-header { display: flex !important; align-items: center; justify-content: space-between; }
            .admin-content { padding-top: 60px !important; }
          }
        `}</style>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #E8A0B4, #D4AF37)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700 }}>N&J</div>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#8B3A4F', fontFamily: "'Playfair Display', Georgia, serif" }}>Admin</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                padding: '6px 10px', borderRadius: 8, border: 'none',
                background: currentPage === item.id || (currentPage.startsWith('producto') && item.id === 'productos') || (currentPage.startsWith('categoria') && item.id === 'categorias') ? '#F5E1E4' : 'transparent',
                fontSize: 18, cursor: 'pointer', lineHeight: 1,
              }}
              title={item.label}
            >{item.icon}</button>
          ))}
          <button onClick={onLogout} style={{ padding: '6px 10px', borderRadius: 8, border: 'none', background: 'transparent', fontSize: 16, cursor: 'pointer' }} title="Cerrar sesión">🚪</button>
        </div>
      </div>

      {/* Main content */}
      <div className="admin-main" style={{ flex: 1, marginLeft: 240, padding: 24, minHeight: '100vh' }}>
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  )
}
