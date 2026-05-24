import { useState, useCallback, useRef } from 'react';

const TTS_LANG_MAP = {
  hi: 'hi-IN', en: 'en-IN', bn: 'bn-IN', te: 'te-IN', mr: 'mr-IN', ta: 'ta-IN',
  gu: 'gu-IN', kn: 'kn-IN', ml: 'ml-IN', pa: 'pa-IN', ur: 'ur-PK', or: 'or-IN',
};

export function useTTS(languageCode = 'hi') {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window)) {
      alert('आपका ब्राउज़र आवाज़ का समर्थन नहीं करता / Browser TTS not supported');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = TTS_LANG_MAP[languageCode] || 'hi-IN';
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [languageCode]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking };
}
