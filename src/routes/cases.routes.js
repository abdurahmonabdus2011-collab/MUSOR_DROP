const { Router } = require('express');
const { getAllCases, getCaseById, openCase } = require('../controllers/cases.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = Router();

// Ommaviy (token talab qilmaydi)
router.get('/', getAllCases);
router.get('/:id', getCaseById);

// Keys ochish — avtorizatsiya shart
router.post('/:id/open', authenticate, openCase);

module.exports = router;
