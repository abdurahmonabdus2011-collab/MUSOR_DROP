import { Link } from 'react-router-dom'

// About — loyiha haqida: texnologiyalar, dars bosqichlari, xavfsizlik.

const TECH = ['Node.js', 'Express 5', 'MongoDB', 'Mongoose 9', 'JWT', 'bcryptjs', 'Joi',
  'React 18', 'React Router 6', 'Vite']

export default function About() {
  return (
    <section>
      <h1>ℹ️ Loyiha haqida</h1>
      <p className="muted" style={{ margin: '8px 0 26px', maxWidth: 640 }}>
        Bu — CS2 skin marketplace'ining MVP backend + frontend loyihasi.
        9-dars uy ishi sifatida yozilgan va har bosqichda kengaytiriladi.
      </p>

      <div className="about-grid">
        <div className="card">
          <h3>✅ Tayyor bo'limlar</h3>
          <ul>
            <li>User modeli — bcrypt hash, unique, role, wallet</li>
            <li>Register / Login / JWT avtorizatsiya</li>
            <li>CRUD (faqat admin) + admin middleware</li>
            <li>Case, Inventory, Transaction modellari</li>
            <li>Skinlar katalogi + filtr bо'lgan React UI</li>
          </ul>
        </div>
        <div className="card">
          <h3>🚧 Keyingi bosqichlar</h3>
          <ul>
            <li>Balansni to'ldirish (deposit)</li>
            <li>Keys ochish — chance darajasida skin tushirish</li>
            <li>Inventardan skin sotish</li>
            <li>Transaction tarixi sahifasi</li>
          </ul>
        </div>
        <div className="card">
          <h3>🔒 Xavfsizlik</h3>
          <p>
            Parollar bcrypt bilan <b>hash qilib</b> saqylanadi, API javoblarida parol
            umuman qaytmaydi. Admin roli faqat bazadan olinadi — klientning aytganiga
            ishonilmaydi. JWT secret <code>.env</code> faylida.
          </p>
        </div>
        <div className="card">
          <h3>🛠 Texnologiyalar</h3>
          <div className="tech-list">
            {TECH.map((t) => <span key={t} className="badge">{t}</span>)}
          </div>
          <p className="muted small" style={{ marginTop: 12 }}>
            Backend: <code>src/</code> · Frontend: <code>client/</code> · Seed: <code>scripts/seed-skins.js</code>
          </p>
        </div>
      </div>

      <div className="cta">
        <h2>Katalogni ko'rib chiqing 👀</h2>
        <Link to="/skins" className="btn">Skinlarga o'tish</Link>
      </div>
    </section>
  )
}
