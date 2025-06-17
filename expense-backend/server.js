const express = require('express');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();

const { extractTextFromImage } = require('./ocr');
const { generateExpenseMetadata } = require('./ai');

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
