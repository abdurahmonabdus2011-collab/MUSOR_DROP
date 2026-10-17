const { Router } = require('express');
const { getWallet, deposit, getTransactions } = require('../controllers/wallet.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = Router();

router.use(authenticate); // barcha wallet marshrutlari token talab qiladi

router.get('/', getWallet);
router.post('/deposit', deposit);
router.get('/transactions', getTransactions);

module.exports = router;
