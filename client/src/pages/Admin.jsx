import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { api } from '../api'

// Admin — faqat admin uchun to'liq boshqaruv paneli:
// 1) Skinlar boshqaruvi (qo'shish, rasmini yuklash/o'chirish, tahrirlash, o'chirish)
// 2) Foydalanuvchilar boshqaruvi (balans / wallet berish, rolni o'zgartirish, o'chirish)
// 3) Keyslar ro'yxati (kuzatish)

const EMPTY = { skinName: '', skinRarity: 'Common', skinPrice: '', imageUrl: '' }

export default function Admin() {
  const { user, isAdmin } = useAuth()

  // ---- Skinlar ----
  const [skins, setSkins] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [uploading, setUploading] = useState(false)

  // ---- Users ----
  const [users, setUsers] = useState([])

  // ---- Cases ----
  const [cases, setCases] = useState([])

  const loadAll = async () => {
    try {
      const [skinList, userList, caseList] = await Promise.all([
        api.getSkins(),
        api.getUsers(),
        api.getCases().catch(() => [])
      ])
      setSkins(skinList)
      setUsers(userList)
      setCases(caseList)
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    if (isAdmin) loadAll()
  }, [isAdmin])

  if (!isAdmin) {
    return (
      <div className="card">
        <h2>Ruxsat yo'q</h2>
        <p className="muted">Bu panel faqat administratorlar uchun. Admin hisobi bilan kiring.</p>
        <Link to="/login" className="btn">Kirish sahifasi</Link>
      </div>
    )
  }

  const flash = (msg) => {
    setNotice(msg)
    setTimeout(() => setNotice(''), 3000)
  }

  const resetForm = () => {
    setForm(EMPTY)
    setEditId(null)
    setError('')
  }

  // Kompyuterdan rasm fayli tanlanganda serverga yuklash
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError("Faqat rasm fayli (.png, .jpg, .webp, .svg) yuklashingiz mumkin!")
      return
    }

    if (file.size > 15 * 1024 * 1024) {
      setError("Rasm hajmi 15MB dan oshmasligi kerak!")
      return
    }

    setError('')
    setUploading(true)

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const res = await api.uploadImage(event.target.result)
        setForm((prev) => ({ ...prev, imageUrl: res.url }))
        flash("Rasm muvaffaqiyatli Cloudinary ga yuklandi ☁️✅")
      } catch (err) {
        setError("Rasmni yuklashda xatolik: " + err.message)
      } finally {
        setUploading(false)
      }
    }
    reader.onerror = () => {
      setError("Faylni o'qishda xatolik yuz berdi")
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  // Yaratish yoki tahrirlash (editId bor bo'lsa PATCH)
  const submitSkin = async (e) => {
    e.preventDefault()
    setError('')
    const body = {
      skinName: form.skinName,
      skinRarity: form.skinRarity,
      skinPrice: Number(form.skinPrice),
      imageUrl: form.imageUrl || ''
    }
    try {
      if (editId) {
        await api.updateSkin(editId, body)
        flash('Skin muvaffaqiyatli yangilandi ✅')
      } else {
        await api.createSkin(body)
        flash('Yangi skin rasm bilan qo\'shildi ✅')
      }
      resetForm()
      loadAll()
    } catch (err) {
      setError(err.message)
    }
  }

  const startEdit = (s) => {
    setEditId(s._id)
    setForm({
      skinName: s.skinName,
      skinRarity: s.skinRarity,
      skinPrice: s.skinPrice,
      imageUrl: s.imageUrl || ''
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const removeSkin = async (id) => {
    if (!window.confirm("Rostdan ham bu skinni o'chirmoqchimisiz?")) return
    setError('')
    try {
      await api.deleteSkin(id)
      flash("Skin o'chirildi 🗑️")
      if (editId === id) resetForm()
      loadAll()
    } catch (err) {
      setError(err.message)
    }
  }

  // ---- Foydalanuvchi balansini (wallet) o'zgartirish ----
  const changeWallet = async (targetUser) => {
    setError('')
    const input = window.prompt(
      `@${targetUser.username} uchun yangi balans miqdorini kiriting ($):`,
      targetUser.wallet
    )
    if (input === null) return
    const amount = Number(input)
    if (isNaN(amount) || amount < 0) {
      setError("Balans 0 yoki undan katta musbat son bo'lishi kerak")
      return
    }

    try {
      await api.updateUser(targetUser._id, { wallet: amount })
      flash(`@${targetUser.username} balansi $${amount} ga yangilandi 💰`)
      loadAll()
    } catch (err) {
      setError(err.message)
    }
  }

  // ---- Foydalanuvchi rolini (admin/user) almashtirish ----
  const toggleRole = async (targetUser) => {
    setError('')
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin'
    if (!window.confirm(`@${targetUser.username} rolini "${newRole}" ga o'zgartirmoqchimisiz?`)) return

    try {
      await api.updateUser(targetUser._id, { role: newRole })
      flash(`@${targetUser.username} roli "${newRole}" ga o'zgartirildi 👑`)
      loadAll()
    } catch (err) {
      setError(err.message)
    }
  }

  const removeUser = async (id) => {
    if (!window.confirm("Rostdan ham bu foydalanuvchini o'chirmoqchimisiz?")) return
    setError('')
    setNotice('')
    try {
      await api.deleteUser(id)
      flash("Foydalanuvchi o'chirildi 🗑️")
      loadAll()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section>
      <h1>⚙️ Admin Boshqaruv Paneli</h1>
      {notice && <p className="success">{notice}</p>}
      {error && <p className="error">{error}</p>}

      {/* ===== Skin qo'shish / tahrirlash (Rasmlar bilan) ===== */}
      <div className="card admin-card">
        <h2>{editId ? '✏️ Skinni tahrirlash' : "➕ Yangi skin qo'shish"}</h2>
        <form onSubmit={submitSkin} className="form" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <label>Skin nomi
              <input value={form.skinName}
                     onChange={(e) => setForm({ ...form, skinName: e.target.value })}
                     placeholder="Masalan: AK-47 | Redline"
                     minLength={3} required />
            </label>
            <label>Noyoblik (Rarity)
              <select value={form.skinRarity}
                      onChange={(e) => setForm({ ...form, skinRarity: e.target.value })}>
                {['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </label>
            <label>Narxi ($)
              <input type="number" step="0.1" min="0.1" value={form.skinPrice}
                     placeholder="15.50"
                     onChange={(e) => setForm({ ...form, skinPrice: e.target.value })} required />
            </label>
          </div>

          {/* Rasm qo'yish (URL yoki fayldan yuklash) */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              🖼️ Skin Rasmi (Fayl yuklash yoki URL)
            </label>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Rasm internet havolasi (URL: https://...)"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                style={{ flex: 1, minWidth: '220px' }}
              />

              <label className="btn ghost" style={{ cursor: 'pointer', margin: 0, whiteSpace: 'nowrap' }}>
                {uploading ? '⏳ Yuklanmoqda...' : '📁 Fayldan rasm tanlash'}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </label>

              {form.imageUrl && (
                <button
                  type="button"
                  className="btn small danger"
                  onClick={() => setForm({ ...form, imageUrl: '' })}
                  title="Rasmni olib tashlash"
                >
                  ❌ Rasmni olib tashlash
                </button>
              )}
            </div>

            {/* Rasm ko'rinishi (Preview) */}
            {form.imageUrl && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '12px' }}>
                <img
                  src={form.imageUrl}
                  alt="Skin preview"
                  style={{
                    width: '70px',
                    height: '70px',
                    objectFit: 'contain',
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    padding: '4px'
                  }}
                  onError={(e) => {
                    e.currentTarget.style.opacity = '0.4'
                    setError("Rasm URL noto'g'ri yoki yuklanmadi")
                  }}
                />
                <span className="muted small">
                  Rasm saqlanganda serverda umrbod saqlanadi va hamma userlar hamda boshqa adminlarga darhol ko'rinadi! ✅
                </span>
              </div>
            )}
          </div>

          <div className="row-btns">
            <button className="btn" disabled={uploading}>
              {editId ? '💾 Yangilash' : "➕ Skinni qo'shish"}
            </button>
            {editId && <button type="button" className="btn ghost" onClick={resetForm}>Bekor qilish</button>}
          </div>
        </form>
      </div>

      {/* ===== Skinlar ro'yxati ===== */}
      <div style={{ marginTop: '2.5rem' }}>
        <h2>🔫 Barcha Skinlar ({skins.length})</h2>
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Rasm</th>
              <th>Nom</th>
              <th>Rarity</th>
              <th>Narx</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {skins.map((s) => (
              <tr key={s._id}>
                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  {s.imageUrl ? (
                    <img
                      src={s.imageUrl}
                      alt={s.skinName}
                      style={{
                        width: '44px',
                        height: '44px',
                        objectFit: 'contain',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '6px',
                        padding: '2px'
                      }}
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  ) : (
                    <span style={{ fontSize: '20px' }}>🔫</span>
                  )}
                </td>
                <td><b>{s.skinName}</b></td>
                <td><span className={`rarity-${(s.skinRarity || '').toLowerCase()}`}>{s.skinRarity}</span></td>
                <td>${Number(s.skinPrice).toFixed(2)}</td>
                <td>
                  <button className="btn small" onClick={() => startEdit(s)}>✏️ Tahrir</button>{' '}
                  <button className="btn small danger" onClick={() => removeSkin(s._id)}>🗑 O'chir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== Foydalanuvchilar ro'yxati va Balans (Pul) boshqaruvi ===== */}
      <div style={{ marginTop: '2.5rem' }}>
        <h2>👥 Foydalanuvchilar va Balans (Pul) boshqaruvi ({users.length})</h2>
        <p className="muted">
          Bu yerdan istalgan foydalanuvchining balansiga pul qo'shishingiz, rolini (admin/user) almashtirishingiz yoki o'chirishingiz mumkin.
        </p>
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Wallet (Balans)</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>@{u.username}{u._id === user._id && ' (Siz)'}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge ${u.role === 'admin' ? 'admin' : ''}`}>
                    {u.role === 'admin' ? '👑 admin' : '👤 user'}
                  </span>
                </td>
                <td>
                  <b style={{ color: '#4ade80' }}>💰 ${Number(u.wallet || 0).toFixed(2)}</b>
                </td>
                <td>
                  <button className="btn small" onClick={() => changeWallet(u)} title="Balansni o'zgartirish">
                    💰 Balans berish
                  </button>{' '}
                  <button className="btn small ghost" onClick={() => toggleRole(u)} title="Rolni almashtirish">
                    {u.role === 'admin' ? '👤 User qilish' : '👑 Admin qilish'}
                  </button>{' '}
                  {u._id !== user._id && (
                    <button className="btn small danger" onClick={() => removeUser(u._id)} title="O'chirish">
                      🗑 O'chir
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== Keyslar ro'yxati ===== */}
      {cases.length > 0 && (
        <div style={{ marginTop: '2.5rem' }}>
          <h2>📦 Keyslar ({cases.length})</h2>
          <table className="table">
            <thead>
              <tr><th>Keys nomi</th><th>Narxi</th><th>Skinlar soni</th><th>Status</th></tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c._id}>
                  <td><b>{c.caseName}</b></td>
                  <td>💰 ${Number(c.casePrice).toFixed(2)}</td>
                  <td>{c.skins?.length || 0} ta skin</td>
                  <td><span className="badge">{c.isAvailable ? 'Aktiv' : 'Nofaol'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
