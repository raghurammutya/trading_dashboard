import React from 'react';
import { Button } from 'antd';
import { AuthProvider, useAuth } from './context/AuthContext.simple';

function LoginComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (isAuthenticated) {
    return (
      <div>
        <p>Welcome, {user?.first_name}!</p>
        <Button onClick={logout}>Logout</Button>
      </div>
    );
  }

  return (
    <Button onClick={() => login('test@example.com', 'password')}>
      Login
    </Button>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="App" style={{ padding: '20px' }}>
        <header className="App-header">
          <h1>Trading Dashboard</h1>
          <LoginComponent />
        </header>
      </div>
    </AuthProvider>
  );
}

export default App;