import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { GovFlowProvider, useGovFlow } from './store/GovFlowContext';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { DemoRoleBanner } from './components/common/DemoRoleBanner';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { CookieBanner } from './components/common/CookieBanner';
import { CookiePreferencesModal } from './components/common/CookiePreferencesModal';
import { AccessibilityDrawer } from './components/common/AccessibilityDrawer';
import { AIAssistantWidget } from './components/common/AIAssistantWidget';
import { SplashScreen } from './components/common/SplashScreen';

// Public & Citizen Pages
import { LandingPage } from './pages/LandingPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { SearchPage } from './pages/SearchPage';
import { EligibilityCheckerPage } from './pages/EligibilityCheckerPage';
import { ApplicationFormPage } from './pages/ApplicationFormPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { ApplicationDetailPage } from './pages/ApplicationDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ConsentPage } from './pages/ConsentPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AssistantPage } from './pages/AssistantPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { CookiesPage } from './pages/CookiesPage';
import { AccessibilityPage } from './pages/AccessibilityPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { AgricultureDashboardPage } from './pages/AgricultureDashboardPage';
import { GrievancePage } from './pages/GrievancePage';

// Department Pages
import { DepartmentLayout } from './pages/department/DepartmentLayout';
import { DepartmentDashboard } from './pages/department/DepartmentDashboard';
import { DepartmentApplications } from './pages/department/DepartmentApplications';
import { DepartmentServices } from './pages/department/DepartmentServices';
import { DepartmentWorkflows } from './pages/department/DepartmentWorkflows';
import { DepartmentDocuments } from './pages/department/DepartmentDocuments';
import { DepartmentIntegrations } from './pages/department/DepartmentIntegrations';
import { DepartmentAuditLogs } from './pages/department/DepartmentAuditLogs';
import { DepartmentAnalytics } from './pages/department/DepartmentAnalytics';
import { OfficerDashboardPage } from './pages/department/OfficerDashboardPage';

// Admin Pages
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

function AppContent() {
  const { currentUser } = useGovFlow();
  const location = useLocation();
  const navigate = useNavigate();

  // Track whether splash has been viewed in this browser session
  const [hasSeenSplash, setHasSeenSplash] = useState<boolean>(() => {
    return sessionStorage.getItem('govflow_splash_completed') === 'true';
  });

  const [showSplash, setShowSplash] = useState<boolean>(!hasSeenSplash);
  const isReturningVisitor = localStorage.getItem('govflow_visited_before') === 'true';

  const handleSplashComplete = (isAuthenticated: boolean) => {
    sessionStorage.setItem('govflow_splash_completed', 'true');
    localStorage.setItem('govflow_visited_before', 'true');
    setShowSplash(false);

    // Section 9: Authentication-Aware Routing
    // If opening root URL and an authenticated user session is active, route directly to their console/dashboard
    if (location.pathname === '/' && isAuthenticated && currentUser) {
      if (currentUser.role === 'citizen') {
        navigate('/dashboard');
      } else if (currentUser.role === 'officer' || currentUser.role === 'DEPARTMENT_OFFICER') {
        navigate('/officer/dashboard');
      } else if (currentUser.role === 'dept_admin') {
        navigate('/department-admin/dashboard');
      } else if (currentUser.role === 'sys_admin' || currentUser.role === 'SYSTEM_ADMIN') {
        navigate('/admin/dashboard');
      }
    }
  };

  return (
    <>
      {/* Branded First-Load Splash Screen */}
      {showSplash && (
        <SplashScreen 
          onComplete={handleSplashComplete} 
          forceQuick={isReturningVisitor}
        />
      )}

      <div className={`min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] transition-opacity duration-700 ${
        showSplash ? 'opacity-0' : 'opacity-100'
      }`}>
        {/* Top Demo Banner */}
        <DemoRoleBanner />

        {/* Sticky Global Navbar */}
        <Navbar />

        {/* Main Content View */}
        <main className="flex-1">
          <Routes>
            {/* Public Unauthenticated Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:id" element={<ServiceDetailPage />} />
            <Route path="/services/:id/apply" element={<ApplicationFormPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/certificates" element={<CertificatesPage />} />
            <Route path="/agriculture" element={<AgricultureDashboardPage />} />
            <Route path="/grievances" element={<GrievancePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/eligibility/:serviceId" element={<EligibilityCheckerPage />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="/accessibility" element={<AccessibilityPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Citizen Routes (Strict Authentication & Data Isolation) */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/applications" 
              element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <ApplicationsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/applications/:id" 
              element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <ApplicationDetailPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/documents" 
              element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <DocumentsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/consent" 
              element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <ConsentPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <NotificationsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />

            {/* Multi-Role Dashboards (Citizen, Officer, Department Admin, System Admin) */}
            <Route 
              path="/officer/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['officer', 'dept_admin', 'DEPARTMENT_OFFICER']}>
                  <OfficerDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/department-admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['dept_admin']}>
                  <OfficerDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['sys_admin', 'SYSTEM_ADMIN']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } 
            />

            {/* Protected Department Console Routes */}
            <Route 
              path="/department" 
              element={
                <ProtectedRoute allowedRoles={['officer', 'dept_admin', 'DEPARTMENT_OFFICER']}>
                  <DepartmentLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DepartmentDashboard />} />
              <Route path="applications" element={<DepartmentApplications />} />
              <Route path="services" element={<DepartmentServices />} />
              <Route path="workflows" element={<DepartmentWorkflows />} />
              <Route path="documents" element={<DepartmentDocuments />} />
              <Route path="integrations" element={<DepartmentIntegrations />} />
              <Route path="audit-logs" element={<DepartmentAuditLogs />} />
              <Route path="analytics" element={<DepartmentAnalytics />} />
            </Route>

            {/* Protected System Admin Routes */}
            <Route 
              path="/admin" 
              element={<Navigate to="/admin/dashboard" replace />} 
            />
            <Route 
              path="/admin/services" 
              element={
                <ProtectedRoute allowedRoles={['sys_admin', 'SYSTEM_ADMIN']}>
                  <AdminServicesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/integrations" 
              element={
                <ProtectedRoute allowedRoles={['sys_admin', 'SYSTEM_ADMIN']}>
                  <DepartmentIntegrations />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/audit-logs" 
              element={
                <ProtectedRoute allowedRoles={['sys_admin', 'SYSTEM_ADMIN']}>
                  <DepartmentAuditLogs />
                </ProtectedRoute>
              } 
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Modals & Floating Widgets */}
        <CookieBanner />
        <CookiePreferencesModal />
        <AccessibilityDrawer />
        <AIAssistantWidget />

        {/* Comprehensive Civic Footer */}
        <Footer />
      </div>
    </>
  );
}

export function App() {
  return (
    <GovFlowProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </GovFlowProvider>
  );
}

export default App;
