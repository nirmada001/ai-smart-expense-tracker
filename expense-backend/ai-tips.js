const OpenAI = require('openai');
require('dotenv').config();

// Initialize the OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateSavingsTips(expenseSummary) {
  // Format the expense summary to a string
  const formattedExpenses = Object.entries(expenseSummary)
    .map(([category, amount]) => `${category}: LKR ${amount}`)
    .join(', ');

  // Construct the prompt
  const prompt = `
You are a financial assistant. Based on the user's current monthly spending pattern:
${formattedExpenses}
Provide 2 smart, practical savings tips. Keep the tips concise and engaging.
`;

  try {
    // Call OpenAI API to generate tips
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    // Return the generated content
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating savings tips:', error);
    throw error;
  }
}

module.exports = { generateSavingsTips };
