const express = require('express');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();

const { extractTextFromImage } = require('./ocr');
const { generateExpenseMetadata } = require('./ai');
const { generateSavingsTips } = require('./ai-tips');

const app = express();
app.use(cors());
app.use(express.json());

// File upload config
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/extract', upload.single('image'), async (req, res) => {
    console.log("Received file:", req.file);
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const imageBuffer = req.file.buffer;
    const extractedText = await extractTextFromImage(imageBuffer);

    const aiResponse = await generateExpenseMetadata(extractedText);

    res.json({
      text: extractedText,
      ...aiResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Extraction failed' });
  }
});

// Route to get tips based on expense summary
app.post('/api/tips', async (req, res) => {
  try {
    const { summary } = req.body; // e.g., { Food: 5000, Transport: 2000 }
    if (!summary || typeof summary !== 'object') {
      return res.status(400).json({ error: 'Invalid expense summary' });
    }

    const tips = await generateSavingsTips(summary);
    res.json({ tips });
  } catch (err) {
    console.error('Error generating tips:', err);
    res.status(500).json({ error: 'Failed to generate tips' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
