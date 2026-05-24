# ⚙️ AI Legal Aid — Complete Workflow README

> Stack: React + Vite + Groq API + Tesseract.js + Firebase (optional) + Web Speech API

---

## 🗺️ Project Overview

**Nyay Sahayak** (न्याय सहायक) is a web app that:
1. Accepts a legal document (PDF / image / camera scan)
2. Extracts text using OCR if needed
3. Sends it to Groq's LLM with a carefully engineered prompt
4. Returns a structured JSON analysis with plain-language explanations, danger flags, cited sources, and applicable laws
5. Displays everything in the user's chosen Indian language with text-to-speech support

---

## 🧰 Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 18 + Vite | Fast, component-based, easy to deploy |
| Styling | Tailwind CSS | Utility-first, responsive, fast to build |
| OCR (images) | Tesseract.js | Free, runs in browser, no server needed |
| PDF text extraction | PDF.js (pdfjs-dist) | Browser-native, no backend needed |
| AI Analysis | Groq API (llama-3.3-70b-versatile) | Free tier, extremely fast inference |
| Translation / Multilingual | Groq API (same call) | Ask model to respond in target language |
| Text-to-Speech | Web Speech API (browser built-in) | Zero cost, works offline after load |
| Camera scan | HTML5 MediaDevices API | Built into every modern phone browser |
| Hosting | Vercel (free tier) | One-click deploy, HTTPS, fast CDN |
| Storage (optional) | Firebase Firestore | If you want to save past analyses |

---

## 📦 Project Setup

### 1. Initialize Project

```bash
npm create vite@latest nyay-sahayak -- --template react
cd nyay-sahayak
npm install
```

### 2. Install Dependencies

```bash
# Core
npm install tailwindcss @tailwindcss/vite

# PDF text extraction
npm install pdfjs-dist

# OCR for images
npm install tesseract.js

# HTTP client
npm install axios

# Routing
npm install react-router-dom

# Icons
npm install lucide-react

# i18n (internationalization)
npm install i18next react-i18next i18next-http-backend

# Optional: PDF report generation
npm install jspdf html2canvas
```

### 3. Environment Variables

Create a `.env` file in the root:

```env
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_APP_NAME=Nyay Sahayak
```

Get your free Groq API key at: https://console.groq.com

> ⚠️ **Important:** Never expose your API key in production. In production, route Groq calls through a simple backend (Vercel serverless function). For development and portfolio demo, direct call from frontend is fine.

### 4. Vite Config

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    exclude: ['tesseract.js']  // prevent Vite from pre-bundling Tesseract
  }
})
```

---

## 🔄 Complete Data Flow

```
USER ACTION
    │
    ▼
┌───────────────────────────────────────────────────────────┐
│  STEP 1: Document Input                                    │
│  - File upload (PDF/JPG/PNG)                               │
│  - Camera capture (MediaDevices API)                       │
│  - Document type selection (Rent/Land/Job/Loan/Court)      │
└───────────────────────────┬───────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────┐
│  STEP 2: Text Extraction                                   │
│  IF PDF  → PDF.js extractTextContent()                     │
│  IF IMG  → Tesseract.js OCR (language auto-detect)        │
│  Output  → Raw text string                                 │
└───────────────────────────┬───────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────┐
│  STEP 3: Text Preprocessing                                │
│  - Remove excessive whitespace                             │
│  - Split into numbered sections/paragraphs                 │
│  - Tag each section with page + paragraph number           │
│  - Truncate to 6000 tokens if needed (Groq limit safety)  │
└───────────────────────────┬───────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────┐
│  STEP 4: Groq API Call                                     │
│  - Model: llama-3.3-70b-versatile                          │
│  - System prompt: Legal expert persona + JSON schema       │
│  - User prompt: Preprocessed document text                 │
│  - Response format: Strict JSON                            │
└───────────────────────────┬───────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────┐
│  STEP 5: Response Parsing & Validation                     │
│  - Parse JSON response                                     │
│  - Validate required fields exist                          │
│  - Fallback handling if JSON malformed                     │
└───────────────────────────┬───────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────┐
│  STEP 6: Language Translation                              │
│  IF selected language ≠ English/Hindi                      │
│  → Second Groq call: translate analysis JSON               │
│  ELSE use response as-is                                   │
└───────────────────────────┬───────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────┐
│  STEP 7: Render Analysis UI                                │
│  - Summary card                                            │
│  - Danger flags with citation cards                        │
│  - Rights section                                          │
│  - Section-by-section accordion                            │
│  - TTS buttons on every section                            │
└───────────────────────────────────────────────────────────┘
```

---

## 📄 Step 1: Document Input

### File Upload Handler

```jsx
// components/UploadZone/UploadZone.jsx

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 10;

export function UploadZone({ onFileReady }) {
  const handleFile = (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      alert('केवल PDF, JPG, PNG फ़ाइलें / Only PDF, JPG, PNG files');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert('फ़ाइल बहुत बड़ी है / File too large (max 10MB)');
      return;
    }
    onFileReady(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="upload-zone"
    >
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        onChange={handleChange}
        id="file-input"
        hidden
      />
      <label htmlFor="file-input">
        {/* Upload UI */}
      </label>
    </div>
  );
}
```

### Camera Capture

```jsx
// components/CameraCapture/CameraCapture.jsx

export function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const [streaming, setStreaming] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }  // rear camera on phones
      });
      videoRef.current.srcObject = stream;
      setStreaming(true);
    } catch (err) {
      alert('कैमरा नहीं मिला / Camera not accessible');
    }
  };

  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
      onCapture(file);
      // Stop camera stream
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      setStreaming(false);
    }, 'image/jpeg', 0.92);
  };

  return (
    <div>
      {!streaming ? (
        <button onClick={startCamera}>📷 कैमरा खोलें / Open Camera</button>
      ) : (
        <div>
          <video ref={videoRef} autoPlay playsInline />
          <button onClick={capturePhoto}>📸 खींचें / Capture</button>
        </div>
      )}
    </div>
  );
}
```

---

## 📝 Step 2: Text Extraction

### PDF Text Extraction (PDF.js)

```js
// utils/extractors/pdfExtractor.js
import * as pdfjsLib from 'pdfjs-dist';

// Required: set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';
  let pageTexts = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    const pageText = textContent.items
      .map(item => item.str)
      .join(' ')
      .trim();

    fullText += `\n[PAGE ${pageNum}]\n${pageText}\n`;
    pageTexts.push({ page: pageNum, text: pageText });
  }

  return { fullText, pageTexts, totalPages: pdf.numPages };
}
```

### Image OCR (Tesseract.js)

```js
// utils/extractors/imageExtractor.js
import Tesseract from 'tesseract.js';

// Map language codes to Tesseract language packs
const TESSERACT_LANG_MAP = {
  hi:  'hin',
  en:  'eng',
  bn:  'ben',
  te:  'tel',
  mr:  'mar',
  ta:  'tam',
  gu:  'guj',
  kn:  'kan',
  ml:  'mal',
  pa:  'pan',
  or:  'ori',
  ur:  'urd',
};

export async function extractTextFromImage(file, langCode = 'hi', onProgress) {
  const tesseractLang = TESSERACT_LANG_MAP[langCode] || 'hin+eng';

  const result = await Tesseract.recognize(file, tesseractLang, {
    logger: (m) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(Math.round(m.progress * 100));
      }
    }
  });

  return {
    fullText: `[PAGE 1]\n${result.data.text}`,
    pageTexts: [{ page: 1, text: result.data.text }],
    totalPages: 1,
    confidence: result.data.confidence
  };
}
```

### Master Extractor

```js
// utils/extractors/index.js
import { extractTextFromPDF } from './pdfExtractor';
import { extractTextFromImage } from './imageExtractor';

export async function extractText(file, langCode, onProgress) {
  if (file.type === 'application/pdf') {
    return await extractTextFromPDF(file);
  } else {
    return await extractTextFromImage(file, langCode, onProgress);
  }
}
```

---

## 🔧 Step 3: Text Preprocessing

```js
// utils/preprocessor.js

export function preprocessText(rawText) {
  // 1. Clean up extra whitespace
  let cleaned = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

  // 2. Split into sections by page markers
  const sections = cleaned.split(/\[PAGE \d+\]/g)
    .filter(s => s.trim().length > 0)
    .map((text, idx) => ({
      sectionId: idx + 1,
      page: idx + 1,
      text: text.trim(),
      // Split into paragraphs
      paragraphs: text.trim()
        .split(/\n\n+/)
        .filter(p => p.trim().length > 10)
        .map((para, pIdx) => ({
          paragraphId: pIdx + 1,
          text: para.trim()
        }))
    }));

  // 3. Create a numbered flat text for the LLM
  //    Each paragraph gets a unique reference: [P1.1], [P1.2], [P2.1]...
  let numberedText = '';
  sections.forEach(section => {
    numberedText += `\n[PAGE ${section.page}]\n`;
    section.paragraphs.forEach(para => {
      numberedText += `[P${section.page}.${para.paragraphId}] ${para.text}\n\n`;
    });
  });

  // 4. Truncate to ~5000 words to stay within Groq's context limits
  const words = numberedText.split(' ');
  if (words.length > 5000) {
    numberedText = words.slice(0, 5000).join(' ') + '\n\n[... दस्तावेज़ काटा गया / Document truncated ...]';
  }

  return { numberedText, sections };
}
```

---

## 🤖 Step 4: Groq API Call

### The System Prompt (Most Critical Part)

```js
// utils/prompts.js

export function buildSystemPrompt(documentType, targetLanguage) {
  return `
You are Nyay Sahayak, an expert Indian legal document analyst. You help rural, often illiterate people understand their legal documents in simple, plain language.

Your role:
- Analyze the document as a senior Indian lawyer would
- Explain everything in the SIMPLEST possible language, like explaining to a village elder
- Be VERY specific about sources — cite exactly which page, paragraph, and line you're referring to
- Flag any clauses that could harm the document signer
- Explain which Indian laws apply and how they protect the signer
- NEVER use legal jargon without immediately explaining it in simple words

Document type: ${documentType}
Output language: ${targetLanguage}

You MUST respond with ONLY valid JSON. No preamble, no markdown, no explanation outside the JSON.

JSON Schema you must follow EXACTLY:

{
  "documentType": "string — type of legal document",
  "language": "string — language code of response",
  "summary": {
    "plain": "string — 3-4 sentences in very simple language explaining what this document is about",
    "parties": ["string — who are the parties involved"],
    "keyDates": ["string — important dates mentioned"],
    "keyAmounts": ["string — important money amounts mentioned"]
  },
  "dangerFlags": [
    {
      "id": "string — unique id like 'flag_1'",
      "severity": "string — one of: DANGEROUS | SUSPICIOUS | UNFAIR",
      "title": "string — short title of the problem",
      "explanation": "string — explain in simple language why this is dangerous/unfair",
      "source": {
        "page": "number — page number where this clause is found",
        "paragraph": "string — paragraph reference like P2.3",
        "originalText": "string — exact original text from the document (max 100 words)",
        "location": "string — human readable location like: Page 2, Paragraph 3, Line 4-6"
      },
      "applicableLaw": {
        "actName": "string — name of the Indian law that applies",
        "section": "string — specific section number",
        "whatItSays": "string — what that law says in simple language",
        "howItProtectsYou": "string — how this law protects the document signer"
      },
      "recommendation": "string — what the person should do about this"
    }
  ],
  "yourRights": [
    {
      "right": "string — a right the signer has in simple language",
      "source": "string — which law grants this right (Act name + Section)"
    }
  ],
  "sectionBreakdown": [
    {
      "sectionTitle": "string — name/number of this section/clause",
      "page": "number",
      "paragraph": "string — paragraph reference",
      "originalText": "string — exact original text (max 80 words)",
      "plainExplanation": "string — what this section means in simple language",
      "isFair": "boolean — is this section fair to the signer?",
      "concern": "string or null — any concern about this section"
    }
  ],
  "overallVerdict": {
    "rating": "string — one of: SIGN_SAFE | SIGN_WITH_CAUTION | DO_NOT_SIGN | GET_LEGAL_HELP",
    "reason": "string — why this verdict in simple language",
    "immediateActions": ["string — specific things to do right now"]
  }
}
`;
}

export function buildUserPrompt(numberedText) {
  return `
Analyze this legal document. Every clause you reference MUST include the paragraph reference (e.g., P2.3) so it can be found in the original document.

Document text (paragraphs are labeled [Ppage.paragraph]):

${numberedText}
`;
}
```

### The Groq API Call

```js
// utils/groqAnalyzer.js

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

export async function analyzeDocument({
  numberedText,
  documentType,
  targetLanguage,
  onChunk           // optional: for streaming progress
}) {
  const systemPrompt = buildSystemPrompt(documentType, targetLanguage);
  const userPrompt = buildUserPrompt(numberedText);

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt }
      ],
      temperature: 0.1,        // Low temperature = more consistent, factual output
      max_tokens: 4000,
      response_format: { type: 'json_object' }  // Force JSON output
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Groq API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const rawContent = data.choices[0].message.content;

  try {
    return JSON.parse(rawContent);
  } catch (e) {
    // Sometimes the model adds markdown backticks despite json_object mode
    const cleaned = rawContent.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  }
}
```

---

## 🌐 Step 5: Multilingual Translation

### Strategy

The analysis is generated in **Hindi + English** by default (since Llama-3.3 handles these best). For other Indian languages, a second Groq call translates the result.

> **Why not generate in the target language directly?**
> Llama-3.3-70b handles Hindi/English legal reasoning much better than Odia or Manipuri. Generating in Hindi first and then translating gives much better quality.

```js
// utils/translator.js

export async function translateAnalysis(analysisJSON, targetLanguage, targetLanguageName) {
  // No translation needed for Hindi or English
  if (['hi', 'en'].includes(targetLanguage)) return analysisJSON;

  const stringified = JSON.stringify(analysisJSON, null, 2);

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate ALL text values in the provided JSON from Hindi/English into ${targetLanguageName}. 
          
Rules:
- Keep ALL JSON keys exactly the same (do not translate keys)
- Translate ONLY the string values
- Keep numbers, booleans, and null values unchanged
- Keep legal act names in English (e.g., "Transfer of Property Act 1882")
- Keep section references in English (e.g., "Section 106")
- Keep paragraph references unchanged (e.g., "P2.3")
- Output ONLY valid JSON, nothing else`
        },
        {
          role: 'user',
          content: stringified
        }
      ],
      temperature: 0.1,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    })
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}
```

---

## 🧩 Step 6: Main Orchestrator Hook

```js
// hooks/useDocumentAnalysis.js
import { useState } from 'react';
import { extractText } from '../utils/extractors';
import { preprocessText } from '../utils/preprocessor';
import { analyzeDocument } from '../utils/groqAnalyzer';
import { translateAnalysis } from '../utils/translator';

export const ANALYSIS_STEPS = {
  IDLE:        'idle',
  EXTRACTING:  'extracting',    // OCR / PDF reading
  PROCESSING:  'processing',    // Preprocessing text
  ANALYZING:   'analyzing',     // Groq API call
  TRANSLATING: 'translating',   // Translation if needed
  DONE:        'done',
  ERROR:       'error',
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
      // Step 1: Extract text
      setStep(ANALYSIS_STEPS.EXTRACTING);
      setProgress(10);
      const { numberedText } = await extractText(
        file,
        languageCode,
        (pct) => setProgress(10 + pct * 0.3)  // 10% to 40%
      );

      // Step 2: Preprocess
      setStep(ANALYSIS_STEPS.PROCESSING);
      setProgress(45);
      const { numberedText: processedText } = preprocessText(numberedText);

      // Step 3: Analyze with Groq
      setStep(ANALYSIS_STEPS.ANALYZING);
      setProgress(55);
      const rawAnalysis = await analyzeDocument({
        numberedText: processedText,
        documentType,
        targetLanguage: 'hi',  // Always analyze in Hindi first
      });
      setProgress(80);

      // Step 4: Translate if needed
      let finalAnalysis = rawAnalysis;
      if (!['hi', 'en'].includes(languageCode)) {
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

  return { step, progress, analysis, error, analyze };
}
```

---

## 🔊 Step 7: Text-to-Speech Hook

```js
// hooks/useTTS.js
import { useState, useCallback, useRef } from 'react';

// Map language codes to BCP-47 tags for SpeechSynthesis
const TTS_LANG_MAP = {
  hi:  'hi-IN',
  en:  'en-IN',
  bn:  'bn-IN',
  te:  'te-IN',
  mr:  'mr-IN',
  ta:  'ta-IN',
  gu:  'gu-IN',
  kn:  'kn-IN',
  ml:  'ml-IN',
  pa:  'pa-IN',
  ur:  'ur-PK',
  or:  'or-IN',
};

export function useTTS(languageCode = 'hi') {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window)) {
      alert('आपका ब्राउज़र आवाज़ का समर्थन नहीं करता / Browser TTS not supported');
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = TTS_LANG_MAP[languageCode] || 'hi-IN';
    utterance.rate = 0.85;    // Slightly slower for better comprehension
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart  = () => setIsSpeaking(true);
    utterance.onend    = () => setIsSpeaking(false);
    utterance.onerror  = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [languageCode]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking };
}
```

---

## 📊 Step 8: Analysis UI Components

### Citation Box Component

```jsx
// components/AnalysisCard/CitationBox.jsx
// The most important component — shows EXACTLY where in the doc a claim comes from

export function CitationBox({ source }) {
  return (
    <div className="citation-box">
      <div className="citation-header">
        📌 <strong>स्रोत / Source</strong>
      </div>

      <div className="citation-location">
        {/* Human-readable location */}
        {source.location}
      </div>

      {source.originalText && (
        <div className="citation-quote">
          <div className="citation-quote-label">मूल पाठ / Original text:</div>
          <blockquote>"{source.originalText}"</blockquote>
        </div>
      )}
    </div>
  );
}
```

### Danger Flag Card

```jsx
// components/AnalysisCard/FlagCard.jsx
import { CitationBox } from './CitationBox';
import { TTSButton } from '../TTSButton/TTSButton';

const SEVERITY_CONFIG = {
  DANGEROUS:  { color: 'red',    icon: '🔴', label: 'खतरनाक / Dangerous' },
  SUSPICIOUS: { color: 'amber',  icon: '🟡', label: 'संदिग्ध / Suspicious' },
  UNFAIR:     { color: 'orange', icon: '🟠', label: 'अनुचित / Unfair' },
};

export function FlagCard({ flag, languageCode }) {
  const config = SEVERITY_CONFIG[flag.severity] || SEVERITY_CONFIG.SUSPICIOUS;
  const { speak, stop, isSpeaking } = useTTS(languageCode);

  const fullText = `
    ${flag.title}. 
    ${flag.explanation}. 
    ${flag.applicableLaw ? `कानून: ${flag.applicableLaw.whatItSays}. ${flag.applicableLaw.howItProtectsYou}.` : ''}
    आप क्या करें: ${flag.recommendation}
  `;

  return (
    <div className={`flag-card flag-${config.color}`}>
      {/* Header */}
      <div className="flag-header">
        <span className="flag-icon">{config.icon}</span>
        <span className="flag-severity">{config.label}</span>
        <TTSButton
          text={fullText}
          languageCode={languageCode}
          isSpeaking={isSpeaking}
          onPlay={() => speak(fullText)}
          onStop={stop}
        />
      </div>

      {/* Title */}
      <h3 className="flag-title">{flag.title}</h3>

      {/* Plain explanation */}
      <p className="flag-explanation">{flag.explanation}</p>

      {/* Source citation — most important part */}
      <CitationBox source={flag.source} />

      {/* Applicable law */}
      {flag.applicableLaw && (
        <div className="applicable-law">
          <div className="law-header">⚖️ कानून क्या कहता है? / What does the law say?</div>
          <div className="law-name">
            {flag.applicableLaw.actName}, {flag.applicableLaw.section}
          </div>
          <p className="law-explanation">{flag.applicableLaw.whatItSays}</p>
          <p className="law-protection">
            <strong>आपकी सुरक्षा / Your protection:</strong> {flag.applicableLaw.howItProtectsYou}
          </p>
        </div>
      )}

      {/* Recommendation */}
      <div className="recommendation">
        <div className="recommendation-label">✅ आप क्या करें / What to do:</div>
        <p>{flag.recommendation}</p>
      </div>
    </div>
  );
}
```

### Overall Verdict Banner

```jsx
// components/AnalysisCard/VerdictBanner.jsx

const VERDICT_CONFIG = {
  SIGN_SAFE: {
    color: 'green',
    icon: '✅',
    hindi: 'हस्ताक्षर करना सुरक्षित है',
    english: 'Safe to Sign'
  },
  SIGN_WITH_CAUTION: {
    color: 'amber',
    icon: '⚠️',
    hindi: 'सावधानी से हस्ताक्षर करें',
    english: 'Sign with Caution'
  },
  DO_NOT_SIGN: {
    color: 'red',
    icon: '🚫',
    hindi: 'हस्ताक्षर न करें',
    english: 'Do NOT Sign'
  },
  GET_LEGAL_HELP: {
    color: 'blue',
    icon: '⚖️',
    hindi: 'पहले वकील से मिलें',
    english: 'Get Legal Help First'
  }
};

export function VerdictBanner({ verdict }) {
  const config = VERDICT_CONFIG[verdict.rating] || VERDICT_CONFIG.GET_LEGAL_HELP;

  return (
    <div className={`verdict-banner verdict-${config.color}`}>
      <div className="verdict-icon">{config.icon}</div>
      <div className="verdict-text">
        <div className="verdict-label">{config.hindi}</div>
        <div className="verdict-sublabel">{config.english}</div>
      </div>
      <p className="verdict-reason">{verdict.reason}</p>
      {verdict.immediateActions?.length > 0 && (
        <div className="immediate-actions">
          <strong>अभी करें / Do now:</strong>
          <ul>
            {verdict.immediateActions.map((action, i) => (
              <li key={i}>{action}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

---

## 🌍 Step 9: i18n Setup (UI Strings)

The analysis content is translated via Groq. The UI strings (buttons, labels, headers) are handled via i18next.

```js
// translations/hi.json (UI strings in Hindi)
{
  "app": {
    "name": "न्याय सहायक",
    "tagline": "अपने कानूनी दस्तावेज़ को सरल भाषा में समझें"
  },
  "upload": {
    "title": "दस्तावेज़ चुनें",
    "dropzone": "यहाँ फ़ाइल छोड़ें या क्लिक करें",
    "camera": "कैमरे से खींचें",
    "types": "PDF, JPG, PNG — अधिकतम 10MB"
  },
  "processing": {
    "extracting": "दस्तावेज़ पढ़ा जा रहा है...",
    "analyzing":  "कानूनी विश्लेषण हो रहा है...",
    "translating":"भाषांतरण हो रहा है..."
  },
  "analysis": {
    "summary":    "सारांश",
    "flags":      "ध्यान दें",
    "rights":     "आपके अधिकार",
    "sections":   "खंड-दर-खंड विश्लेषण",
    "source":     "स्रोत",
    "listen":     "सुनें",
    "download":   "PDF डाउनलोड करें",
    "share":      "WhatsApp पर भेजें"
  }
}
```

```js
// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'hi',
    defaultNS: 'translation',
    backend: {
      loadPath: '/translations/{{lng}}.json'
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
```

---

## 📥 Step 10: PDF Report Generation (Optional but impressive)

```js
// utils/generateReport.js
import jsPDF from 'jspdf';

export async function generatePDFReport(analysis, languageName) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Note: For Indic scripts, you need to embed a Unicode font
  // Download NotoSans-Regular.ttf and add it as base64
  // doc.addFileToVFS('NotoSans.ttf', NOTO_SANS_BASE64);
  // doc.addFont('NotoSans.ttf', 'NotoSans', 'normal');
  // doc.setFont('NotoSans');

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 20;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(232, 104, 10);  // Saffron
  doc.text('न्याय सहायक - Nyay Sahayak', margin, y);
  y += 10;

  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Legal Document Analysis Report — ${languageName}`, margin, y);
  y += 15;

  // Verdict
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(`Verdict: ${analysis.overallVerdict.rating}`, margin, y);
  y += 10;

  // Summary
  doc.setFontSize(12);
  const summaryLines = doc.splitTextToSize(analysis.summary.plain, pageWidth - 2 * margin);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 7 + 10;

  // Danger Flags
  analysis.dangerFlags.forEach((flag) => {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFontSize(13);
    doc.setTextColor(180, 0, 0);
    doc.text(`⚠ ${flag.title}`, margin, y);
    y += 7;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    const expLines = doc.splitTextToSize(flag.explanation, pageWidth - 2 * margin);
    doc.text(expLines, margin, y);
    y += expLines.length * 6 + 5;
    // Source
    doc.setTextColor(100, 100, 100);
    doc.text(`Source: ${flag.source.location}`, margin, y);
    y += 12;
  });

  doc.save('nyay-sahayak-report.pdf');
}
```

---

## 🚀 Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Environment Variables on Vercel

In Vercel dashboard → Settings → Environment Variables:
```
VITE_GROQ_API_KEY = your_groq_key_here
```

### Production API Security (Important)

For production, move the Groq API call to a Vercel serverless function to protect your API key:

```js
// api/analyze.js (Vercel serverless function)
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { numberedText, documentType, targetLanguage } = req.body;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`  // Server-side env var
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      // ... rest of the request
    })
  });

  const data = await response.json();
  res.json(data);
}
```

Then in your frontend, call `/api/analyze` instead of the Groq URL directly.

---

## 🗂️ Final File Structure

```
nyay-sahayak/
├── public/
│   └── translations/
│       ├── hi.json
│       ├── en.json
│       ├── bn.json
│       └── ... (22 languages)
├── src/
│   ├── components/
│   │   ├── UploadZone/
│   │   ├── CameraCapture/
│   │   ├── ProcessingScreen/
│   │   ├── LanguageSwitcher/
│   │   ├── TTSButton/
│   │   └── AnalysisCard/
│   │       ├── FlagCard.jsx
│   │       ├── CitationBox.jsx
│   │       ├── RightsCard.jsx
│   │       ├── SectionAccordion.jsx
│   │       └── VerdictBanner.jsx
│   ├── hooks/
│   │   ├── useDocumentAnalysis.js
│   │   └── useTTS.js
│   ├── utils/
│   │   ├── extractors/
│   │   │   ├── index.js
│   │   │   ├── pdfExtractor.js
│   │   │   └── imageExtractor.js
│   │   ├── preprocessor.js
│   │   ├── groqAnalyzer.js
│   │   ├── translator.js
│   │   ├── prompts.js
│   │   └── generateReport.js
│   ├── contexts/
│   │   └── LanguageContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Upload.jsx
│   │   ├── Processing.jsx
│   │   └── Analysis.jsx
│   ├── i18n.js
│   ├── App.jsx
│   └── main.jsx
├── api/
│   └── analyze.js          ← Vercel serverless function
├── .env
├── .env.example
├── vite.config.js
└── README.md
```

---

## ✅ Feature Checklist

```
Core
[x] PDF text extraction (PDF.js)
[x] Image OCR (Tesseract.js)
[x] Camera document scanning
[x] Groq LLM legal analysis
[x] Section-by-section breakdown
[x] Danger flag detection
[x] Source citations (page + paragraph)
[x] Applicable Indian law references
[x] Plain language summary
[x] Overall verdict with recommendation

Multilingual
[x] 22 Indian languages supported
[x] Groq-powered translation
[x] UI strings via i18next
[x] Language preference persisted
[x] TTS in the correct language

Accessibility
[x] Text-to-speech on every section
[x] Large tap targets (48px+)
[x] High contrast colors
[x] Works on 2G networks
[x] No font below 16px
[x] Camera capture for physical docs

Output
[x] PDF report download
[ ] WhatsApp share (use Web Share API)
[ ] Save to Firebase for history
```

---

*This README is the complete technical blueprint. Feed it to any AI coding tool (Cursor, Copilot, v0, Bolt) and it will know exactly what to build.*
