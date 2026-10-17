import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'

// Login — POST /api/auth/login. Muvaffaqiyatli bo'lsa token saqlanadi.

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(email, password)
      navigate('/profile')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="form-page">
      <h1>Kirish</h1>
      <p className="muted">Hisobingizga kiring va davom eting</p>
      <div className="top-card">
        <form onSubmit={submit} className="form">
        <label>Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>Parol
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="error">{error}</p>}          <button className="btn" disabled={busy}>{busy ? 'Kirilmoqda...' : 'Kirish'}</button>
        </form>
      </div>
      <p className="muted">Hisobingiz yo'qmi? <Link to="/register">Ro'yxatdan o'tish</Link></p>
    </section>
  )
}
