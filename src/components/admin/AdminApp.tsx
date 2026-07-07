import { useState, useEffect } from 'react'
import LoginPage from './LoginPage'
import AdminLayout from './AdminLayout'
import Dashboard from './Dashboard'
import ProductList from './ProductList'
import ProductForm from './ProductForm'
import CategoryList from './CategoryList'
import CategoryForm from './CategoryForm'
import SettingsPage from './SettingsPage'

type Page = 'dashboard' | 'productos' | 'producto-nuevo' | 'producto-editar' | 'categorias' | 'categoria-nueva' | 'categoria-editar' | 'configuracion'

export default function AdminApp() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [page, setPage] = useState<Page>('dashboard')
  const [editSlug, setEditSlug] = useState<string | null>(null)
  const [editCatSlug, setEditCatSlug] = useState<string | null>(null)
  const [username, setUsername] = useState('')
  const [trigger, setTrigger] = useState(0)

  useEffect(() => {
    fetch('/api/auth/me').then(r => {
      if (r.ok) return r.json()
      throw new Error('no auth')
    }).then(data => {
      setAuthenticated(true)
      setUsername(data.username || 'Admin')
    }).catch(() => {
      setAuthenticated(false)
    })
  }, [])

  const handleLogin = (u: string) => {
    setAuthenticated(true)
    setUsername(u)
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setAuthenticated(false)
    setUsername('')
  }

  const navigate = (p: Page, slug?: string) => {
    setPage(p)
    if (slug) setEditSlug(slug)
    else setEditSlug(null)
    setEditCatSlug(null)
    setTrigger(t => t + 1)
  }

  const refresh = () => setTrigger(t => t + 1)

  if (authenticated === null) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#FFF8F0' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '3px solid #F5E1E4', borderTopColor: '#E8A0B4', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: '#8B3A4F', fontFamily: 'Montserrat', fontSize: 14 }}>Cargando...</p>
          <style>{'@keyframes spin { to { transform: rotate(360deg) } }'}</style>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return <LoginPage onLogin={handleLogin} />
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard key={`d-${trigger}`} />
      case 'productos':
        return <ProductList key={`pl-${trigger}`} onNew={() => navigate('producto-nuevo')} onEdit={(slug) => navigate('producto-editar', slug)} />
      case 'producto-nuevo':
        return <ProductForm key={`pn-${trigger}`} onSave={() => navigate('productos')} onCancel={() => navigate('productos')} />
      case 'producto-editar':
        return <ProductForm key={`pe-${editSlug}-${trigger}`} slug={editSlug!} onSave={() => navigate('productos')} onCancel={() => navigate('productos')} />
      case 'categorias':
        return <CategoryList key={`cl-${trigger}`} onNew={() => navigate('categoria-nueva')} onEdit={(slug) => navigate('categoria-editar', slug)} />
      case 'categoria-nueva':
        return <CategoryForm key={`cn-${trigger}`} onSave={() => navigate('categorias')} onCancel={() => navigate('categorias')} />
      case 'categoria-editar':
        return <CategoryForm key={`ce-${editCatSlug}-${trigger}`} slug={editCatSlug!} onSave={() => navigate('categorias')} onCancel={() => navigate('categorias')} />
      case 'configuracion':
        return <SettingsPage key={`s-${trigger}`} onSaved={refresh} />
      default:
        return <Dashboard key={`d-${trigger}`} />
    }
  }

  return (
    <AdminLayout username={username} onLogout={handleLogout} currentPage={page} onNavigate={navigate}>
      {renderPage()}
    </AdminLayout>
  )
}
