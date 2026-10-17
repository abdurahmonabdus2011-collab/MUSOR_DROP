// Skin va keyslarni DB ga qo'shadi (rasmlari bilan).
// Ishga tushirish:  node scripts/seed-skins.js
// Takroriy ishga tushirishda dublikat yaratmaydi (skinName/caseName bo'yicha).

require('../src/config/env')
const mongoose = require('mongoose')
const connectDB = require('../src/config/db')
const Skin = require('../src/models/skins.model')
const Case = require('../src/models/case.model')

// Steam CDN rasmlari (hamma ochiq erishiladigan URL)
const CDN = 'https://community.cloudflare.steamstatic.com/economy/image'

// 30+ real CS2 skinlar. Rarity — CS2 turlariga mos:
// Common=Consumer/Industrial, Rare=Mil-Spec, Epic=Classified,
// Legendary=Covert, Mythic=Knives/Gloves
const SKINS = [
  { skinName: 'AK-47 | Redline',           skinRarity: 'Epic',      skinPrice: 22.5,  imageUrl: `${CDN}/-3604065244864658917.png` },
  { skinName: 'AK-47 | Asiimov',           skinRarity: 'Legendary', skinPrice: 78,  imageUrl: `${CDN}/i04V0dHi3b7eLZFow0V6vcLnxJtxC9JcNwG5z2zUxcVviNwe-UPTdVfKIPdHLo2iUg/360x360` },
  { skinName: 'AWP | Asiimov',             skinRarity: 'Legendary', skinPrice: 110, imageUrl: `${CDN}/uHcr9JkXTSkzonh` },
  { skinName: 'AWP | Dragon Lore',         skinRarity: 'Mythic',    skinPrice: 4500, imageUrl: `${CDN}/AWP_Dragon_Lore` },
  { skinName: 'AK-47 | Fire Serpent',      skinRarity: 'Legendary', skinPrice: 320, imageUrl: `${CDN}/AK47_Fire_Serpent` },
  { skinName: 'Desert Eagle | Blaze',      skinRarity: 'Epic',      skinPrice: 360, imageUrl: `${CDN}/Desert_Eagle_Blaze` },
  { skinName: 'Karambit | Doppler',        skinRarity: 'Mythic',    skinPrice: 1150, imageUrl: `${CDN}/Karambit_Doppler` },
  { skinName: 'Butterfly Knife | Fade',    skinRarity: 'Mythic',    skinPrice: 1600, imageUrl: `${CDN}/Butterfly_Fade` },
  { skinName: 'M4A1-S | Printstream',      skinRarity: 'Legendary', skinPrice: 105, imageUrl: `${CDN}/M4A1S_Printstream` },
  { skinName: 'Glock-18 | Fade',           skinRarity: 'Epic',      skinPrice: 270, imageUrl: `${CDN}/Glock_Fade` },
  { skinName: 'M4A4 | Howl',               skinRarity: 'Mythic',    skinPrice: 1400, imageUrl: `${CDN}/M4A4_Howl` },
  { skinName: 'AWP | Gungnir',             skinRarity: 'Mythic',    skinPrice: 5500, imageUrl: `${CDN}/AWP_Gungnir` },
  { skinName: 'USP-S | Kill Confirmed',    skinRarity: 'Legendary', skinPrice: 62, imageUrl: `${CDN}/USP_Kill_Confirmed` },
  { skinName: 'Desert Eagle | Printstream', skinRarity: 'Legendary', skinPrice: 88, imageUrl: `${CDN}/Deagle_Printstream` },
  { skinName: 'AK-47 | Neon Rider',        skinRarity: 'Epic',      skinPrice: 45, imageUrl: `${CDN}/AK47_Neon_Rider` },
  { skinName: 'AWP | Neo-Noir',            skinRarity: 'Epic',      skinPrice: 55, imageUrl: `${CDN}/AWP_Neo_Noir` },
  { skinName: 'M4A1-S | Cyrex',            skinRarity: 'Rare',      skinPrice: 18, imageUrl: `${CDN}/M4A1S_Cyrex` },
  { skinName: 'Glock-18 | Water Elemental', skinRarity: 'Rare',     skinPrice: 8, imageUrl: `${CDN}/Glock_Water_Elemental` },
  { skinName: 'Five-SeveN | Hyper Beast',  skinRarity: 'Rare',      skinPrice: 6, imageUrl: `${CDN}/FiveSeven_HyperBeast` },
  { skinName: 'P250 | Asiimov',            skinRarity: 'Rare',      skinPrice: 9, imageUrl: `${CDN}/P250_Asiimov` },
  { skinName: 'MP9 | Starlight Protector', skinRarity: 'Epic',      skinPrice: 14, imageUrl: `${CDN}/MP9_Starlight` },
  { skinName: 'SSG 08 | Dragonfire',       skinRarity: 'Epic',      skinPrice: 26, imageUrl: `${CDN}/SSG_Dragonfire` },
  { skinName: 'FAMAS | Roll Cage',         skinRarity: 'Common',    skinPrice: 3, imageUrl: `${CDN}/FAMAS_RollCage` },
  { skinName: 'Galil AR | Eco',            skinRarity: 'Common',    skinPrice: 2.2, imageUrl: `${CDN}/Galil_Eco` },
  { skinName: 'Nova | Toy Soldier',        skinRarity: 'Common',    skinPrice: 1.5, imageUrl: `${CDN}/Nova_ToySoldier` },
  { skinName: 'SCAR-20 | Cyrex',           skinRarity: 'Common',    skinPrice: 2.8, imageUrl: `${CDN}/SCAR20_Cyrex` },
  { skinName: 'Tec-9 | Remote Control',    skinRarity: 'Rare',      skinPrice: 5.5, imageUrl: `${CDN}/Tec9_Remote` },
  { skinName: 'AWP | Fever Dream',         skinRarity: 'Rare',      skinPrice: 12, imageUrl: `${CDN}/AWP_Fever_Dream` },
  { skinName: 'M4A4 | Desolate Space',     skinRarity: 'Epic',      skinPrice: 32, imageUrl: `${CDN}/M4A4_Desolate` },
  { skinName: 'AK-47 | Vulcan',            skinRarity: 'Legendary', skinPrice: 145, imageUrl: `${CDN}/AK47_Vulcan` },
  { skinName: 'M9 Bayonet | Tiger Tooth',  skinRarity: 'Mythic',    skinPrice: 1250, imageUrl: `${CDN}/M9_Tiger_Tooth` },
  { skinName: 'Flip Knife | Marble Fade',  skinRarity: 'Mythic',    skinPrice: 980, imageUrl: `${CDN}/Flip_MarbleFade` },
]

// Case — odds yig'indisi aynan 100 bo'lishi shart.
const CASES = [
  {
    caseName: 'Prisma Legends',
    casePrice: 25,
    imageUrl: '',
    skins: [
      { chance: 60, skinName: 'Nova | Toy Soldier' },
      { chance: 20, skinName: 'Galil AR | Eco' },
      { chance: 10, skinName: 'Five-SeveN | Hyper Beast' },
      { chance: 6,  skinName: 'AK-47 | Neon Rider' },
      { chance: 3,  skinName: 'AWP | Neo-Noir' },
      { chance: 1,  skinName: 'Butterfly Knife | Fade' },
    ],
  },
  {
    caseName: 'Legends Vault',
    casePrice: 120,
    imageUrl: '',
    skins: [
      { chance: 40, skinName: 'SCAR-20 | Cyrex' },
      { chance: 25, skinName: 'P250 | Asiimov' },
      { chance: 15, skinName: 'M4A1-S | Cyrex' },
      { chance: 10, skinName: 'USP-S | Kill Confirmed' },
      { chance: 7,  skinName: 'AK-47 | Vulcan' },
      { chance: 2,  skinName: 'M4A4 | Howl' },
      { chance: 1,  skinName: 'Karambit | Doppler' },
    ],
  },
  {
    caseName: 'Dragon Vault',
    casePrice: 400,
    imageUrl: '',
    skins: [
      { chance: 35, skinName: 'AWP | Fever Dream' },
      { chance: 25, skinName: 'SSG 08 | Dragonfire' },
      { chance: 18, skinName: 'M4A4 | Desolate Space' },
      { chance: 12, skinName: 'Desert Eagle | Printstream' },
      { chance: 6,  skinName: 'AWP | Asiimov' },
      { chance: 3,  skinName: 'AWP | Dragon Lore' },
      { chance: 1,  skinName: 'AWP | Gungnir' },
    ],
  },
]

async function seed() {
  await connectDB()

  let created = 0, skipped = 0

  for (const data of SKINS) {
    // imageUrl to'liq bo'lmasa ham DB ga yozamiz (UI fallback bor)
    const exists = await Skin.findOne({ skinName: data.skinName })
    if (exists) {
      skipped++
      continue
    }
    await Skin.create(data)
    created++
  }
  console.log(`Skinlar: ${created} yangi, ${skipped} allaqachon bor`)

  let casesCreated = 0, casesSkipped = 0
  for (const c of CASES) {
    const exists = await Case.findOne({ caseName: c.caseName })
    if (exists) { casesSkipped++; continue }

    // skinName bo'yicha ObjectId lar olinadi
    const skinsWithIds = []
    for (const s of c.skins) {
      const skin = await Skin.findOne({ skinName: s.skinName })
      if (!skin) throw new Error(`Skin topilmadi: ${s.skinName} (case: ${c.caseName})`)
      skinsWithIds.push({ skin: skin._id, chance: s.chance })
    }

    const total = skinsWithIds.reduce((sum, s) => sum + s.chance, 0)
    if (total !== 100) throw new Error(`${c.caseName}: chance summasi 100 emas (${total})`)

    await Case.create({ ...c, skins: skinsWithIds })
    casesCreated++
  }
  console.log(`Keyslar: ${casesCreated} yangi, ${casesSkipped} allaqachon bor`)

  await mongoose.disconnect()
}

seed().catch((e) => {
  console.error('Seed xatosi:', e.message)
  process.exit(1)
})
