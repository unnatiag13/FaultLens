import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';

// Layout
import { AppLayout } from './components/layout/AppLayout';

// Public Pages
import { HomePage } from './pages/HomePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Authenticated Pages
import { DashboardPage } from './pages/DashboardPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { AddApplicationPage } from './pages/AddApplicationPage';
import { ApplicationDetailsPage } from './pages/ApplicationDetailsPage';
import { DependencyGraphPage } from './pages/DependencyGraphPage';
import { ExperimentsPage } from './pages/ExperimentsPage';
import { CreateExperimentPage } from './pages/CreateExperimentPage';
import { ExperimentDetailsPage } from './pages/ExperimentDetailsPage';
import { MonitoringPage } from './pages/MonitoringPage';
import { ImpactAnalysisPage } from './pages/ImpactAnalysisPage';
import { RootCausePage } from './pages/RootCausePage';
import { RemediationPage } from './pages/RemediationPage';
import { HistoryPage } from './pages/HistoryPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <ToastProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Authenticated Dashboard Routes */}
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />

                <Route path="/applications" element={<ApplicationsPage />} />
                <Route path="/applications/new" element={<AddApplicationPage />} />
                <Route path="/applications/:id" element={<ApplicationDetailsPage />} />
                <Route path="/applications/:id/graph" element={<DependencyGraphPage />} />

                <Route path="/experiments" element={<ExperimentsPage />} />
                <Route path="/experiments/new" element={<CreateExperimentPage />} />
                <Route path="/experiments/:id" element={<ExperimentDetailsPage />} />

                <Route path="/monitoring" element={<MonitoringPage />} />
                <Route path="/analysis/impact" element={<ImpactAnalysisPage />} />
                <Route path="/analysis/root-cause" element={<RootCausePage />} />
                <Route path="/remediation" element={<RemediationPage />} />
                <Route path="/history" element={<HistoryPage />} />
              </Route>

              {/* Fallback Catch-all Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ToastProvider>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
