import { CitationBox } from './CitationBox';
import { TTSButton } from '../TTSButton/TTSButton';

const SEVERITY_CONFIG = {
  DANGEROUS:  { color: 'red',    icon: '🔴', label: 'खतरनाक / Dangerous' },
  SUSPICIOUS: { color: 'amber',  icon: '🟡', label: 'संदिग्ध / Suspicious' },
  UNFAIR:     { color: 'orange', icon: '🟠', label: 'अनुचित / Unfair' },
};

export function FlagCard({ flag, languageCode }) {
  const config = SEVERITY_CONFIG[flag.severity] || SEVERITY_CONFIG.SUSPICIOUS;

  const fullText = `${flag.title}. ${flag.explanation}. ${flag.applicableLaw ? `कानून: ${flag.applicableLaw.whatItSays}. ${flag.applicableLaw.howItProtectsYou}.` : ''} आप क्या करें: ${flag.recommendation}`;

  return (
    <div className={`flag-card flag-${config.color}`}>
      <div className="flag-header">
        <span className="flag-icon">{config.icon}</span>
        <span className="flag-severity">{config.label}</span>
        <TTSButton text={fullText} languageCode={languageCode} small />
      </div>

      <h3 className="flag-title">{flag.title}</h3>
      <p className="flag-explanation">{flag.explanation}</p>

      <CitationBox source={flag.source} />

      {flag.applicableLaw && (
        <div className="applicable-law">
          <div className="law-header">⚖️ कानून क्या कहता है? / What does the law say?</div>
          <div className="law-name">{flag.applicableLaw.actName}, {flag.applicableLaw.section}</div>
          <p className="law-explanation">{flag.applicableLaw.whatItSays}</p>
          <p className="law-protection">
            <strong>आपकी सुरक्षा / Your protection:</strong> {flag.applicableLaw.howItProtectsYou}
          </p>
        </div>
      )}

      <div className="recommendation">
        <div className="recommendation-label">✅ आप क्या करें / What to do:</div>
        <p>{flag.recommendation}</p>
      </div>
    </div>
  );
}
