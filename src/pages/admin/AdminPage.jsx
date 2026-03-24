import { Helmet } from 'react-helmet-async'
import { useAuth } from '../../hooks/useAuth.jsx'
import AdminLogin     from './AdminLogin.jsx'
import ChangePassword from './ChangePassword.jsx'
import AdminDashboard from './AdminDashboard.jsx'

export default function AdminPage() {
  const { isLoggedIn, mustChangePass } = useAuth()

  return (
    <div id="admin-root">
      <Helmet>
        <title>Admin | Allotech72</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {!isLoggedIn                     && <AdminLogin />}
      {isLoggedIn && mustChangePass    && <ChangePassword />}
      {isLoggedIn && !mustChangePass   && <AdminDashboard />}
    </div>
  )
}
