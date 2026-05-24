import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Mail, Lock, LogIn, UserPlus, Globe, ArrowLeft } from 'lucide-react';

export default function Login() {
  const { loginWithGoogle, loginWithEmail, signupWithEmail, firebaseConfigured } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate(redirect);
    } catch (err) {
      console.error(err);
      setError('गूगल साइन-इन विफल रहा / Google Sign-In failed: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('कृपया ईमेल और पासवर्ड भरें / Please enter both email and password');
      return;
    }
    if (password.length < 6) {
      setError('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए / Password must be at least 6 characters');
      return;
    }

    try {
      setError('');
      setLoading(true);
      if (isSignUp) {
        await signupWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      navigate(redirect);
    } catch (err) {
      console.error(err);
      let errMsg = err.message || 'Auth action failed';
      if (err.code === 'auth/user-not-found') errMsg = 'खाता नहीं मिला / Account not found. Please sign up.';
      if (err.code === 'auth/wrong-password') errMsg = 'गलत पासवर्ड / Incorrect password. Please try again.';
      if (err.code === 'auth/email-already-in-use') errMsg = 'ईमेल पहले से ही उपयोग में है / Email already in use.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      
      {/* Back Button */}
      <button 
        className="btn-ghost" 
        onClick={() => navigate('/')} 
        style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-secondary)', zIndex: 10 }}
      >
        <ArrowLeft size={18} /> मुख्य पृष्ठ / Home
      </button>

      <div className="card" style={{ width: '100%', maxWidth: '440px', boxShadow: '0 12px 40px rgba(26, 58, 107, 0.08)', border: '1px solid var(--color-border)', borderRadius: '20px', padding: '32px 24px' }}>
        
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>⚖️</div>
          <h2 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-secondary)', marginBottom: '4px' }}>
            न्याय सहायक लॉगिन
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
            Nyay Sahayak Portal Login
          </p>
        </div>

        {error && (
          <div style={{ padding: '12px 14px', background: '#FEF2F2', borderLeft: '4px solid var(--color-danger)', borderRadius: '8px', color: 'var(--color-danger)', fontSize: 'var(--text-xs)', marginBottom: '20px', lineHeight: 1.5 }}>
            {error}
          </div>
        )}

        {!firebaseConfigured ? (
          <div style={{ textAlign: 'center', padding: '16px', background: 'var(--color-secondary-light)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <p style={{ fontWeight: 600, color: 'var(--color-secondary)', marginBottom: '8px' }}>⚠️ ऑफलाइन गेस्ट मोड सक्रिय</p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              Firebase credentials are not set in environment. App is fully functioning in offline fallback storage mode.
            </p>
            <button className="btn-primary" onClick={() => navigate('/')}>
              गेस्ट के रूप में जारी रखें / Continue as Guest
            </button>
          </div>
        ) : (
          <div>
            {/* Google Sign-in */}
            <button 
              className="btn-secondary" 
              onClick={handleGoogleSignIn} 
              disabled={loading}
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '12px', 
                background: 'white', 
                border: '2px solid var(--color-border)', 
                color: 'var(--color-text-secondary)',
                fontWeight: 600,
                fontSize: 'var(--text-base)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                borderRadius: '10px',
                minHeight: '48px',
                cursor: 'pointer'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.79 2.7l2.79 2.16c1.63-1.5 2.57-3.7 2.57-6.3c0-.13-.01-.26-.02-.39z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.79-2.16c-.77.52-1.77.83-2.97.83c-2.29 0-4.22-1.54-4.91-3.61L1.4 12.04C2.88 15.3 6.18 17.5 9 18z" fill="#34A853"/>
                <path d="M4.09 10.88c-.17-.52-.27-1.07-.27-1.63s.1-1.11.27-1.63L1.4 5.46C.51 7.24 0 9.24 0 11.25s.51 4.01 1.4 5.79l2.69-2.16z" fill="#FBBC05"/>
                <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.8 11.43 0 9 0C6.18 0 2.88 2.2 1.4 5.46l2.69 2.16C4.78 5.12 6.71 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Google से लॉगिन करें / Google Sign-In
            </button>

            {/* OR Divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', color: 'var(--color-text-muted)' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
              <span style={{ padding: '0 12px', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>या / Or</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailAuth}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                  ईमेल / Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--color-text-muted)' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 38px',
                      borderRadius: '8px',
                      border: '2px solid var(--color-border)',
                      fontSize: 'var(--text-base)',
                      outline: 'none',
                      fontFamily: 'var(--font-body)',
                      background: 'var(--color-surface)',
                      transition: 'border-color 0.2s',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                  पासवर्ड / Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--color-text-muted)' }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 38px',
                      borderRadius: '8px',
                      border: '2px solid var(--color-border)',
                      fontSize: 'var(--text-base)',
                      outline: 'none',
                      fontFamily: 'var(--font-body)',
                      background: 'var(--color-surface)',
                      transition: 'border-color 0.2s',
                    }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={loading}
                style={{ width: '100%', minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? (
                  <span>प्रगति पर है... / Loading...</span>
                ) : isSignUp ? (
                  <>
                    <UserPlus size={18} />
                    <span>खाता बनाएं / Sign Up</span>
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>लॉगिन करें / Log In</span>
                  </>
                )}
              </button>
            </form>

            {/* Toggle Sign Up / Log In */}
            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: 'var(--text-sm)' }}>
              <button 
                type="button" 
                className="btn-ghost" 
                onClick={() => setIsSignUp(!isSignUp)}
                disabled={loading}
                style={{ textDecoration: 'underline', color: 'var(--color-primary)', fontWeight: 600 }}
              >
                {isSignUp ? (
                  'पहले से खाता है? लॉगिन करें / Have an account? Log In'
                ) : (
                  'नया खाता बनाएं / Create new account (Sign Up)'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Info Shield */}
        <div style={{ marginTop: '28px', display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px', background: '#F0FDF4', borderRadius: '10px', fontSize: 'var(--text-xs)', color: 'var(--color-success)', border: '1px solid #BBF7D0' }}>
          <Shield size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>100% सुरक्षित और निजी / 100% Secured Portal</strong>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Your private data is fully sandboxed and stored locally or scoped within your encrypted Firebase instance.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
