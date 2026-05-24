import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export function LanguageSwitcher({ compact = false }) {
  const { language, switchLanguage, languages } = useLanguage();
  const { i18n } = useTranslation();

  const handleSwitch = (code) => {
    switchLanguage(code);
    i18n.changeLanguage(code);
  };

  if (compact) {
    return (
      <select
        value={language.code}
        onChange={(e) => handleSwitch(e.target.value)}
        style={{
          padding: '8px 12px',
          borderRadius: '8px',
          border: '2px solid var(--color-border)',
          background: 'var(--color-surface)',
          fontSize: 'var(--text-sm)',
          fontFamily: 'var(--font-body)',
          cursor: 'pointer',
          color: 'var(--color-text-primary)',
        }}
        aria-label="Select language"
      >
        {languages.map(l => (
          <option key={l.code} value={l.code}>{l.name} ({l.english})</option>
        ))}
      </select>
    );
  }

  return (
    <div style={{ padding: '16px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 700, color: 'var(--color-secondary)' }}>
        <Globe size={20} />
        <span>भाषा चुनें / Select Language</span>
      </div>
      <div className="lang-switcher">
        {languages.map(l => (
          <button
            key={l.code}
            className={`lang-pill ${language.code === l.code ? 'active' : ''}`}
            onClick={() => handleSwitch(l.code)}
            aria-label={`Switch to ${l.english}`}
          >
            {l.name}
          </button>
        ))}
      </div>
    </div>
  );
}
