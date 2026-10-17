// SkinCard — skin ma'lumotlarini chiroyli kartochka qilib chiqaradi.
// Rasmi bo'lsa img ko'rsatiladi, yo'q bo'lsa 🔫 ikonka (fallback).

const RARITY_UZ = {
  Common: 'Oddiy',
  Rare: 'Kam uchraydigan',
  Epic: 'Epic',
  Legendary: 'Legendary',
  Mythic: 'Mythic',
}

export default function SkinCard({ skin }) {
  return (
    <div className={`card skin ${skin.skinRarity.toLowerCase()}`}>
      {skin.imageUrl ? (
        <img
          src={skin.imageUrl}
          alt={skin.skinName}
          className="skin-img"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.nextElementSibling.style.display = 'grid'
          }}
        />
      ) : null}
      <div className="mono-icon fallback-icon" style={skin.imageUrl ? { display: 'none' } : undefined}>
        🔫
      </div>
      <h3>{skin.skinName}</h3>
      <span className="rarity-label">{RARITY_UZ[skin.skinRarity] || skin.skinRarity}</span>
      <div className="price">${Number(skin.skinPrice).toFixed(2)}</div>
    </div>
  )
}
