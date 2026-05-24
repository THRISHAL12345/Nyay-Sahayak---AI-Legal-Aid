import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getAnalysisHistory } from '../utils/firebase';
import { LanguageSwitcher } from '../components/LanguageSwitcher/LanguageSwitcher';
import { 
  FileText, 
  Camera, 
  Shield, 
  Scale, 
  BookOpen, 
  Briefcase, 
  Landmark, 
  AlertTriangle, 
  HelpCircle,
  Clock 
} from 'lucide-react';

const DOC_TYPES = [
  { key: 'rent', icon: <Landmark size={18} /> },
  { key: 'land', icon: <BookOpen size={18} /> },
  { key: 'job', icon: <Briefcase size={18} /> },
  { key: 'loan', icon: <Scale size={18} /> },
  { key: 'court', icon: <AlertTriangle size={18} /> },
  { key: 'other', icon: <HelpCircle size={18} /> },
];

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { currentUser } = useAuth();
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setLoadingHistory(true);
      getAnalysisHistory(currentUser.uid)
        .then((h) => setHistory(h))
        .catch((err) => console.error('Failed to load home history:', err))
        .finally(() => setLoadingHistory(false));
    } else {
      setHistory([]);
    }
  }, [currentUser]);

  const loadFromHistory = (item) => {
    sessionStorage.setItem('nyay-analysis', JSON.stringify(item.analysis));
    sessionStorage.setItem('nyay-doctype', item.documentType);
    navigate('/analysis');
  };

  return (
    <div className="hero-bg" style={{ minHeight: '100vh' }}>
      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px' }}>

        {/* Logo + Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '8px' }}>⚖️</div>
          <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-secondary)', marginBottom: '4px' }}>
            {t('app.name')}
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
            {t('app.subtitle')}
          </p>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)', marginTop: '16px', maxWidth: '400px', lineHeight: 'var(--leading-body)' }}>
            {t('app.tagline')}
          </p>
        </div>

        {/* Language Switcher */}
        <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
          <LanguageSwitcher />
        </div>

        {/* CTAs */}
        <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '12px', margin: '24px 0' }}>
          <button className="btn-primary" onClick={() => navigate('/upload')} id="upload-cta">
            <FileText size={22} />
            <div>
              <div>{t('home.uploadBtn')}</div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 400, opacity: 0.8 }}>{t('home.uploadBtnSub')}</div>
            </div>
          </button>

          <button className="btn-secondary" onClick={() => navigate('/upload?camera=true')} id="camera-cta">
            <Camera size={22} />
            <div>
              <div>{t('home.cameraBtn')}</div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 400, opacity: 0.7 }}>{t('home.cameraBtnSub')}</div>
            </div>
          </button>
        </div>

        {/* Past Analyses Dashboard (Visible after login) */}
        {currentUser && (
          <div className="card" style={{ width: '100%', maxWidth: '500px', marginBottom: '24px', border: '1px solid var(--color-border)', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
              <Clock size={18} style={{ color: 'var(--color-primary)' }} />
              <h3 style={{ fontSize: 'var(--text-base)', color: 'var(--color-secondary)', margin: 0, fontWeight: 700 }}>
                आपके पिछले विश्लेषण / Your Past Analyses
              </h3>
            </div>

            {loadingHistory ? (
              <div style={{ textAlign: 'center', padding: '16px', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                इतिहास लोड हो रहा है... / Loading history...
              </div>
            ) : history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '16px', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', fontStyle: 'italic' }}>
                कोई पिछला विश्लेषण नहीं मिला / No past analyses found.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {history.slice(0, 5).map((item) => (
                  <div 
                    key={item.id} 
                    className="history-card-item"
                    onClick={() => loadFromHistory(item)}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ flex: 1, paddingRight: '12px' }}>
                      <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span>📄 {item.documentType.charAt(0).toUpperCase() + item.documentType.slice(1)}</span>
                        <span 
                          style={{
                            fontSize: '9px',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                            background: item.verdict === 'SIGN_SAFE' ? '#F0FDF4' : item.verdict === 'DO_NOT_SIGN' ? '#FEF2F2' : '#FFFBEB',
                            color: item.verdict === 'SIGN_SAFE' ? '#16A34A' : item.verdict === 'DO_NOT_SIGN' ? '#DC2626' : '#D97706'
                          }}
                        >
                          {item.verdict?.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '340px' }}>
                        {new Date(item.createdAt).toLocaleDateString()} • {item.summary}
                      </div>
                    </div>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '14px' }}>→</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Trust Badge */}
        <div className="trust-badge" style={{ maxWidth: '500px', width: '100%' }}>
          <Shield size={20} />
          <div>
            <div>{t('home.trustBadge')}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 400 }}>{t('home.trustBadgeSub')}</div>
          </div>
        </div>

        {/* Document Types */}
        <div style={{ marginTop: '32px', width: '100%', maxWidth: '500px' }}>
          <h3 style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', marginBottom: '16px', textAlign: 'center', fontFamily: 'var(--font-body)' }}>
            {t('home.whoIsThisFor')}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            {DOC_TYPES.map(dt => (
              <button
                key={dt.key}
                className="doc-type-chip"
                onClick={() => navigate(`/upload?type=${dt.key}`)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {dt.icon} {t(`home.docTypes.${dt.key}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '48px', paddingBottom: '32px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
          <p>Powered by AI • Built for Rural India 🇮🇳</p>
          <p style={{ marginTop: '4px' }}>⚠️ यह कानूनी सलाह नहीं है / This is not legal advice</p>
        </div>
      </div>
    </div>
  );
}
