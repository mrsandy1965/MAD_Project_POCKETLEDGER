const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const receiptController = require('../controllers/receiptController');

router.post('/upload', upload.single('receipt'), receiptController.uploadReceipt);

module.exports = router;