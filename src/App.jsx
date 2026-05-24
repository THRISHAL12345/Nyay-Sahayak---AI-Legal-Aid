import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { LanguageSwitcher } from './components/LanguageSwitcher/LanguageSwitcher';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Analysis from './pages/Analysis';

function AppHeader() {
  return (
    <header className="app-header">
      <Link to="/" className="app-header-logo">
        <span style={{ fontSize: '1.5rem' }}>⚖️</span>
        <div>
          <div className="app-header-title">न्याय सहायक</div>
          <div className="app-header-subtitle">Nyay Sahayak</div>
        </div>
      </Link>
      <LanguageSwitcher compact />
    </header>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/analysis" element={<Analysis />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
