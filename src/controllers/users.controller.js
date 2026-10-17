const User = require('../models/users.model');

const MONGO_ID_REGEX = /^[0-9a-fA-F]{24}$/;

// GET /api/users - barcha foydalanuvchilar (parolsiz)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Foydalanuvchilarni olishda xatolik', error: error.message });
    }
};

// GET /api/users/:id - bitta foydalanuvchi
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!MONGO_ID_REGEX.test(id)) {
            return res.status(400).json({ message: 'ID notogri formatda' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Foydalanuvchini olishda xatolik', error: error.message });
    }
};

// PATCH /api/users/:id - admin foydalanuvchini yangilaydi (username, email, wallet, role)
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!MONGO_ID_REGEX.test(id)) {
            return res.status(400).json({ message: 'ID notogri formatda' });
        }

        const { username, email, wallet, role } = req.body;
        const updates = {};
        if (username !== undefined) updates.username = username;
        if (email !== undefined) updates.email = email;
        if (wallet !== undefined) {
            const num = Number(wallet);
            if (isNaN(num) || num < 0) {
                return res.status(400).json({ message: 'Wallet 0 yoki musbat son bo\'lishi kerak' });
            }
            updates.wallet = num;
        }
        if (role !== undefined) {
            if (!['user', 'admin'].includes(role)) {
                return res.status(400).json({ message: 'Role faqat "user" yoki "admin" bo\'lishi kerak' });
            }
            updates.role = role;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'Yangilash uchun malumot yuborilmadi' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }

        Object.assign(user, updates);
        await user.save();

        res.status(200).json({ message: 'Foydalanuvchi yangilandi', user });
    } catch (error) {
        // unique indeks xatosi (dublikat username / email)
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Bu username yoki email allaqachon band' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validatsiya xatosi', error: error.message });
        }
        res.status(500).json({ message: 'Foydalanuvchini yangilashda xatolik', error: error.message });
    }
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!MONGO_ID_REGEX.test(id)) {
            return res.status(400).json({ message: 'ID notogri formatda' });
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }

        res.status(200).json({ message: 'Foydalanuvchi ochirildi' });
    } catch (error) {
        res.status(500).json({ message: 'Foydalanuvchini ochirishda xatolik', error: error.message });
    }
};
