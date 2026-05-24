import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';

const LEGAL_TIPS = [
  { hi: 'किराया अनुबंध में हमेशा नोटिस अवधि देखें', en: 'Always check notice period in a rent agreement' },
  { hi: 'किसी भी दस्तावेज़ पर हस्ताक्षर करने से पहले पूरा पढ़ें', en: 'Read the full document before signing anything' },
  { hi: 'जमानत राशि की रसीद हमेशा लें', en: 'Always take a receipt for security deposits' },
  { hi: 'ज़मीन खरीदते समय एनकम्ब्रेंस सर्टिफ़िकेट ज़रूर लें', en: 'Always get encumbrance certificate when buying land' },
  { hi: 'नौकरी के अनुबंध में नोटिस पीरियड और सैलरी ब्रेकडाउन जांचें', en: 'Check notice period and salary breakdown in employment contracts' },
  { hi: 'लोन लेते समय ब्याज दर और प्रोसेसिंग फ़ीस जांचें', en: 'Check interest rate and processing fees when taking loans' },
];

export function ProcessingScreen({ step, progress }) {
  const [tipIndex, setTipIndex] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % LEGAL_TIPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { key: 'extracting', label: t('processing.steps.found'), icon: '✅' },
    { key: 'processing', label: t('processing.steps.ocr'), icon: '🔄' },
    { key: 'analyzing', label: t('processing.steps.analyzing'), sublabel: t('processing.steps.analyzingSub'), icon: '🧠' },
    { key: 'translating', label: t('processing.steps.translating'), sublabel: t('processing.steps.translatingSub'), icon: '🌐' },
    { key: 'done', label: t('processing.steps.report'), sublabel: t('processing.steps.reportSub'), icon: '📋' },
  ];

  const stepOrder = ['extracting', 'processing', 'analyzing', 'translating', 'done'];
  const currentIdx = stepOrder.indexOf(step);

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
      <div style={{ fontSize: '4rem', marginBottom: '16px', animation: 'pulse 2s infinite' }}>
        <Search size={64} color="var(--color-primary)" />
      </div>

      <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: 'var(--text-xl)' }}>
        {t('processing.reading')}
      </h2>
      <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '24px', fontSize: 'var(--text-sm)' }}>
        {t('processing.readingSub')}
      </p>

      <div className="progress-bar-container" style={{ maxWidth: '400px', marginBottom: '32px' }}>
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <div style={{ color: 'var(--color-text-muted)', marginBottom: '24px', fontSize: 'var(--text-sm)' }}>{progress}%</div>

      <div style={{ maxWidth: '400px', width: '100%' }}>
        {steps.map((s, i) => {
          const isDone = currentIdx > i;
          const isActive = stepOrder[currentIdx] === s.key;
          return (
            <div key={s.key} className={`processing-step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
              <span style={{ fontSize: '1.2rem' }}>{isDone ? '✅' : isActive ? '⏳' : '○'}</span>
              <div>
                <div>{s.label}</div>
                {s.sublabel && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{s.sublabel}</div>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ maxWidth: '400px', width: '100%', marginTop: '32px', textAlign: 'center' }}>
        <div style={{ fontWeight: 700, marginBottom: '8px' }}>{t('processing.tip')}</div>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', transition: 'opacity 0.3s' }}>
          "{LEGAL_TIPS[tipIndex].hi}"
        </p>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', marginTop: '4px' }}>
          "{LEGAL_TIPS[tipIndex].en}"
        </p>
      </div>
    </div>
  );
}
