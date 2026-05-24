import { MapPin } from 'lucide-react';

export function CitationBox({ source }) {
  if (!source) return null;

  return (
    <div className="citation-card">
      <div className="source-label">
        <MapPin size={14} /> <strong>स्रोत / Source</strong>
      </div>
      <div style={{ color: 'var(--color-cite-text)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
        {source.location}
      </div>
      {source.originalText && (
        <div className="original-text">
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '4px' }}>मूल पाठ / Original text:</div>
          <blockquote style={{ margin: 0, fontStyle: 'italic' }}>"{source.originalText}"</blockquote>
        </div>
      )}
    </div>
  );
}
