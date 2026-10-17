const User = require('../models/users.model');
const jwt = require('jsonwebtoken');

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

// JWT token yasash uchun yordamchi funksiya
const signToken = (user) =>
    jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

// POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Majburiy maydonlar borligini tekshirish
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'username, email va password majburiy maydonlar' });
        }

        if (typeof username !== 'string' || username.trim().length < 3) {
            return res.status(400).json({ message: 'Username kamida 3 belgidan iborat bolishi kerak' });
        }

        // 2. Email formatini tekshirish
        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ message: 'Email formati notogri' });
        }

        // 3. Parol uzunligini tekshirish
        if (typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ message: 'Password kamida 6 belgidan iborat bolishi kerak' });
        }

        // 4. Dublikatni tekshirish
        const existingUser = await User.findOne().or([
            { email: email.toLowerCase().trim() },
            { username: username.trim() }
        ]);

        if (existingUser) {
            return res.status(409).json({
                message: existingUser.email === email.toLowerCase().trim()
                    ? 'Bu email allaqachon royxatdan otgan'
                    : 'Bu username allaqachon band'
            });
        }

        // 5. Yangi foydalanuvchi yaratish (parol model hookida hash qilinadi)
        const newUser = await User.create({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password,
            role: 'user', // royxatdan otgan har kim oddiy user
            wallet: 0     // boshlangich balans 0
        });

        // 6. Parolsiz javob qaytarish
        const user = newUser.toObject();
        delete user.password;

        res.status(201).json({ message: 'Roxatdan otish muvaffaqiyali', user });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Bu username yoki email allaqachon band' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validatsiya xatosi', error: error.message });
        }
        res.status(500).json({ message: 'Royxatdan otishda xatolik', error: error.message });
    }
};

// POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Majburiy maydonlarni tekshirish
        if (!email || !password) {
            return res.status(400).json({ message: 'email va password majburiy' });
        }

        // 2. Userni email orqali topish (password select:false bolgani uchun +password)
        const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Email yoki parol notogri' });
        }

        // 3. Parolni hash bilan solishtirish
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email yoki parol notogri' });
        }

        // 4. JWT token berish
        const token = signToken(user);

        res.status(200).json({
            message: 'Kirish muvaffaqiyali',
            token,
            user: user  // toJSON parolni avtomatikolib tashlaydi
        });
    } catch (error) {
        res.status(500).json({ message: 'Kirishda xatolik', error: error.message });
    }
};

// GET /api/auth/me - joriy authorizatsiyadan otagan user haqida malumot
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Malumot olishda xatolik', error: error.message });
    }
};
