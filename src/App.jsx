import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageSwitcher } from './components/LanguageSwitcher/LanguageSwitcher';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Analysis from './pages/Analysis';
import Login from './pages/Login';
import { LogOut, User } from 'lucide-react';

function AppHeader() {
  const { currentUser, logout, firebaseConfigured } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="app-header">
      <Link to="/" className="app-header-logo">
        <span style={{ fontSize: '1.5rem' }}>⚖️</span>
        <div>
          <div className="app-header-title">न्याय सहायक</div>
          <div className="app-header-subtitle">Nyay Sahayak</div>
        </div>
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <LanguageSwitcher compact />
        
        {firebaseConfigured && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div 
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '14px',
                    border: '1px solid var(--color-primary)'
                  }}
                  title={currentUser.email}
                >
                  {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                </div>
                <button 
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-danger)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                    padding: '4px 8px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                style={{
                  textDecoration: 'none',
                  color: 'var(--color-primary)',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: '1px solid var(--color-primary)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s'
                }}
              >
                <User size={14} /> Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppHeader />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/analysis" element={<Analysis />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
