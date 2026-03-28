import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../../hooks/useAuth.jsx'
import AdminLogin     from './AdminLogin.jsx'
import ChangePassword from './ChangePassword.jsx'
import AdminDashboard from './AdminDashboard.jsx'

export default function AdminPage() {
  const { isLoggedIn, authLoading } = useAuth()
  const [subView, setSubView] = useState('dashboard')

  useEffect(() => {
    if (!isLoggedIn) setSubView('dashboard')
  }, [isLoggedIn])

  return (
    <div id="admin-root">
      <Helmet>
        <title>Admin | Allotech72</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {authLoading && (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--dim)', fontSize: '.95rem',
        }}>
          Chargement…
        </div>
      )}

      {!authLoading && !isLoggedIn && <AdminLogin />}
      {!authLoading && isLoggedIn && subView === 'password' && (
        <ChangePassword onDone={() => setSubView('dashboard')} />
      )}
      {!authLoading && isLoggedIn && subView === 'dashboard' && (
        <AdminDashboard onChangePassword={() => setSubView('password')} />
      )}
    </div>
  )
}
