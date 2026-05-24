import { useRef, useState, useEffect } from 'react';
import { Camera, CameraOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const { t } = useTranslation();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    } catch (err) {
      alert(t('errors.camera') || 'Failed to open camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setStreaming(false);
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current || !streaming) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
      onCapture(file);
      stopCamera();
    }, 'image/jpeg', 0.92);
  };

  return (
    <div style={{ marginTop: '16px' }}>
      {!streaming ? (
        <div style={{ padding: '24px', textAlign: 'center', border: '2px dashed var(--color-border)', borderRadius: '12px', background: 'var(--color-surface)' }}>
          <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '50%', background: 'var(--color-primary-light)', marginBottom: '8px', animation: 'pulse 1.5s infinite' }}>
            <Camera size={24} color="var(--color-primary)" />
          </div>
          <div style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>कैमरा शुरू हो रहा है... / Starting camera...</div>
        </div>
      ) : (
        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--color-primary)', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}>
          <video ref={videoRef} autoPlay playsInline style={{ width: '100%', display: 'block', maxHeight: '70vh', objectFit: 'cover' }} />
          <div style={{ display: 'flex', gap: '12px', padding: '16px', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center' }}>
            <button className="btn-primary" onClick={capturePhoto} style={{ width: 'auto', padding: '10px 24px', fontSize: 'var(--text-base)', background: 'var(--color-primary)', minHeight: '44px' }}>
              📸 फोटो खींचे / Capture Photo
            </button>
            <button className="btn-secondary" onClick={() => onCapture(null)} style={{ width: 'auto', padding: '10px 20px', fontSize: 'var(--text-base)', minHeight: '44px', color: 'white', borderColor: 'rgba(255,255,255,0.4)', background: 'transparent' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
