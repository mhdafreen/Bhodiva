import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { OnboardingLanguagePage } from './pages/OnboardingLanguagePage';
import { UploadPage } from './pages/UploadPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { DashboardPage } from './pages/DashboardPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { SettingsPage } from './pages/SettingsPage';
import { MedicalDisclaimerPage } from './pages/MedicalDisclaimerPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';

// Component to handle first-time visitor onboarding routing
const OnboardingGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('bodhiva_onboarding_completed');
    // If first time and on the root path, gently redirect to onboarding
    if (!hasCompletedOnboarding && location.pathname === '/') {
      navigate('/onboarding/language', { replace: true });
    }
  }, [navigate, location.pathname]);

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <OnboardingGuard>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding/language" element={<OnboardingLanguagePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/analysis/:reportId" element={<AnalysisPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/history" element={<DashboardPage />} />
          <Route path="/compare" element={<ComparisonPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/disclaimer" element={<MedicalDisclaimerPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </OnboardingGuard>
    </BrowserRouter>
  );
};

export default App;
