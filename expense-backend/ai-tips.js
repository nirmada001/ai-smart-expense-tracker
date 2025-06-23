const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function generateSavingsTips(expenseSummary) {
  const formattedExpenses = Object.entries(expenseSummary)
    .map(([category, amount]) => `${category}: LKR ${amount}`)
    .join(', ');

  const prompt = `
You are a financial assistant. Based on the user's current monthly spending pattern:
${formattedExpenses}
Provide 2 smart, practical savings tips. Keep the tips concise and engaging.
`;

  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  return response.data.choices[0].message.content;
}

module.exports = { generateSavingsTips };
