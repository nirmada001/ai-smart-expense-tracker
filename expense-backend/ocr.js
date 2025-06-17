const sharp = require('sharp');
const Tesseract = require('tesseract.js');

async function extractTextFromImage(imageBuffer) {
  try {
    console.log("Original image buffer size:", imageBuffer.length);

    // Convert to PNG to avoid issues with certain JPEGs
    const pngBuffer = await sharp(imageBuffer).png().toBuffer();

    console.log("Converted PNG buffer size:", pngBuffer.length);

    const { data: { text } } = await Tesseract.recognize(pngBuffer, 'eng');

    console.log("Extracted Text:", text);

    return text.trim();
  } catch (error) {
    console.error("OCR failed:", error.message);
    return 'OCR_FAILED';
  }
}

module.exports = { extractTextFromImage };
