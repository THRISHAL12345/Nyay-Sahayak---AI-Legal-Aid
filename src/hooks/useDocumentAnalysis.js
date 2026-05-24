import { useState } from 'react';
import { extractText } from '../utils/extractors';
import { preprocessText } from '../utils/preprocessor';
import { analyzeDocument } from '../utils/groqAnalyzer';
import { translateAnalysis } from '../utils/translator';

export const ANALYSIS_STEPS = {
  IDLE: 'idle',
  EXTRACTING: 'extracting',
  PROCESSING: 'processing',
  ANALYZING: 'analyzing',
  TRANSLATING: 'translating',
  DONE: 'done',
  ERROR: 'error',
};

export function useDocumentAnalysis() {
  const [step, setStep] = useState(ANALYSIS_STEPS.IDLE);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const analyze = async ({ file, documentType, languageCode, languageName }) => {
    setError(null);
    setAnalysis(null);

    try {
      setStep(ANALYSIS_STEPS.EXTRACTING);
      setProgress(10);
      const extracted = await extractText(
        file,
        languageCode,
        (pct) => setProgress(10 + pct * 0.3)
      );

      setStep(ANALYSIS_STEPS.PROCESSING);
      setProgress(45);
      const { numberedText: processedText } = preprocessText(extracted.fullText);

      setStep(ANALYSIS_STEPS.ANALYZING);
      setProgress(55);
      const isDirectLang = ['hi', 'en'].includes(languageCode);
      const targetLangName = isDirectLang ? languageName : 'Hindi';

      const rawAnalysis = await analyzeDocument({
        numberedText: processedText,
        documentType,
        targetLanguage: targetLangName,
      });
      setProgress(80);

      let finalAnalysis = rawAnalysis;
      if (!isDirectLang) {
        setStep(ANALYSIS_STEPS.TRANSLATING);
        finalAnalysis = await translateAnalysis(rawAnalysis, languageCode, languageName);
      }
      setProgress(100);

      setAnalysis(finalAnalysis);
      setStep(ANALYSIS_STEPS.DONE);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err.message);
      setStep(ANALYSIS_STEPS.ERROR);
    }
  };

  const reset = () => {
    setStep(ANALYSIS_STEPS.IDLE);
    setProgress(0);
    setAnalysis(null);
    setError(null);
  };

  return { step, progress, analysis, error, analyze, reset };
}
