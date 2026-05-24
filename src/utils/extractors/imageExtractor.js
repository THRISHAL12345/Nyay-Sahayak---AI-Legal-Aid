import { createWorker } from 'tesseract.js';

const TESSERACT_LANG_MAP = {
  hi: 'hin', en: 'eng', bn: 'ben', te: 'tel', mr: 'mar', ta: 'tam',
  gu: 'guj', kn: 'kan', ml: 'mal', pa: 'pan', or: 'ori', ur: 'urd',
};

export async function extractTextFromImage(file, langCode = 'hi', onProgress) {
  const tesseractLang = TESSERACT_LANG_MAP[langCode] || 'hin+eng';

  const worker = await createWorker(tesseractLang, 1, {
    logger: (m) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(Math.round(m.progress * 100));
      }
    }
  });

  const { data } = await worker.recognize(file);
  await worker.terminate();

  return {
    fullText: `[PAGE 1]\n${data.text}`,
    pageTexts: [{ page: 1, text: data.text }],
    totalPages: 1,
    confidence: data.confidence
  };
}

