require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateExpenseMetadata(receiptText) {
  const prompt = `
You're an assistant that categorizes expenses.

Given this receipt text:
"""
${receiptText}
"""

Extract:
- "Shop Name" - Shop name
- Date (if available)
- "Total Amount" - Total amount as "Total Amount"
- Items (if visible)
- "Suggested Title" - A suitable title for the expense (e.g., 'Grocery at SuperMart') as "Suggested Title"
- "Likely Categories" - 2-3 likely categories (e.g., 'Grocery', 'Food', 'Dining') as "Likely Categories"

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

    // Normalize keys for frontend
    return {
      shop: raw["Shop Name"] || 'N/A',
      date: raw["Date"] || 'N/A',
      total: raw["Total Amount"] || raw["Total amount"] || 'N/A',
      items: raw["Items"] || [],
      title: raw["Title"] || raw["Suggested Title"] || 'N/A',
      categories: raw["Categories"] || raw["Likely Categories"] || [],
      rawResponse: raw, // optional, for debugging
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
