import { useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import SkinCard from '../components/SkinCard'

// Skins — to'liq katalog: qidiruv (nom bo'yicha) + rarity filtr + narx bo'yicha sort.

const RARITIES = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic']

export default function Skins() {
  const [skins, setSkins] = useState([])
  const [query, setQuery] = useState('')
  const [rarity, setRarity] = useState('all')
  const [sort, setSort] = useState('name')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getSkins()
      .then(setSkins)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  // useMemo — filtr/sort faqat kirish berganda qayta hisoblanadi
  const filtered = useMemo(() => {
    let list = skins.filter((s) =>
      s.skinName.toLowerCase().includes(query.trim().toLowerCase())
    )
    if (rarity !== 'all') list = list.filter((s) => s.skinRarity === rarity)

    if (sort === 'price-asc') list = [...list].sort((a, b) => a.skinPrice - b.skinPrice)
    else if (sort === 'price-desc') list = [...list].sort((a, b) => b.skinPrice - a.skinPrice)
    else list = [...list].sort((a, b) => a.skinName.localeCompare(b.skinName))

    return list
  }, [skins, query, rarity, sort])

  return (
    <section>
      <h1>Skin Katalogi</h1>
      <p className="muted small" style={{ margin: '4px 0 18px' }}>
        {filtered.length} ta skin ko'rsatilmoqda (jami {skins.length})
      </p>

      {/* Filtr va qidiruv paneli */}
      <div className="toolbar">
        <input
          type="search"
          placeholder="🔍  Skin nomi bo'yicha qidirish..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="name">Nom bo'yicha (A→Z)</option>
          <option value="price-asc">Narx ↑ (arzondan)</option>
          <option value="price-desc">Narx ↓ (qimmatdan)</option>
        </select>
        <div className="chips">
          <button className={`chip ${rarity === 'all' ? 'on' : ''}`} onClick={() => setRarity('all')}>Hammasi</button>
          {RARITIES.map((r) => (
            <button key={r} className={`chip ${rarity === r ? 'on' : ''}`} onClick={() => setRarity(r)}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Yuklanmoqda...</p>}
      {!loading && filtered.length === 0 && !error && (
        <p className="muted">Hech narsa topilmadi. Qidiruvni yoki filtrni o'zgartiring.</p>
      )}

      <div className="grid">
        {filtered.map((s) => <SkinCard key={s._id} skin={s} />)}
      </div>
    </section>
  )
}
