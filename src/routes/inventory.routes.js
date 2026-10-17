const { Router } = require('express');
const { getInventory, sellItem } = require('../controllers/inventory.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = Router();

router.use(authenticate); // barcha inventory marshrutlari token talab qiladi

router.get('/', getInventory);
router.post('/:id/sell', sellItem);

module.exports = router;
