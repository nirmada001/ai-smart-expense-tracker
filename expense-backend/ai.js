require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateExpenseMetadata(receiptText) {
  const prompt = `
You're an assistant that categorizes expenses from OCR'd receipt text.

Given this receipt text:
"""
${receiptText}
"""

Extract:
- "Shop Name" - Shop name or merchant
- "Date" - Date of purchase
- "Total Amount" - Prefer 'Net Total', 'Grand Total', 'Gross Total', or final amount paid. If multiple totals exist, pick the final amount.
- "Items" - List of items purchased (if visible)
- "Suggested Title" - A short, human-friendly expense title (e.g., 'Pharmacy - THE NEW PHARMACY')
- "Likely Categories" - 2–3 appropriate expense categories (e.g., 'Healthcare', 'Medicines')

Respond in JSON format.
`;


  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const content = chatCompletion.choices[0].message.content;

    console.log("AI Raw Output:\n", content);

    // Try to parse response
    const raw = JSON.parse(content);

    // Normalize and convert date to YYYY-MM-DD
    function formatDate(dateStr) {
      try {
        // Convert "24-Jun-25" to Date object
        const parsed = new Date(dateStr);
        if (isNaN(parsed)) return dateStr; // fallback if invalid
        const year = parsed.getFullYear();
        const month = String(parsed.getMonth() + 1).padStart(2, '0');
        const day = String(parsed.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      } catch {
        return dateStr;
      }
    }

    // Normalize keys for frontend
    return {
      shop: raw["Shop Name"] || 'N/A',
      date: formatDate(raw["Date"] || 'N/A'), // ✅ converted date here
      total: raw["Total Amount"] || raw["Total amount"] || 'N/A',
      items: raw["Items"] || [],
      title: raw["Title"] || raw["Suggested Title"] || 'N/A',
      categories: raw["Categories"] || raw["Likely Categories"] || [],
      rawResponse: raw,
    };

  } catch (error) {
    console.error("AI Parsing failed:", error.message);
    return {
      shop: 'N/A',
      date: 'N/A',
      total: 'N/A',
      items: [],
      title: 'N/A',
      categories: [],
      rawResponse: 'AI_FAILED',
    };
  }
}

module.exports = { generateExpenseMetadata };
