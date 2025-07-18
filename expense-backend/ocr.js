const vision = require('@google-cloud/vision');
const path = require('path');

// Initialize Google Cloud Vision client
const client = new vision.ImageAnnotatorClient({
  keyFilename: path.join(__dirname, 'google-vision-key.json'), 
});

async function extractTextFromImage(imageBuffer) {
  try {
    const [result] = await client.textDetection({ image: { content: imageBuffer } });
    const detections = result.textAnnotations;
    const fullText = detections.length ? detections[0].description : '';
    console.log("Extracted Text:", fullText);
    return fullText.trim();
  } catch (error) {
    console.error('Vision API Error:', error.message);
    return 'OCR_FAILED';
  }
}

module.exports = { extractTextFromImage };
