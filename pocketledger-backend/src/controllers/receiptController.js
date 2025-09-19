
const Tesseract = require('tesseract.js');
const path = require('path');
const parseReceiptText = require('../utils/parseReceiptText');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function toISODate(dateStr) {
  // Handles DD.MM.YYYY or DD/MM/YYYY
  const match = dateStr ? dateStr.match(/(\d{2})[\.\/\-](\d{2})[\.\/\-](\d{4})/) : null;
  if (match) {
    return `${match[3]}-${match[2]}-${match[1]}`; // YYYY-MM-DD
  }
  return null;
}

exports.uploadReceipt = async (req, res) => {
  try {
    const imagePath = req.file.path;
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
    const parsed = parseReceiptText(text);
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }
    // Save transaction to DB (adjust model/fields as needed)
    const transaction = await prisma.transaction.create({
      data: {
        type: 'expense',
        date: parsed.date ? toISODate(parsed.date) : null,
        amount: parsed.amount ? parseFloat(parsed.amount.replace(/,/g, '')) : null,
        category: parsed.category || 'Uncategorized',
        userId: userId,
        // vendor: parsed.vendor,
        // gst: parsed.gst ? parseFloat(parsed.gst.replace(/,/g, '')) : null,
        // ocrText: parsed.raw,
        // Add other fields as needed
      }
    });

    res.json({ transaction, ocrText: text, parsed });
  } catch (error) {
    res.status(500).json({ error: 'OCR or DB failed', details: error.message });
  }
};