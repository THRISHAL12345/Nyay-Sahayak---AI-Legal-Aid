import { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 10;

export function UploadZone({ onFileReady }) {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const inputRef = useRef(null);
  const { t } = useTranslation();

  const handleFile = (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      alert(t('errors.fileType'));
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(t('errors.fileSize'));
      return;
    }
    setFileName(file.name);
    setFileSize((file.size / 1024 / 1024).toFixed(2) + ' MB');
    if (file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
    onFileReady(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const clearFile = () => {
    setFileName('');
    setFileSize('');
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
    onFileReady(null);
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label={t('upload.dropzone')}
      >
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={handleChange}
          ref={inputRef}
          hidden
        />
        <div className="upload-zone-icon"><Upload size={48} color="var(--color-primary)" /></div>
        <div className="upload-zone-text">
          {t('upload.dropzone')}<br />
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{t('upload.dropzoneSub')}</span>
        </div>
        <div style={{ margin: '16px 0', color: 'var(--color-text-muted)' }}>{t('upload.or')}</div>
        <div className="btn-secondary" style={{ width: 'auto', display: 'inline-flex', padding: '10px 24px', fontSize: 'var(--text-base)', minHeight: 'auto', cursor: 'pointer' }}>
          {t('upload.browse')}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontWeight: 600 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-secondary-light)', padding: '6px 14px', borderRadius: '20px', color: 'var(--color-secondary)' }}>
            ✅ {t('upload.supported')}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-secondary-light)', padding: '6px 14px', borderRadius: '20px', color: 'var(--color-secondary)' }}>
            ✅ {t('upload.handwritten')}
          </span>
        </div>
      </div>

      {fileName && (
        <div className="file-preview">
          <div className="file-preview-icon">
            {preview ? <img src={preview} alt="preview" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} /> : <FileText size={32} color="var(--color-secondary)" />}
          </div>
          <div>
            <div className="file-preview-name">{fileName}</div>
            <div className="file-preview-size">{fileSize}</div>
          </div>
          <button className="file-preview-remove" onClick={(e) => { e.stopPropagation(); clearFile(); }} aria-label="Remove file">
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
