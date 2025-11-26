const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getMonthlyReport } = require('../controllers/reportController');

const router = express.Router();

router.use(authMiddleware);

router.get('/monthly', getMonthlyReport);

module.exports = router;
