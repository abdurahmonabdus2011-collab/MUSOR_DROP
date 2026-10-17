const { Router } = require('express');
const { getAllSkins, createSkin, updateSkin, deleteSkin } = require('../controllers/skins.controlles');
const { authenticate } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/admin.middleware');
const validate = require('../middlewares/validate');
const { skinSchema, skinUpdateSchema } = require('../validations/skin.validation');

const router = Router();

// Katalog ko'rish — hamma uchun ochiq
router.get('/', getAllSkins);

// Katalogni boshqarish — faqat admin (part 5 talabi)
router.post('/', authenticate, adminOnly, validate(skinSchema), createSkin);
router.patch('/:id', authenticate, adminOnly, validate(skinUpdateSchema), updateSkin);
router.delete('/:id', authenticate, adminOnly, deleteSkin);

module.exports = router;