# 🎨 AI Legal Aid — UI & Design README

> Designed for rural India. Built for people who've never used a legal service in their life.

---

## 🧭 Design Philosophy

This app serves **illiterate and semi-literate rural Indians** dealing with sensitive legal documents. Every design decision must pass this test:

> *"Can a 55-year-old farmer in Bihar who has never used a smartphone confidently use this?"*

### Core Principles

| Principle | What it means in practice |
|---|---|
| **Clarity over cleverness** | No jargon, no metaphors, no icons without labels |
| **Trust-first** | Looks official, calm, and government-adjacent — not flashy |
| **Language is the product** | Language switcher is always visible, always prominent |
| **Audio as a first-class feature** | Every analysis result must be speakable aloud |
| **Low-data friendly** | No heavy animations, optimized images, works on 2G |
| **High contrast, large text** | Accessibility is non-negotiable |

---

## 🎨 Visual Identity

### Color Palette

```css
:root {
  /* Primary — Deep Saffron (trust, India, warmth) */
  --color-primary:        #E8680A;
  --color-primary-dark:   #B84E00;
  --color-primary-light:  #FFF0E0;

  /* Secondary — Ashoka Blue (government, authority, calm) */
  --color-secondary:      #1A3A6B;
  --color-secondary-light:#E8EEF8;

  /* Neutral */
  --color-bg:             #FAFAF7;        /* Warm white, not clinical */
  --color-surface:        #FFFFFF;
  --color-border:         #E2DDD6;
  --color-text-primary:   #1C1917;
  --color-text-secondary: #57534E;
  --color-text-muted:     #A8A29E;

  /* Semantic */
  --color-success:        #166534;
  --color-warning:        #92400E;
  --color-danger:         #991B1B;
  --color-info:           #1E40AF;

  /* Source Citation Highlight */
  --color-cite-bg:        #FEF9C3;        /* Soft yellow — like a highlighter */
  --color-cite-border:    #CA8A04;
  --color-cite-text:      #713F12;
}
```

### Typography

```css
/* Use Google Fonts — load only what you need */
@import url('https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi&family=Noto+Sans:wght@400;600;700&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap');

:root {
  /* Display / Headings — feels official like a government document */
  --font-display: 'Tiro Devanagari Hindi', serif;

  /* Body — clean, readable across all Indian scripts */
  --font-body: 'Noto Sans', 'Noto Sans Devanagari', sans-serif;

  /* Scale — large defaults for low-vision users */
  --text-xs:   0.75rem;   /* 12px */
  --text-sm:   0.875rem;  /* 14px */
  --text-base: 1.0625rem; /* 17px — slightly larger than standard */
  --text-lg:   1.25rem;   /* 20px */
  --text-xl:   1.5rem;    /* 24px */
  --text-2xl:  1.875rem;  /* 30px */
  --text-3xl:  2.25rem;   /* 36px */

  /* Line height — generous for readability */
  --leading-body: 1.75;
  --leading-heading: 1.3;
}
```

> **Why Noto Sans?** Google's Noto family covers ALL 22 scheduled Indian languages with a consistent look. It's the only font family that truly supports Tamil, Telugu, Bengali, Odia, Gujarati, and more — all in one import.

---

## 🗂️ App Structure & Screens

### Screen Map

```
┌─────────────────────────────────────────────┐
│              LANDING / HOME                  │
│   Logo + Tagline + Language Picker           │
│   "Upload Document" CTA                      │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────▼──────────┐
        │   UPLOAD SCREEN      │
        │  Drag/Drop or Camera │
        │  File type guide     │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │  PROCESSING SCREEN   │
        │  Animated progress   │
        │  "Reading document"  │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │   ANALYSIS SCREEN    │  ← Core screen
        │  Summary Card        │
        │  Section-by-Section  │
        │  Danger Flags        │
        │  Your Rights         │
        │  Sources Panel       │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │   SHARE / SAVE       │
        │  Download PDF report │
        │  WhatsApp share      │
        └─────────────────────┘
```

---

## 📐 Screen-by-Screen Design Spec

---

### 1. 🏠 Landing / Home Screen

**Purpose:** Build trust instantly. Rural users are skeptical of apps — make it feel safe and official.

**Layout:**
```
┌─────────────────────────────────┐
│  [🇮🇳 Logo]  Nyay Sahayak        │  ← App name in Hindi + English
│  न्याय सहायक                     │
├─────────────────────────────────┤
│                                 │
│   आपके कानूनी दस्तावेज़ को       │  ← Tagline in selected language
│   सरल भाषा में समझें             │
│   "Understand your legal        │
│    documents in simple words"   │
│                                 │
├─────────────────────────────────┤
│  🌐 [Hindi ▾] ← ALWAYS VISIBLE  │  ← Language switcher — top priority
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐  │
│  │   📄 दस्तावेज़ अपलोड करें   │  │  ← Primary CTA button
│  │   Upload Your Document    │  │     Large, saffron colored
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │   📷 कैमरे से स्कैन करें   │  │  ← Secondary CTA
│  │   Scan with Camera        │  │     For those with physical docs
│  └───────────────────────────┘  │
│                                 │
├─────────────────────────────────┤
│  🔒 आपके दस्तावेज़ सुरक्षित हैं  │  ← Trust badge
│  Your documents are private     │
│  and never stored               │
├─────────────────────────────────┤
│  यह ऐप किसके लिए है?            │  ← "Who is this for?" section
│  किराया अनुबंध | ज़मीन के कागज़   │
│  Rent | Land | Employment       │
│  Loan | Court Notices           │
└─────────────────────────────────┘
```

**Design details:**
- Background: Subtle geometric pattern inspired by Indian textile motifs (SVG, very light)
- Logo: Scales of justice + open book icon, saffron colored
- Trust badge: Use a lock icon + green color — critical for rural trust
- Document type chips at bottom are tappable and filter upload behavior

---

### 2. 📤 Upload Screen

**Purpose:** Make uploading dead simple — support multiple input methods.

**Layout:**
```
┌─────────────────────────────────┐
│  ← Back    दस्तावेज़ चुनें       │
│            Choose Document      │
├─────────────────────────────────┤
│                                 │
│  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  │
│  │                           │  │
│  │   📄                      │  │  ← Dashed upload zone
│  │   यहाँ फ़ाइल छोड़ें         │  │
│  │   Drop file here          │  │
│  │                           │  │
│  │   या / OR                 │  │
│  │                           │  │
│  │  [फ़ाइल चुनें / Browse]    │  │
│  └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘  │
│                                 │
│  ───────── या / OR ─────────    │
│                                 │
│  [📷 कैमरे से खींचें]           │
│  [Take Photo with Camera]       │
│                                 │
├─────────────────────────────────┤
│  ✅ PDF, JPG, PNG supported     │
│  ✅ Max size: 10MB              │
│  ✅ Handwritten docs work too   │
├─────────────────────────────────┤
│  📋 दस्तावेज़ का प्रकार चुनें    │  ← Document type selector
│  Select document type:          │
│                                 │
│  [किराया] [ज़मीन] [नौकरी]        │
│  [Rent]   [Land] [Job]          │
│  [कर्ज़]  [कोर्ट नोटिस] [अन्य]   │
│  [Loan]  [Court] [Other]        │
└─────────────────────────────────┘
```

**Design details:**
- Document type chips: Rounded pill buttons, saffron outline, fill on select
- Camera button is equally prominent as file upload — many rural users will photograph physical docs
- Show file preview thumbnail once uploaded before processing

---

### 3. ⏳ Processing Screen

**Purpose:** Reassure the user something is happening. Rural users are anxious about tech — radio silence = distrust.

**Layout:**
```
┌─────────────────────────────────┐
│                                 │
│         🔍                      │
│                                 │
│   आपका दस्तावेज़ पढ़ा जा रहा है  │
│   Reading your document...      │
│                                 │
│   ████████████░░░░░  65%        │  ← Progress bar, saffron
│                                 │
│   ✅ दस्तावेज़ मिला              │
│   ✅ OCR Processing...          │
│   ⏳ कानूनी विश्लेषण हो रहा है  │
│      Legal analysis in progress │
│   ○  रिपोर्ट तैयार हो रही है    │
│      Preparing your report      │
│                                 │
├─────────────────────────────────┤
│  💡 क्या आप जानते हैं?           │  ← Rotating tip while waiting
│   Did you know?                 │
│   "किराया अनुबंध में हमेशा       │
│    नोटिस अवधि देखें"            │
│   "Always check notice period   │
│    in a rent agreement"         │
└─────────────────────────────────┘
```

**Design details:**
- Step-by-step checklist updates in real time via streaming
- Rotating legal tips appear every 4 seconds — educational while waiting
- Never show a blank spinner — always show progress text

---

### 4. 📊 Analysis Screen ← MOST IMPORTANT

**Purpose:** This is the product. Must be clear, trustworthy, and scannable even for low-literacy users.

**Layout:**
```
┌─────────────────────────────────────────────┐
│  ← Back   विश्लेषण / Analysis    🔊 सुनें  │
│                                   [Listen]  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  📄 किराया अनुबंध                   │   │  ← Document type tag
│  │  Rent Agreement                     │   │
│  │  पृष्ठ: 3 | दिनांक: 15 Jan 2024    │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ══════════════════════════════════════     │
│  📝 सारांश / Summary                        │  ← Plain language summary
│  ══════════════════════════════════════     │
│                                             │
│  यह एक किराया अनुबंध है जो दिल्ली में       │
│  एक कमरे के लिए है। किराया ₹5,000           │
│  प्रति माह है। अनुबंध 11 महीने का है।       │
│                                             │
│  [🔊 सारांश सुनें / Listen to Summary]      │  ← TTS button per section
│                                             │
│  ══════════════════════════════════════     │
│  ⚠️ ध्यान दें / Important Flags             │
│  ══════════════════════════════════════     │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 🔴 खतरनाक क्लॉज़ / Dangerous Clause │   │
│  │                                     │   │
│  │ "मकान मालिक बिना सूचना के किसी भी   │   │
│  │  समय कमरा खाली करा सकता है"         │   │
│  │                                     │   │
│  │ ┌───────────────────────────────┐   │   │
│  │ │ 📌 स्रोत / Source             │   │   │
│  │ │ पृष्ठ 2, अनुच्छेद 4, लाइन 3  │   │   │  ← SOURCE CITATION
│  │ │ Page 2, Clause 4, Line 3:     │   │   │
│  │ │ "...landlord reserves right   │   │   │
│  │ │  to vacate premises at any    │   │   │
│  │ │  time without notice..."      │   │   │
│  │ └───────────────────────────────┘   │   │
│  │                                     │   │
│  │ ⚖️ कानून क्या कहता है?              │   │
│  │ Transfer of Property Act 1882,      │   │
│  │ Section 106 के अनुसार, मकान मालिक   │   │
│  │ को कम से कम 15 दिन का नोटिस देना   │   │
│  │ होगा।                               │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 🟡 संदिग्ध क्लॉज़ / Suspicious       │   │
│  │ ... (same structure)                │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ══════════════════════════════════════     │
│  ✅ आपके अधिकार / Your Rights               │
│  ══════════════════════════════════════     │
│                                             │
│  ✅ आपको हमेशा रसीद मांगने का              │
│     अधिकार है                              │
│  ✅ बिना नोटिस के निकाला नहीं जा सकता      │
│  ✅ जमानत राशि वापस मिलनी चाहिए            │
│                                             │
│  ══════════════════════════════════════     │
│  📖 खंड-दर-खंड विश्लेषण                    │
│     Section-by-Section Breakdown            │
│  ══════════════════════════════════════     │
│                                             │
│  [खंड 1: पार्टियाँ / Clause 1: Parties] ▾  │  ← Collapsible accordions
│  [खंड 2: किराया / Clause 2: Rent]      ▾  │
│  [खंड 3: अवधि / Clause 3: Duration]    ▾  │
│  ...                                        │
│                                             │
├─────────────────────────────────────────────┤
│  [📥 PDF डाउनलोड करें]  [📲 WhatsApp करें] │
└─────────────────────────────────────────────┘
```

**Design details for Citation Cards:**
```css
.citation-card {
  background: var(--color-cite-bg);       /* Soft yellow */
  border-left: 4px solid var(--color-cite-border);
  border-radius: 0 8px 8px 0;
  padding: 12px 16px;
  margin-top: 10px;
  font-size: var(--text-sm);
}

.citation-card .source-label {
  font-weight: 700;
  color: var(--color-cite-text);
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.citation-card .original-text {
  font-style: italic;
  color: var(--color-text-secondary);
  border-left: 2px solid var(--color-cite-border);
  padding-left: 10px;
  margin-top: 8px;
}
```

**Danger flag color system:**
```css
.flag-dangerous  { border-color: #DC2626; background: #FEF2F2; }
.flag-suspicious { border-color: #D97706; background: #FFFBEB; }
.flag-info       { border-color: #2563EB; background: #EFF6FF; }
.flag-good       { border-color: #16A34A; background: #F0FDF4; }
```

---

### 5. 🌐 Language Switcher Component

This is the most critical UI component of the whole app.

**Design:**
```
┌─────────────────────────────────────────────┐
│  🌐 भाषा चुनें / Select Language            │
├─────────────────────────────────────────────┤
│  [हिंदी]  [English] [தமிழ்] [বাংলা]        │
│  [తెలుగు] [मराठी]  [ਪੰਜਾਬੀ] [ગુજરાતી]      │
│  [ಕನ್ನಡ]  [മലയാളം] [ଓଡ଼ିଆ]  [অসমীয়া]      │
│  [संस्कृत][اردو]   [Kashmiri][Sindhi]       │
└─────────────────────────────────────────────┘
```

**Behavior rules:**
- Selected language persists in `localStorage` across sessions
- Switching language re-renders ALL content immediately — no page reload
- Language names always shown in their OWN script (not translated to English)
- Default language auto-detected from browser locale
- The language switcher is a sticky element — visible from every screen at the top

**All 22 scheduled languages to support:**

```js
const INDIAN_LANGUAGES = [
  { code: 'hi',  name: 'हिंदी',       english: 'Hindi' },
  { code: 'en',  name: 'English',     english: 'English' },
  { code: 'bn',  name: 'বাংলা',       english: 'Bengali' },
  { code: 'te',  name: 'తెలుగు',      english: 'Telugu' },
  { code: 'mr',  name: 'मराठी',       english: 'Marathi' },
  { code: 'ta',  name: 'தமிழ்',       english: 'Tamil' },
  { code: 'ur',  name: 'اردو',        english: 'Urdu' },
  { code: 'gu',  name: 'ગુજરાતી',     english: 'Gujarati' },
  { code: 'kn',  name: 'ಕನ್ನಡ',       english: 'Kannada' },
  { code: 'ml',  name: 'മലയാളം',      english: 'Malayalam' },
  { code: 'pa',  name: 'ਪੰਜਾਬੀ',      english: 'Punjabi' },
  { code: 'or',  name: 'ଓଡ଼ିଆ',        english: 'Odia' },
  { code: 'as',  name: 'অসমীয়া',     english: 'Assamese' },
  { code: 'mai', name: 'मैथिली',      english: 'Maithili' },
  { code: 'sat', name: 'ᱥᱟᱱᱛᱟᱲᱤ',    english: 'Santali' },
  { code: 'ks',  name: 'کٲشُر',      english: 'Kashmiri' },
  { code: 'ne',  name: 'नेपाली',      english: 'Nepali' },
  { code: 'sd',  name: 'سنڌي',       english: 'Sindhi' },
  { code: 'kok', name: 'कोंकणी',      english: 'Konkani' },
  { code: 'doi', name: 'डोगरी',       english: 'Dogri' },
  { code: 'mni', name: 'মৈতৈলোন্',   english: 'Manipuri' },
  { code: 'sa',  name: 'संस्कृतम्',   english: 'Sanskrit' },
  { code: 'bo',  name: 'བོད་སྐད།',    english: 'Bodo' },
];
```

---

### 6. 🔊 Text-to-Speech (TTS) Button

Since many users are illiterate, TTS is a core feature — not an afterthought.

**Design:**
```css
.tts-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--color-secondary);
  color: white;
  border: none;
  border-radius: 999px;
  padding: 10px 20px;
  font-size: var(--text-base);
  cursor: pointer;
  margin-top: 12px;
}

.tts-button.playing {
  background: var(--color-primary);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.7; }
}
```

**Implementation:**
- Use the browser's built-in `SpeechSynthesis` API — no external cost
- Detect language and set `utterance.lang` accordingly (e.g. `hi-IN`, `ta-IN`)
- Every analysis section has its own TTS button
- A global "सब कुछ सुनें / Listen to everything" button reads the full report

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile first — rural users are almost exclusively on phones */
/* Base styles = mobile */

@media (min-width: 640px)  { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
```

### Mobile-specific rules:
- Minimum tap target: **48×48px** (accessibility standard)
- Font size never below **16px** to prevent iOS auto-zoom
- Bottom navigation bar on mobile (Home, Upload, History, Help)
- Pull-to-refresh gesture on analysis screen
- Swipe left/right to navigate between sections

---

## ♿ Accessibility Requirements

```
✅ WCAG AA contrast ratio minimum (4.5:1 for text)
✅ All images have alt text in the current language
✅ All interactive elements keyboard navigable
✅ Screen reader compatible (ARIA labels in current language)
✅ Focus indicators clearly visible
✅ Error messages in plain language, never technical
✅ No color as the only indicator of meaning (always use icon + text)
✅ TTS available on every text block
✅ Font size adjustable (+A / -A buttons in header)
```

---

## 🧩 Component Library

### Button Variants

```css
/* Primary CTA */
.btn-primary {
  background: var(--color-primary);
  color: white;
  padding: 14px 28px;
  border-radius: 10px;
  font-size: var(--text-lg);
  font-weight: 700;
  width: 100%;                    /* Full width on mobile */
  min-height: 54px;
}

/* Secondary */
.btn-secondary {
  background: transparent;
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
  /* same sizing */
}

/* Danger */
.btn-danger {
  background: var(--color-danger);
  color: white;
}

/* Ghost / Text */
.btn-ghost {
  background: transparent;
  color: var(--color-text-secondary);
  text-decoration: underline;
}
```

### Alert / Flag Cards

```
🔴 Dangerous Clause Card  → Red left border + red header
🟡 Suspicious Clause Card → Yellow/amber left border
🟢 Safe / Fair Clause     → Green left border
🔵 Informational Note     → Blue left border
📌 Source Citation        → Yellow background (highlighter style)
```

---

## 🖼️ Illustration Style

- Use simple, flat line illustrations (Humaaans-style or LottieFiles free assets)
- Represent Indian people — not Western-default illustrations
- Characters should reflect rural contexts: farmers, women in sarees, older men
- Every empty state has a friendly illustration + helpful message
- No stock photos — illustration only (more trustworthy, less corporate)

---

## 📋 Empty States & Error States

| State | Illustration | Message (Hindi + English) |
|---|---|---|
| No document uploaded | Person holding paper | "अपना दस्तावेज़ यहाँ लाएं / Bring your document here" |
| Processing failed | Confused person | "कुछ गड़बड़ हुई, फिर कोशिश करें / Something went wrong, please try again" |
| Unsupported file | Wrong paper icon | "यह फ़ाइल प्रकार काम नहीं करता / This file type is not supported" |
| No internet | No wifi icon | "इंटरनेट नहीं है / No internet connection" |

---

## 🗃️ File Structure (Frontend)

```
src/
├── components/
│   ├── LanguageSwitcher/
│   │   ├── LanguageSwitcher.jsx
│   │   └── LanguageSwitcher.css
│   ├── UploadZone/
│   ├── AnalysisCard/
│   │   ├── FlagCard.jsx          ← Dangerous / suspicious clause
│   │   ├── CitationBox.jsx       ← Source citation component
│   │   ├── RightsCard.jsx
│   │   └── SectionAccordion.jsx
│   ├── TTSButton/
│   ├── ProcessingScreen/
│   └── shared/
│       ├── Button.jsx
│       ├── Badge.jsx
│       └── Alert.jsx
├── contexts/
│   └── LanguageContext.jsx       ← Global language state
├── hooks/
│   ├── useTTS.js                 ← Text-to-speech hook
│   └── useLanguage.js
├── translations/
│   ├── hi.json                   ← UI strings in Hindi
│   ├── en.json
│   ├── bn.json
│   └── ... (one per language)
├── pages/
│   ├── Home.jsx
│   ├── Upload.jsx
│   ├── Processing.jsx
│   └── Analysis.jsx
└── App.jsx
```

---

## 🚀 Performance Guidelines

- Lazy load language packs — only download the JSON for the selected language
- Use `loading="lazy"` on all images
- Compress all assets — target <100KB initial JS bundle
- Cache analysis results in `sessionStorage` so back button works
- Use `IntersectionObserver` to animate sections as they scroll into view
- Target Lighthouse score: **>90 on mobile**

---

*This document is the single source of truth for all UI decisions. Every screen, component, and interaction should refer back to these guidelines.*
