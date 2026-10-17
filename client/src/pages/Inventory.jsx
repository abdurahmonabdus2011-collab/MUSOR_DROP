import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../AuthContext'

// Inventory — joriy user skinlari: filtrlash (owned/sold), sotish, jonli statistika.

const RARITY_LINE = {
  Common: '#b0c3d9', Rare: '#4b69ff', Epic: '#8847ff',
  Legendary: '#d32ce6', Mythic: '#eb4b4b',
}

export default function Inventory() {
  const { user, setUser, isAdmin } = useAuth()
  const [items, setItems] = useState([])
  const [tab, setTab] = useState('owned') // owned | sold
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [selling, setSelling] = useState(null) // aynan sotilyotgan item id

  const load = useCallback(async () => {
    try {
      const list = await api.getInventory(tab)
      setItems(list)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [tab])

  useEffect(() => {
    if (user) load()
  }, [user, load])

  // Ulangan bo'lmasa kirish taklifi
  if (!user) {
    return (
      <section className="form-page">
        <h1>🎒 Inventar</h1>
        <div className="top-card">
          <p className="muted">
            Keyslardan chiqqan skinlaringiz shu yerda ko'rinadi. Sotish orqali balansni to'ldirasiz.
          </p>
          <Link to="/login" className="btn" style={{ marginTop: 16, display: 'inline-block' }}>Kirish</Link>
        </div>
      </section>
    )
  }

  const sell = async (item) => {
    setError(''); setNotice(''); setSelling(item._id)
    try {
      const data = await api.sellItem(item._id)
      // Navbar balansini yangilash
      setUser({ ...user, wallet: data.wallet })
      setNotice(`✅ "${item.skin.skinName}" $${Number(item.skin.skinPrice).toFixed(2)} ga sotildi`)
      load() // royxatni yangilash (owned dan yo'qoladi, sold ga o'tadi)
      setTimeout(() => setNotice(''), 3000)
    } catch (e) {
      setError(e.message)
    } finally {
      setSelling(null)
    }
  }

  // Statistika (owned itemlar bo'yicha)
  const owned = items.filter((i) => i.status === 'owned')
  const totalValue = owned.reduce((s, i) => s + (i.skin?.skinPrice || 0), 0)
  const best = owned.reduce((b, i) => ((i.skin?.skinPrice || 0) > (b?.skin?.skinPrice || 0) ? i : b), null)

  return (
    <section>
      <h1>🎒 Inventaringiz</h1>
      <p className="muted" style={{ margin: '6px 0 20px' }}>
        @{user.username} · Balans <b style={{ color: 'var(--green)' }}>💰 {Number(user.wallet).toFixed(2)}</b>
      </p>

      {/* Statistika chiziqlari */}
      {tab === 'owned' && owned.length > 0 && (
        <div className="stats">
          <div className="stat"><b>{owned.length}</b><span>Inventarda skin</span></div>
          <div className="stat"><b>${totalValue.toFixed(2)}</b><span>Umumiy qiymati</span></div>
          <div className="stat" style={{ gridColumn: 'span 2' }}>
            <b style={{ fontSize: 17 }}>{best?.skin?.skinName || '—'}</b>
            <span>Eng qimmat skin</span>
          </div>
        </div>
      )}

      {notice && <p className="success">{notice}</p>}
      {error && <p className="error">{error}</p>}

      {/* Filtrlash tab'lari */}
      <div className="chips" style={{ margin: '14px 0 18px' }}>
        <button className={`chip ${tab === 'owned' ? 'on' : ''}`} onClick={() => setTab('owned')}>🖐 Menda bor ({tab === 'owned' && items.length})</button>
        <button className={`chip ${tab === 'sold' ? 'on' : ''}`} onClick={() => setTab('sold')}>💸 Sotilganlar ({tab === 'sold' && items.length})</button>
      </div>

      {loading && <p className="muted">Yuklanmoqda...</p>}
      {!loading && items.length === 0 && (
        <div className="card" style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 44 }}>📭</div>
          <h3 style={{ margin: '12px 0 6px' }}>{tab === 'owned' ? 'Inventar bo\\\'sh' : 'Sotilgan skin yo\\\'q'}</h3>
          {tab === 'owned' && (
            <p className="muted small">
              <Link to="/cases" style={{ color: 'var(--accent)' }}>Keys oching</Link> — skinlar bu yerda paydo bo'ladi!
            </p>
          )}
        </div>
      )}

      <div className="grid">
        {items.map((item) => (
          <div key={item._id} className="card inv-item"
               style={{ '--line': RARITY_LINE[item.skin?.skinRarity] || '#8b93a1' }}>
            <img
              src={item.skin?.imageUrl}
              alt={item.skin?.skinName}
              className="inv-img"
              onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.classList.add('noimg') }}
            />
            <div className="inv-info">
              <h3>{item.skin?.skinName}</h3>
              <div style={{ color: RARITY_LINE[item.skin?.skinRarity], fontWeight: 700, fontSize: 12, marginTop: 4 }}>
                {item.skin?.skinRarity}
              </div>
              <div className="muted small" style={{ marginTop: 6 }}>
                📦 {item.sourceCase?.caseName || '—'} · {new Date(item.obtainedAt).toLocaleDateString()}
              </div>
            </div>
            <div className="inv-bottom">
              <span className="price">${Number(item.skin?.skinPrice || 0).toFixed(2)}</span>
              {item.status === 'owned' ? (
                <button className="btn small green" onClick={() => sell(item)} disabled={selling === item._id}>
                  {selling === item._id ? 'Sotilyapti...' : '💰 Sotish'}
                </button>
              ) : (
                <span className="badge sold">sotilgan</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
