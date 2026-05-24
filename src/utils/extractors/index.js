import { extractTextFromPDF } from './pdfExtractor';
import { extractTextFromImage } from './imageExtractor';

export async function extractText(file, langCode, onProgress) {
  if (file.type === 'application/pdf') {
    return await extractTextFromPDF(file);
  } else {
    return await extractTextFromImage(file, langCode, onProgress);
  }
}
