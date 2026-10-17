const { Router } = require('express');
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/users.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/admin.middleware');

const router = Router();

// Homiy qilinishi kerak: hozircha faqat authorizatsiyadan otagan admin ko'radi.
// Endi maxfiy ma'lumotlar (parol, role) himoyalanadi.
router.use(authenticate, adminOnly);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
