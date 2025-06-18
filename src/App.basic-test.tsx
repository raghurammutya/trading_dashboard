import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Button, Layout, Typography } from 'antd';

const { Content } = Layout;
const { Title } = Typography;

function Dashboard() {
  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Dashboard</Title>
      <p>Welcome to the Trading Dashboard!</p>
      <Button type="primary">Test Button</Button>
    </div>
  );
}

function Profile() {
  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Profile</Title>
      <p>User profile page</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <Title level={1}>Trading Hub</Title>
            <nav style={{ marginBottom: '20px' }}>
              <a href="/dashboard" style={{ marginRight: '16px' }}>Dashboard</a>
              <a href="/profile" style={{ marginRight: '16px' }}>Profile</a>
            </nav>
          </div>
          
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;