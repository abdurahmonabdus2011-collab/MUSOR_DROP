import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'

// Profile — tizimga kirgan foydalanuvchining ma'lumotlari.
// Wallet va Inventory keyingi darsda ochiladi (stub havolalar bilan).

export default function Profile() {
  const { user, isAdmin } = useAuth()

  if (!user) {
    return <p className="muted">Bu sahifani ko'rish uchun <Link to="/login">kiring</Link>.</p>
  }

  return (
    <section>
      <h1>Profil</h1>
      <div className="card profile">
        <table>
          <tbody>
            <tr><th>Username</th><td>@{user.username}</td></tr>
            <tr><th>Email</th><td>{user.email}</td></tr>
            <tr><th>Rol</th><td>{user.role}</td></tr>
            <tr><th>Wallet</th><td>💰 {user.wallet}</td></tr>
            <tr><th>Qo'shilgan</th><td>{new Date(user.createdAt).toLocaleString()}</td></tr>
          </tbody>
        </table>
      </div>

      <h2 style={{ marginTop: '24px' }}>Keyingi etap (hozircha stub)</h2>
      <p className="muted">
        Bu havolalar backenddagi tegishli marshrutlar javobini (ko'rsatma format) ko'rsatadi:
      </p>
      <ul>
        <li><code>GET /api/wallet</code> — balans ({user.wallet})</li>
        <li><code>GET /api/inventory</code> — sizning inventaringiz</li>
        <li><code>POST /api/inventory/:id/sell</code> — skin sotish</li>
        <li><code>POST /api/cases/:id/open</code> — case ochish</li>
      </ul>
      {isAdmin && <p><Link to="/admin">➜ Admin panel</Link></p>}
    </section>
  )
}
