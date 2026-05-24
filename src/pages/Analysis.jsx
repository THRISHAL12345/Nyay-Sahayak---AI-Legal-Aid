import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { VerdictBanner } from '../components/AnalysisCard/VerdictBanner';
import { FlagCard } from '../components/AnalysisCard/FlagCard';
import { RightsCard } from '../components/AnalysisCard/RightsCard';
import { SectionAccordion } from '../components/AnalysisCard/SectionAccordion';
import { TTSButton } from '../components/TTSButton/TTSButton';
import { generatePDFReport } from '../utils/generateReport';
import { getAnalysisHistory } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Download, FileText, Clock } from 'lucide-react';

export default function Analysis() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { currentUser } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [docType, setDocType] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('nyay-analysis');
    const storedType = sessionStorage.getItem('nyay-doctype');
    if (stored) {
      setAnalysis(JSON.parse(stored));
      setDocType(storedType || '');
    }
  }, []);

  const loadHistory = async () => {
    const h = await getAnalysisHistory(currentUser?.uid);
    setHistory(h);
    setShowHistory(true);
  };

  const loadFromHistory = (item) => {
    setAnalysis(item.analysis);
    setDocType(item.documentType || '');
    setShowHistory(false);
  };

  if (!analysis) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '80px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📄</div>
        <h2>कोई विश्लेषण नहीं / No Analysis</h2>
        <p style={{ color: 'var(--color-text-muted)', margin: '16px 0' }}>
          कृपया पहले एक दस्तावेज़ अपलोड करें / Please upload a document first
        </p>
        <button className="btn-primary" onClick={() => navigate('/upload')} style={{ maxWidth: '300px', margin: '0 auto' }}>
          {t('analysis.newDoc')}
        </button>
        <div style={{ marginTop: '32px' }}>
          <button className="btn-ghost" onClick={loadHistory}>
            <Clock size={16} style={{ marginRight: '6px' }} />
            {t('analysis.history')}
          </button>
        </div>
        {showHistory && (
          <div style={{ marginTop: '16px', textAlign: 'left' }}>
            {history.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>{t('analysis.noHistory')}</p>
            ) : (
              history.map((item, i) => (
                <div key={item.id || i} className="card" style={{ cursor: 'pointer' }} onClick={() => loadFromHistory(item)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{item.documentType} — {item.verdict?.replace(/_/g, ' ')}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                        {item.summary}...
                      </div>
                    </div>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{t('analysis.viewHistory')} →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  const allText = [
    analysis.summary?.plain,
    ...(analysis.dangerFlags?.map(f => `${f.title}. ${f.explanation}`) || []),
    ...(analysis.yourRights?.map(r => r.right) || []),
  ].filter(Boolean).join('. ');

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <button className="btn-ghost" onClick={() => navigate('/')} style={{ padding: '8px 0' }}>
          <ArrowLeft size={18} /> {t('upload.back')}
        </button>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <TTSButton text={allText} languageCode={language.code} label={t('analysis.listenAll')} />
        </div>
      </div>

      {/* Document Type Tag */}
      <div style={{
        display: 'inline-block',
        padding: '8px 16px',
        background: 'var(--color-secondary-light)',
        borderRadius: '8px',
        color: 'var(--color-secondary)',
        fontWeight: 600,
        fontSize: 'var(--text-sm)',
        marginBottom: '20px'
      }}>
        📄 {docType.charAt(0).toUpperCase() + docType.slice(1)} Document
      </div>

      {/* Verdict Banner */}
      <VerdictBanner verdict={analysis.overallVerdict} languageCode={language.code} />

      {/* Summary */}
      <div className="section-divider">{t('analysis.summary')}</div>
      <div className="card">
        <p style={{ fontSize: 'var(--text-lg)', lineHeight: 'var(--leading-body)', marginBottom: '16px' }}>
          {analysis.summary?.plain}
        </p>

        {analysis.summary?.parties?.length > 0 && (
          <div style={{ marginBottom: '8px' }}>
            <strong>{t('analysis.parties')}:</strong> {analysis.summary.parties.join(', ')}
          </div>
        )}
        {analysis.summary?.keyDates?.length > 0 && (
          <div style={{ marginBottom: '8px' }}>
            <strong>{t('analysis.dates')}:</strong> {analysis.summary.keyDates.join(', ')}
          </div>
        )}
        {analysis.summary?.keyAmounts?.length > 0 && (
          <div style={{ marginBottom: '8px' }}>
            <strong>{t('analysis.amounts')}:</strong> {analysis.summary.keyAmounts.join(', ')}
          </div>
        )}

        <TTSButton text={analysis.summary?.plain || ''} languageCode={language.code} label={t('analysis.listen')} small />
      </div>

      {/* Danger Flags */}
      {analysis.dangerFlags?.length > 0 && (
        <>
          <div className="section-divider">{t('analysis.flags')}</div>
          {analysis.dangerFlags.map((flag, i) => (
            <FlagCard key={flag.id || i} flag={flag} languageCode={language.code} />
          ))}
        </>
      )}

      {/* Rights */}
      {analysis.yourRights?.length > 0 && (
        <>
          <div className="section-divider">{t('analysis.rights')}</div>
          <RightsCard rights={analysis.yourRights} languageCode={language.code} />
        </>
      )}

      {/* Section Breakdown */}
      {analysis.sectionBreakdown?.length > 0 && (
        <>
          <div className="section-divider">{t('analysis.sections')}</div>
          <SectionAccordion sections={analysis.sectionBreakdown} languageCode={language.code} />
        </>
      )}

      {/* Actions */}
      <div style={{ marginTop: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          className="btn-primary"
          onClick={() => generatePDFReport({ ...analysis, documentType: docType }, language.english)}
          style={{ flex: 1, minWidth: '200px' }}
          id="download-pdf-btn"
        >
          <Download size={20} /> {t('analysis.download')}
        </button>
        <button
          className="btn-secondary"
          onClick={() => { sessionStorage.removeItem('nyay-analysis'); navigate('/upload'); }}
          style={{ flex: 1, minWidth: '200px' }}
          id="new-doc-btn"
        >
          <FileText size={20} /> {t('analysis.newDoc')}
        </button>
      </div>

      {/* History Link */}
      <div style={{ textAlign: 'center', marginTop: '24px', paddingBottom: '32px' }}>
        <button className="btn-ghost" onClick={loadHistory}>
          <Clock size={16} style={{ marginRight: '6px' }} />
          {t('analysis.history')}
        </button>
        {showHistory && history.length > 0 && (
          <div style={{ marginTop: '16px', textAlign: 'left' }}>
            {history.map((item, i) => (
              <div key={item.id || i} className="card" style={{ cursor: 'pointer', padding: '14px' }} onClick={() => loadFromHistory(item)}>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{item.documentType} — {item.verdict?.replace(/_/g, ' ')}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  {new Date(item.createdAt).toLocaleDateString()} • {item.summary?.slice(0, 60)}...
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div style={{ textAlign: 'center', padding: '16px', color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', borderTop: '1px solid var(--color-border)' }}>
        ⚠️ यह कानूनी सलाह नहीं है। कृपया वकील से भी मिलें।<br />
        This is not legal advice. Please also consult a lawyer.
      </div>
    </div>
  );
}
