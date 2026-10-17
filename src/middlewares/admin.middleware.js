// Faqat admin lar uchun. authenticate dan KIN ishlatilishi shart:
// authenticate req.user ni bazadan kelgan yozuv bilan to'ldiradi.
const adminOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Avtorizatsiya talab qilinadi' });
    }

    // Rolni klientdan emas, bazadan olingan yozuvdan olamiz
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Ruxsat yo\'q: faqat admin uchun' });
    }

    next();
};

module.exports = { adminOnly };
