const Tesseract = require('tesseract.js');
const path = require('path');

exports.uploadReceipt = async (req, res) => {
  try {
    const imagePath = req.file.path;
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
    // Simple parsing: you can improve this later
    res.json({ ocrText: text });
  } catch (error) {
    res.status(500).json({ error: 'OCR failed', details: error.message });
  }
};