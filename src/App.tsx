import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Institutes from './pages/Institutes';
import Drivers from './pages/Drivers';
import Analysis from './pages/Analysis';

type View = 'institutes' | 'drivers' | 'analysis';

function AppContent() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<View>('institutes');
  const [selectedInstituteId, setSelectedInstituteId] = useState<string>('');
  const [selectedInstituteName, setSelectedInstituteName] = useState<string>('');

  const handleInstituteClick = (instituteId: string, instituteName: string) => {
    setSelectedInstituteId(instituteId);
    setSelectedInstituteName(instituteName);
    setView('drivers');
  };

  const handleBackToInstitutes = () => {
    setView('institutes');
    setSelectedInstituteId('');
    setSelectedInstituteName('');
  };

  const handleNavigate = (page: 'institutes' | 'analysis') => {
    setView(page);
    if (page === 'institutes') {
      setSelectedInstituteId('');
      setSelectedInstituteName('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <>
      {view === 'institutes' && (
        <Institutes onInstituteClick={handleInstituteClick} onNavigate={handleNavigate} />
      )}
      {view === 'drivers' && (
        <Drivers
          instituteId={selectedInstituteId}
          instituteName={selectedInstituteName}
          onBack={handleBackToInstitutes}
          onNavigate={handleNavigate}
        />
      )}
      {view === 'analysis' && (
        <Analysis onNavigate={handleNavigate} />
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
