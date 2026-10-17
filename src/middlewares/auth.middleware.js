const jwt = require('jsonwebtoken');
const User = require('../models/users.model');

// Authorization header: Bearer <token>
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

        if (!token) {
            return res.status(401).json({ message: 'Avtorizatsiya talab qilinadi (token yuborilmadi)' });
        }

        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            const message = err.name === 'TokenExpiredError' ? 'Token muddati tugagan' : 'Token notogri';
            return res.status(401).json({ message });
        }

        // Rol va boshqa ma'lumotlarni bazadan olishamiz — klientimg ishonmaymiz
        const user = await User.findById(payload.id);
        if (!user) {
            return res.status(401).json({ message: 'Token muallifi topilmadi' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Avtorizatsiyani tekshishda xatolik', error: error.message });
    }
};

module.exports = { authenticate };
