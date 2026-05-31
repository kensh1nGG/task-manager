import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Header from './components/Header';

// Ленивая загрузка компонентов
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const About = lazy(() => import('./pages/About'));

// Компонент загрузки
const LoadingSpinner = () => (
  <div style={{
    minHeight: 'calc(100vh - 73px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-primary)'
  }}>
    <div style={{
      width: '48px',
      height: '48px',
      border: '4px solid var(--border-color)',
      borderTop: '4px solid var(--primary)',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

function App() {
  return (
    <>
      <Header />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;