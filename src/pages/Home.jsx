import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher/LanguageSwitcher';
import { FileText, Camera, Shield, Scale, BookOpen, Briefcase, Landmark, AlertTriangle, HelpCircle } from 'lucide-react';

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
