import { useTTS } from '../../hooks/useTTS';
import { Volume2, VolumeX } from 'lucide-react';

export function TTSButton({ text, languageCode, label, small = false }) {
  const { speak, stop, isSpeaking } = useTTS(languageCode);

  const handleClick = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text);
    }
  };

  return (
    <button
      className={`tts-button ${isSpeaking ? 'playing' : ''}`}
      onClick={handleClick}
      aria-label={isSpeaking ? 'Stop speaking' : 'Listen'}
      style={small ? { padding: '6px 14px', fontSize: 'var(--text-xs)' } : {}}
    >
      {isSpeaking ? <VolumeX size={small ? 14 : 18} /> : <Volume2 size={small ? 14 : 18} />}
      {label && <span>{label}</span>}
    </button>
  );
}
