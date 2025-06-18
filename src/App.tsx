import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Layout, Spin } from 'antd';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PublicHeader from './components/common/PublicHeader';
import { SocialAuthCallback } from './components/auth/SocialAuth';
import OAuthCallback from './components/auth/OAuthCallback';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navigation from './components/common/Navigation';
import './App.css';
import './styles/enhanced-themes.css';

// Public Pages - Critical
import HomePage from './pages/HomePage';

// Lazy load protected pages for better performance
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const ApiKeysPage = React.lazy(() => import('./pages/ApiKeysPage'));
const PermissionsPage = React.lazy(() => import('./pages/PermissionsPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const UsersPage = React.lazy(() => import('./pages/UsersPage'));
const TradingPage = React.lazy(() => import('./pages/TradingPage'));
const PortfolioPage = React.lazy(() => import('./pages/PortfolioPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

const { Content } = Layout;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false, // Disable automatic refetching for better performance
      staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
      cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
      retry: 1, // Reduce retries for faster failure
      retryDelay: 1000,
      refetchOnWindowFocus: false, // Prevent unnecessary refetches
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public routes with public header */}
                <Route path="/" element={<PublicLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="home" element={<HomePage />} />
                  <Route path="auth/callback/:provider" element={<OAuthCallback />} />
                </Route>
                
                {/* Protected routes with dashboard layout */}
                <Route path="/*" element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function PublicLayout() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <PublicHeader />
      <Content style={{ paddingTop: 64 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/auth/callback/:provider" element={<SocialAuthCallback />} />
        </Routes>
      </Content>
    </Layout>
  );
}

function DashboardLayout() {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navigation collapsed={collapsed} onCollapse={setCollapsed} />
      
      <Layout style={{ 
        marginLeft: collapsed ? 80 : 200,
        marginTop: 64,
        transition: 'margin-left 0.2s'
      }}>
        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          minHeight: 'calc(100vh - 112px)',
          borderRadius: '6px',
          backgroundColor: '#f5f5f5'
        }}>
          <Suspense fallback={
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '200px' 
            }}>
              <Spin size="large" />
            </div>
          }>
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/api-keys" element={<ApiKeysPage />} />
              <Route path="/permissions" element={<PermissionsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/users" element={
                <ProtectedRoute requiredRole={['ADMIN', 'EDITOR']}>
                  <UsersPage />
                </ProtectedRoute>
              } />
              <Route path="/trading" element={<TradingPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;