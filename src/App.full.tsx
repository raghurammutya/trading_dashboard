import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Layout } from 'antd';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AuthLayout from './components/auth/AuthLayout';
import { SocialAuthCallback } from './components/auth/SocialAuth';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navigation from './components/common/Navigation';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ApiKeysPage from './pages/ApiKeysPage';
import PermissionsPage from './pages/PermissionsPage';
import SettingsPage from './pages/SettingsPage';
import UsersPage from './pages/UsersPage';
import TradingPage from './pages/TradingPage';
import PortfolioPage from './pages/PortfolioPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

const { Content } = Layout;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 30000, // Refetch every 30 seconds
      staleTime: 10000, // Data is fresh for 10 seconds
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
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
                {/* Public routes */}
                <Route path="/login" element={<AuthLayout />} />
                <Route path="/auth/callback/:provider" element={<SocialAuthCallback />} />
                
                {/* Protected routes */}
                <Route path="/*" element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                } />
                
                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navigation collapsed={collapsed} onCollapse={setCollapsed} />
      
      <Layout>
        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          minHeight: 280,
          borderRadius: '6px'
        }}>
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
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;