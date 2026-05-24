import { Shield } from 'lucide-react';
import { TTSButton } from '../TTSButton/TTSButton';

export function RightsCard({ rights, languageCode }) {
  if (!rights || rights.length === 0) return null;

  const allRightsText = rights.map(r => `${r.right}. ${r.source}`).join('. ');

  return (
    <div className="card">
      <div className="card-header">
        <Shield size={22} color="var(--color-success)" /> ✅ आपके अधिकार / Your Rights
        <TTSButton text={allRightsText} languageCode={languageCode} small label="सुनें" />
      </div>
      <ul className="rights-list">
        {rights.map((r, i) => (
          <li key={i} className="rights-item">
            <span className="rights-icon">✅</span>
            <div className="rights-text">
              <div>{r.right}</div>
              <div className="rights-source">{r.source}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
