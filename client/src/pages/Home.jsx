import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../AuthContext'
import SkinCard from '../components/SkinCard'

// Home — landing sahifa: hero, statistika, featured skinlar, "qanday ishlaydi".

export default function Home() {
  const [skins, setSkins] = useState([])
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    api.getSkins().then(setSkins).catch((e) => setError(e.message))
  }, [])

  // Eng qimmat 4 tasi "featured"
  const featured = [...skins].sort((a, b) => b.skinPrice - a.skinPrice).slice(0, 4)

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <h1 className="hero-title">
          CS2 skinlari olamiga <span className="grad">xush kelibsiz</span>
        </h1>
        <p className="hero-sub">
          Keyslar ochish, Pro-level skinlarni savatga solish va inventaringizni boshqarish —
          hammasi bir joyda. Bu loyiha 9-dars uy ishi sifatida yozilgan to'liq stack MVP.
        </p>
        <div className="hero-actions">
          {user ? (
            <>
              <Link to="/skins" className="btn">Katalogni ko'rish</Link>
              <Link to="/profile" className="btn ghost">Profilingiz</Link>
            </>
          ) : (
            <>
              <Link to="/register" className="btn">Ro'yxatdan o'tish</Link>
              <Link to="/about" className="btn ghost">Loyiha haqida</Link>
            </>
          )}
        </div>
      </section>

      {/* ---------- STATISTIKA ---------- */}
      <div className="stats">
        <div className="stat"><b>{skins.length}</b><span>Katalogdagi skinlar</span></div>
        <div className="stat"><b>24/7</b><span>Server ishlab turadi</span></div>
        <div className="stat"><b style={{ color: 'var(--green)' }}>100%</b><span>Hash'langan parollar</span></div>
        <div className="stat"><b style={{ color: 'var(--blue)' }}>JWT</b><span>Xavfsiz avtorizatsiya</span></div>
      </div>
      {error && <p className="error">{error}</p>}

      {/* ---------- FEATURED ---------- */}
      <section className="section">
        <div className="section-head">
          <h2>⭐ Eng qimmat skinlar</h2>
          <Link to="/skins" className="section-link">Barchasi →</Link>
        </div>
        <div className="grid">
          {featured.map((s) => <SkinCard key={s._id} skin={s} />)}
        </div>
      </section>

      {/* ---------- QANDAY ISHLAYDI ---------- */}
      <section className="section">
        <div className="section-head"><h2>⚙️ Qanday ishlaydi (keyingi darslar)</h2></div>
        <div className="steps">
          <div className="step">
            <div className="num">1</div>
            <h3>Hisob yarating</h3>
            <p>Register + JWT avtorizatsiya allaqachon ishlayapti. Parollar bcrypt bilan hash qilinadi.</p>
          </div>
          <div className="step">
            <div className="num">2</div>
            <h3>Balance to'lang</h3>
            <p>Virtual monetlar bilan hisobni to'ldirasiz (deposit) — Transaction modeli tayyor.</p>
          </div>
          <div className="step">
            <div className="num">3</div>
            <h3>Keys ochib soting</h3>
            <p>Case ochish (chance asosida skin) va Inventory'dan sotish — keyingi etapda qo'shiladi.</p>
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <div className="cta">
        <h2>Tayyormisiz? 🚀</h2>
        <p>Katalogdagi barcha skinlarni ko'ring va keyingi darsda keys ochishni kutib turing.</p>
        <Link to="/skins" className="btn">Skinlarni ko'rish</Link>
      </div>
    </>
  )
}
