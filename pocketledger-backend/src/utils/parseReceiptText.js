function parseReceiptText(ocrText) {
  const dateMatch = ocrText.match(
    /(\d{2}[\/\-.]\d{2}[\/\-.]\d{4}|\d{4}-\d{2}-\d{2})/
  );
  const totalKeywords = [
    "total",
    "grand total",
    "amount",
    "balance due",
    "net amount",
    "final amount",
    "payable",
    "amount due",
    "total due",
    "total payable",
  ];
  let amount = null;
  let lines = ocrText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].toLowerCase();
    if (totalKeywords.some((keyword) => line.includes(keyword))) {
      const matches = lines[i].match(/([\d]+[\d,.]*)/g);
      if (matches && matches.length > 0) {
        amount = matches[matches.length - 1];
        break;
      }
    }
  }
  if (!amount) {
    const fallbackAmountMatch = ocrText.match(/([\d]+[\d,.]+)/g);
    if (fallbackAmountMatch && fallbackAmountMatch.length > 0) {
      amount = fallbackAmountMatch.sort(
        (a, b) =>
          parseFloat(b.replace(/,/g, "")) - parseFloat(a.replace(/,/g, ""))
      )[0];
    }
  }
  const gstMatch = ocrText.match(/(?:GST|Tax)\s*[:]?\s*([\d,.]+)/i);
  lines = ocrText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  let vendor = null;
  if (lines.length > 0) {
    vendor = lines[0];
    if (/^\d/.test(vendor) || vendor.length < 3) {
      vendor = lines.find((l) => !/^\d/.test(l) && l.length > 3) || null;
    }
  }
  const vendorKeywordMatch = ocrText.match(
    /(?:From|Vendor|Store|Shop|Merchant)\s*[:]?\s*(.*)/i
  );
  if (vendorKeywordMatch) vendor = vendorKeywordMatch[1].trim();

  let category = "Uncategorized";
  const categories = [
    { name: "Food", keywords: ["restaurant", "food", "cafe", "dine", "meal"] },
    {
      name: "Travel",
      keywords: ["taxi", "uber", "flight", "bus", "train", "travel"],
    },
    {
      name: "Office",
      keywords: ["stationery", "office", "printer", "paper", "supply"],
    },
    { name: "Shopping", keywords: ["mall", "shopping", "store", "purchase"] },
    {
      name: "Medical",
      keywords: ["pharmacy", "medical", "hospital", "clinic"],
    },
    {
      name: "Utilities",
      keywords: ["electricity", "water", "gas", "utility", "bill"],
    },
    { name: "Groceries", keywords: ["grocery", "supermarket", "groceries"] },
  ];
  const lowerText = ocrText.toLowerCase();
  for (const cat of categories) {
    if (cat.keywords.some((k) => lowerText.includes(k))) {
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
    raw: ocrText,
  };
}

module.exports = parseReceiptText;
