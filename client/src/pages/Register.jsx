import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

// Register — POST /api/auth/register.
// Muvaffaqiyatli bo'lsa foydalanuvchini login sahifasiga yunaltiramiz.

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [ok, setOk] = useState(false)
  const [busy, setBusy] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await register(username, email, password)
      // Parolni inputlardan tozalash (kirish sahifasiga o'tishuda foydi yoki muhokama)
      setOk(true)
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="form-page">
      <h1>Ro'yxatdan o'tish</h1>
      <p className="muted" style={{ marginBottom: 18 }}>
        Bir daqiqada hisob yaratish — "username" va "email" yozib qoldingiz
      </p>
      <div className="top-card">
      {ok ? (
        <p className="success">Muvaffaqiyatli! Kirish sahifasiga o'tish...</p>
      ) : (
        <form onSubmit={submit} className="form">
          <label>Username
            <input value={username} onChange={(e) => setUsername(e.target.value)}
                   minLength={3} required />
          </label>
          <label>Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>Parol
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                   minLength={6} required />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="btn" disabled={busy}>{busy ? 'Kuting...' : "Ro'yxatdan o'tish"}</button>
        </form>
      )}
      </div>
      <p className="muted">Hisobingiz bormi? <Link to="/login">Kirish</Link></p>
    </section>
  )
}
