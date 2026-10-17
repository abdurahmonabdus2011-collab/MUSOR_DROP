# 🏠 CS2 Skin Marketplace — Backend (9-dars uy ishi)

Node.js + Express + Mongoose asosida CS2 skinlar bozori uchun backend. Bu etapda **User, Register, Login, JWT, Admin, Case, Inventory, Transaction** tayyor.

## 🚀 Ishga tushirish

1. Paketlarni o'rnatish:
```bash
npm install
```

2. `.env` fayl yaratish (`.env.example` dan nusxa olinadi). O'z qiymatlarini yozing:
```bash
MONGODB_URI=mongodb://localhost:27017/cs2-market
JWT_SECRET=uzun_tasodifiy_secret
JWT_EXPIRES_IN=1h
PORT=5432
```

3. **Frontend (React)** — birinchi marta ishlatilganda:
```bash
cd client
npm install
npm run build     # client/dist papkaga build qiladi (backend o'zi beradi)
```
Keyin `cd ..` orqali backendni ishga tushirishingiz mumkin:
```bash
npm run dev
```
Brauzerda: `http://localhost:5432` — bu yerda React sahifa ochiladi ✅

> Faqat development rejimi uchun (issíq reload): `cd client && npm run dev`
> — bu port `5173` da ochiladi va `/api` so'rovlar backendga proxy qilinadi.

Server: `http://localhost:5432`

4. (Ixtiyoriy) 10 ta test skinini DB ga qo'shish:
```bash
node scripts/seed-skins.js
```

## 📚 Endi ishlab turgan marshrutlar

### Auth
| Metod | URL | Izoh |
|---|---|---|
| POST | `/api/auth/register` | Ro'yxatdan o'tish (username, email, password) |
| POST | `/api/auth/login` | Kirish (email, password) → JWT token |
| GET | `/api/auth/me` | Token bo'yicha joriy SignUp foydalanuvchi |

### Users (faqat admin)
Token yuborish: `Authorization: Bearer <token>`

| Metod | URL | Izoh |
|---|---|---|
| GET | `/api/users` | Barcha foydalanuvchilar |
| GET | `/api/users/:id` | Bitta foydalanuvchi |
| PATCH | `/api/users/:id` | Faqat `username` va `email` yangilanadi (`role`, `wallet` berilmaydi) |
| DELETE | `/api/users/:id` | O'chirish |

Admin qilish uchun MongoDB ichida (mongosh):
```js
db.users.updateOne({email:"admin@example.com"}, {$set:{role:"admin"}})
```

### Skins
| Metod | URL | Kim uchun | Izoh |
|---|---|---|---|
| GET | `/api/skins` | hamma | Katalog ko'rish |
| POST | `/api/skins` | admin | Yangi skin (Joi validator tekshiradi) |
| PATCH | `/api/skins/:id` | admin | Skin yangilash (maydonlar ixtiyoriy) |
| DELETE | `/api/skins/:id` | admin | Skin o'chirish |

### Kelgusi etap uchun tayyor API stublari (kontraktlarni ko'rsatadi)
- `GET /api/cases` — kasedalar list
- `GET /api/cases/:id` — bitta case
- `POST /api/cases/:id/open` — case ochish
- `GET /api/inventory` — joriy user inventari
- `POST /api/inventory/:id/sell` — skin sotish
- `GET /api/wallet` — joriy balans

Bu marshrutlar hozircha `status: "not implemented"` javob bilan qaytadi — kutayotgan va qaytarayotgan ma'lumotlar shakli quyilgan.

## 📁 Struktura

```
src/
├── config/db.js                  # MongoDB ulanish
├── controllers/
│   ├── auth.controller.js        # register / login / me
│   ├── users.controller.js       # CRUD (admin)
│   └── skins.controlles.js       # list (hamma) + create/update/delete (admin)
├── middlewares/
│   ├── auth.middleware.js        # JWT tokenni tekshiradi, req.user -> DB
│   ├── admin.middleware.js       # DB dan role tekshiradi (401/403)
│   └── validate.js               # Joi body validator (skins uchun)
├── models/
│   ├── users.model.js            # User (bcrypt hash, unique, role, wallet)
│   ├── skins.model.js            # Skin
│   ├── case.model.js             # Case (skins + chance, summa = 100)
│   ├── inventory.model.js        # Inventory (har skin uchun ayrı docs)
│   └── transaction.model.js      # Transaction (deposit / case_open / skin_sale)
├── routes/
│   ├── auth.routes.js
│   ├── users.routes.js
│   ├── skins.routes.js
│   ├── cases.routes.js           # stub
│   ├── inventory.routes.js       # stub
│   └── wallet.routes.js          # stub
├── validations/
│   └── skin.validation.js        # Joi schema
└── server.js                     # API + React build beradi (client/dist)

client/                           # React frontend (Vite)
├── package.json
├── vite.config.js                # dev rejimda /api -> backend proxy
├── index.html
└── src/
    ├── main.jsx
    ├── App.jsx                   # sahifalar routeri + navbar
    ├── api.js                    # backendga fetch (JWT bilan)
    ├── AuthContext.jsx           # kirgan user holati (login/logout)
    ├── style.css
    └── pages/
        ├── Home.jsx              # skinlar katalogi
        ├── Login.jsx
        ├── Register.jsx
        ├── Profile.jsx           # user ma'lumotlari + wallet (stub)
        └── Admin.jsx             # faqat admin: skinlar CRUD + users
```

## 🔐 Xavfsizlik bitimlari

- Parollar MongoDB da **bcrypt hash** qilib saqlanadi, plain text emas.
- API javoblarida **parol hech qachon** qaytmaydi (`toJSON` transformda `delete ret.password`).
- Login xatosi: xato email/parol → `401`.
- JWT secret **_.env_** faylida, kod **_git_** da bor emas (`.gitignore` `.env` ni blokirovka qilgan).
- Roles and balance in CRUD API ga berilmaydi: schema maydonlari **PATCH** dan filtr qilinadi.
- Admin rol始终 **bazadan** oladi (`auth.middleware` → DB `req.user` → `admin.middleware`).

## 🧪 Postman test tartibi

1. `POST /api/auth/register` body:
```json
{ "username": "abubakir", "email": "abubakir@example.com", "password": "secret123" }
```
→ 201, user (parolsiz)

2. `POST /api/auth/login` body:
```json
{ "email": "abubakir@example.com", "password": "secret123" }
```
→ 200, `token` olish, uni `Authorization: Bearer <token>` ga qo'yish

3. `GET /api/users` → 403 (bu endi faqat admin) — bu oddiy user uchun tegishli.
4. Admin ochilishi uchun DB da user roliga `admin` bering (yuqorida ko'rsatilgan) va login qiling.
5. `GET /api/users`, `PATCH /api/users/:id`, `DELETE /api/users/:id` — endi admin bilan ishlaydi.
