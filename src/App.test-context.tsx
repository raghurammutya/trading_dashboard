import React from 'react';
import { Button } from 'antd';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <header className="App-header">
          <h1>Trading Dashboard</h1>
          <Button type="primary">Test Button</Button>
        </header>
      </div>
    </AuthProvider>
  );
}

export default App;