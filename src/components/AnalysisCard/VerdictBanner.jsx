import { TTSButton } from '../TTSButton/TTSButton';

const VERDICT_CONFIG = {
  SIGN_SAFE:         { color: 'green', icon: '✅', hindi: 'हस्ताक्षर करना सुरक्षित है', english: 'Safe to Sign' },
  SIGN_WITH_CAUTION: { color: 'amber', icon: '⚠️', hindi: 'सावधानी से हस्ताक्षर करें', english: 'Sign with Caution' },
  DO_NOT_SIGN:       { color: 'red',   icon: '🚫', hindi: 'हस्ताक्षर न करें', english: 'Do NOT Sign' },
  GET_LEGAL_HELP:    { color: 'blue',  icon: '⚖️', hindi: 'पहले वकील से मिलें', english: 'Get Legal Help First' },
};

export function VerdictBanner({ verdict, languageCode }) {
  if (!verdict) return null;
  const config = VERDICT_CONFIG[verdict.rating] || VERDICT_CONFIG.GET_LEGAL_HELP;

  const fullText = `${config.hindi}. ${verdict.reason}. ${verdict.immediateActions?.length ? 'अभी करें: ' + verdict.immediateActions.join('. ') : ''}`;

  return (
    <div className={`verdict-banner verdict-${config.color}`}>
      <div className="verdict-icon">{config.icon}</div>
      <div className="verdict-label">{config.hindi}</div>
      <div className="verdict-sublabel">{config.english}</div>
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

      <div style={{ marginTop: '16px' }}>
        <TTSButton text={fullText} languageCode={languageCode} label="🔊 सुनें / Listen" />
      </div>
    </div>
  );
}
