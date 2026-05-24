import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { TTSButton } from '../TTSButton/TTSButton';

export function SectionAccordion({ sections, languageCode }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!sections || sections.length === 0) return null;

  return (
    <div>
      {sections.map((section, i) => (
        <div key={i} className="accordion-item">
          <button
            className={`accordion-header ${openIndex === i ? 'open' : ''}`}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            aria-expanded={openIndex === i}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
              <span style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: section.isFair ? '#16A34A' : '#DC2626',
                flexShrink: 0
              }} />
              <span>{section.sectionTitle}</span>
              {!section.isFair && (
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-danger)', fontWeight: 700 }}>⚠</span>
              )}
            </div>
            <ChevronDown size={18} className="chevron" />
          </button>

          {openIndex === i && (
            <div className="accordion-body">
              <p style={{ marginBottom: '12px', color: 'var(--color-text-secondary)' }}>
                {section.plainExplanation}
              </p>

              {section.originalText && (
                <div className="citation-card" style={{ marginBottom: '12px' }}>
                  <div className="source-label">📌 मूल पाठ / Original Text</div>
                  <blockquote style={{ margin: 0, fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>
                    "{section.originalText}"
                  </blockquote>
                  {section.paragraph && (
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                      Page {section.page}, {section.paragraph}
                    </div>
                  )}
                </div>
              )}

              {section.concern && (
                <div style={{
                  padding: '10px 14px',
                  background: '#FEF2F2',
                  borderRadius: '8px',
                  borderLeft: '3px solid #DC2626',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-danger)',
                  marginBottom: '12px'
                }}>
                  ⚠ {section.concern}
                </div>
              )}

              <TTSButton
                text={`${section.sectionTitle}. ${section.plainExplanation}. ${section.concern || ''}`}
                languageCode={languageCode}
                small
                label="🔊 सुनें"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
