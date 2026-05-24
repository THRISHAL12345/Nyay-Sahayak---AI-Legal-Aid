import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useDocumentAnalysis, ANALYSIS_STEPS } from '../hooks/useDocumentAnalysis';
import { UploadZone } from '../components/UploadZone/UploadZone';
import { CameraCapture } from '../components/CameraCapture/CameraCapture';
import { ProcessingScreen } from '../components/ProcessingScreen/ProcessingScreen';
import { saveAnalysis } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Camera } from 'lucide-react';

const DOC_TYPES = [
  { key: 'rent', hi: 'किराया', en: 'Rent' },
  { key: 'land', hi: 'ज़मीन', en: 'Land' },
  { key: 'job', hi: 'नौकरी', en: 'Job' },
  { key: 'loan', hi: 'कर्ज़', en: 'Loan' },
  { key: 'court', hi: 'कोर्ट नोटिस', en: 'Court' },
  { key: 'other', hi: 'अन्य', en: 'Other' },
];

export default function Upload() {
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { step, progress, analysis, error, analyze } = useDocumentAnalysis();
  const { currentUser } = useAuth();

  useEffect(() => {
    const type = searchParams.get('type');
    if (type) setDocType(type);
    if (searchParams.get('camera') === 'true') setShowCamera(true);
  }, [searchParams]);

  useEffect(() => {
    if (step === ANALYSIS_STEPS.DONE && analysis) {
      saveAnalysis(analysis, docType, language.code, currentUser?.uid);
      sessionStorage.setItem('nyay-analysis', JSON.stringify(analysis));
      sessionStorage.setItem('nyay-doctype', docType);
      navigate('/analysis');
    }
  }, [step, analysis, currentUser]);

  const handleAnalyze = () => {
    if (!file || !docType) return;
    analyze({
      file,
      documentType: docType,
      languageCode: language.code,
      languageName: language.english,
    });
  };

  // Show processing screen while analyzing
  if ([ANALYSIS_STEPS.EXTRACTING, ANALYSIS_STEPS.PROCESSING, ANALYSIS_STEPS.ANALYZING, ANALYSIS_STEPS.TRANSLATING].includes(step)) {
    return <ProcessingScreen step={step} progress={progress} />;
  }

  return (
    <div className="page-container">
      {/* Back Button */}
      <button className="btn-ghost" onClick={() => navigate('/')} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <ArrowLeft size={18} /> {t('upload.back')}
      </button>

      <h2 style={{ marginBottom: '4px' }}>{t('upload.title')}</h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', fontSize: 'var(--text-sm)' }}>{t('upload.titleSub')}</p>

      {/* Upload Zone */}
      <UploadZone onFileReady={setFile} />

      {/* Camera */}
      <div style={{ margin: '20px 0' }}>
        {!showCamera ? (
          <button className="btn-secondary" onClick={() => setShowCamera(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Camera size={20} />
            <span>{t('upload.camera')}</span>
          </button>
        ) : (
          <CameraCapture onCapture={(f) => { if (f) setFile(f); setShowCamera(false); }} />
        )}
      </div>

      {/* Document Type Selector */}
      <div style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: 'var(--text-base)', marginBottom: '4px', fontFamily: 'var(--font-body)' }}>{t('upload.selectType')}</h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', marginBottom: '12px' }}>{t('upload.selectTypeSub')}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {DOC_TYPES.map(dt => (
            <button
              key={dt.key}
              className={`doc-type-chip ${docType === dt.key ? 'selected' : ''}`}
              onClick={() => setDocType(dt.key)}
            >
              {dt.hi} / {dt.en}
            </button>
          ))}
        </div>
      </div>

      {/* Analyze Button */}
      <div style={{ marginTop: '32px' }}>
        <button
          className="btn-primary"
          onClick={handleAnalyze}
          disabled={!file || !docType}
          style={{
            opacity: (!file || !docType) ? 0.5 : 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'auto',
            padding: '12px 28px',
            gap: '2px'
          }}
          id="analyze-btn"
        >
          <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>{t('upload.analyze')}</div>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 400, opacity: 0.8 }}>{t('upload.analyzeSub')}</div>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ marginTop: '16px', padding: '16px', background: '#FEF2F2', borderRadius: '10px', borderLeft: '4px solid #DC2626', color: 'var(--color-danger)' }}>
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
