import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../AuthContext'

// Wallet — balans, pul qo'shish (deposit) va operatsiyalar tarixi.

const PRESETS = [10, 50, 100, 500, 1000]

const TYPE_LABEL = {
  deposit: '💵 Pul kiritish',
  case_open: '📦 Keys ochish',
  skin_sale: '💰 Skin sotish',
}

export default function Wallet() {
  const { user, setUser } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [custom, setCustom] = useState('')

  const loadHistory = useCallback(async () => {
    try {
      const list = await api.getTransactions()
      setTransactions(list)
    } catch (e) {
      setError(e.message)
    }
  }, [])

  useEffect(() => { if (user) loadHistory() }, [user, loadHistory])

  if (!user) {
    return (
      <section className="form-page">
        <h1>💳 Wallet</h1>
        <div className="top-card">
          <p className="muted">Balansni ko'rish uchun kiring.</p>
          <Link to="/login" className="btn" style={{ marginTop: 16, display: 'inline-block' }}>Kirish</Link>
        </div>
      </section>
    )
  }

  const doDeposit = async (amount) => {
    setError(''); setNotice(''); setBusy(true)
    try {
      const data = await api.deposit(amount)
      // Navbar hamda sahifadagi balansni bir zumda yangilash
      setUser({ ...user, wallet: data.wallet })
      setNotice(`✅ ${amount} balansga qo'shildi`)
      loadHistory()
      setTimeout(() => setNotice(''), 2500)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const submitCustom = (e) => {
    e.preventDefault()
    const n = Number(custom)
    if (n > 0) doDeposit(n)
  }

  return (
    <section className="profile-wrap">
      <h1>💳 Wallet</h1>
      <p className="muted" style={{ margin: '6px 0 20px' }}>Joriy balans va monet kiritish</p>

      {/* Balans kartasi */}
      <div className="card" style={{ padding: '28px 24px', marginBottom: 22 }}>
        <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 6 }}>Joriy balans</div>
        <div style={{ fontSize: 42, fontWeight: 800, color: 'var(--green)' }}>
          💰 {Number(user.wallet).toFixed(2)}
        </div>

        {notice && <p className="success">{notice}</p>}
        {error && <p className="error">{error}</p>}

        {/* Tez qo'shish tugmalari */}
        <div className="chips" style={{ marginTop: 18 }}>
          {PRESETS.map((p) => (
            <button key={p} className={`chip ${p >= 500 ? '' : ''}`} disabled={busy}
                    onClick={() => doDeposit(p)}>
              +${p}
            </button>
          ))}
        </div>

        {/* Istalgan summa */}
        <form onSubmit={submitCustom} className="inline-form" style={{ marginTop: 16, maxWidth: 420 }}>
          <label style={{ flex: 1 }}>
            Istalgan summa ($)
            <input type="number" step="0.01" min="0.01" max="100000" value={custom}
                   onChange={(e) => setCustom(e.target.value)} placeholder="masalan: 25.50" />
          </label>
          <button className="btn" disabled={busy || !custom}>Qo'shish</button>
        </form>
      </div>

      {/* Tarix */}
      <h2>📜 Operatsiyalar tarixi</h2>
      {transactions.length === 0 ? (
        <p className="muted small">Hali operatsiya yo'q — balans to'ldirib keys oching!</p>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Tur</th><th>Summa</th><th>Oldin → Keyin</th><th>Sana</th></tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id}>
                  <td>{TYPE_LABEL[t.type] || t.type}</td>
                  <td style={{ color: t.amount >= 0 ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>
                    {t.amount >= 0 ? '+' : ''}{t.amount.toFixed(2)}
                  </td>
                  <td className="muted small">{t.balanceBefore.toFixed(2)} → {t.balanceAfter.toFixed(2)}</td>
                  <td className="muted small">{new Date(t.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
