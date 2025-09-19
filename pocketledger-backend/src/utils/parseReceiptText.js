// Utility function to parse OCR text and extract transaction details
// This is a simple example. You can improve it for more formats.

function parseReceiptText(ocrText) {
    // Date: DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY, YYYY-MM-DD
    const dateMatch = ocrText.match(/(\d{2}[\/\-.]\d{2}[\/\-.]\d{4}|\d{4}-\d{2}-\d{2})/);
  
    // Amount: look for lines with total keywords and extract the last valid amount
    const totalKeywords = [
      'total', 'grand total', 'amount', 'balance due', 'net amount', 'final amount', 'payable', 'amount due', 'total due', 'total payable'
    ];
    let amount = null;
    let lines = ocrText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i].toLowerCase();
      if (totalKeywords.some(keyword => line.includes(keyword))) {
        // Extract the last number from the line
        const matches = lines[i].match(/([\d]+[\d,.]*)/g);
        if (matches && matches.length > 0) {
          amount = matches[matches.length - 1];
          break;
        }
      }
    }
    // Fallback: largest number in the text if no total keyword found
    if (!amount) {
      const fallbackAmountMatch = ocrText.match(/([\d]+[\d,.]+)/g);
      if (fallbackAmountMatch && fallbackAmountMatch.length > 0) {
        amount = fallbackAmountMatch.sort((a, b) => parseFloat(b.replace(/,/g, '')) - parseFloat(a.replace(/,/g, '')))[0];
      }
    }
  
    // GST: look for GST, Tax
    const gstMatch = ocrText.match(/(?:GST|Tax)\s*[:]?\s*([\d,.]+)/i);
  
    // Vendor: first line, or look for keywords
    lines = ocrText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    let vendor = null;
    if (lines.length > 0) {
      vendor = lines[0];
      // If first line is a date or number, look for next non-numeric line
      if (/^\d/.test(vendor) || vendor.length < 3) {
        vendor = lines.find(l => !/^\d/.test(l) && l.length > 3) || null;
      }
    }
    // Also check for explicit keywords
    const vendorKeywordMatch = ocrText.match(/(?:From|Vendor|Store|Shop|Merchant)\s*[:]?\s*(.*)/i);
    if (vendorKeywordMatch) vendor = vendorKeywordMatch[1].trim();
  
    // Category: basic keyword matching
    let category = 'Uncategorized';
    const categories = [
      { name: 'Food', keywords: ['restaurant', 'food', 'cafe', 'dine', 'meal'] },
      { name: 'Travel', keywords: ['taxi', 'uber', 'flight', 'bus', 'train', 'travel'] },
      { name: 'Office', keywords: ['stationery', 'office', 'printer', 'paper', 'supply'] },
      { name: 'Shopping', keywords: ['mall', 'shopping', 'store', 'purchase'] },
      { name: 'Medical', keywords: ['pharmacy', 'medical', 'hospital', 'clinic'] },
      { name: 'Utilities', keywords: ['electricity', 'water', 'gas', 'utility', 'bill'] },
      { name: 'Groceries', keywords: ['grocery', 'supermarket', 'groceries'] },
    ];
    const lowerText = ocrText.toLowerCase();
    for (const cat of categories) {
      if (cat.keywords.some(k => lowerText.includes(k))) {
        category = cat.name;
        break;
      }
    }
  
    return {
      date: dateMatch ? dateMatch[1] : null,
      amount,
      gst: gstMatch ? gstMatch[1] : null,
      vendor,
      category,
      raw: ocrText // Keep raw text for reference
    };
  }
  
  module.exports = parseReceiptText;
  