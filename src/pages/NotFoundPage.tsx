import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh'
    }}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={[
          <Button 
            type="primary" 
            key="home"
            icon={<HomeOutlined />}
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>,
          <Button 
            key="back"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        ]}
      />
    </div>
  );
}