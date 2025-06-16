import { PageContainer } from '@ant-design/pro-components';
import { Card, Typography } from 'antd';
import React from 'react';

const Admin: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <Typography.Title level={2} style={{ textAlign: 'center' }}>
          管理页面
        </Typography.Title>
      </Card>
    </PageContainer>
  );
};

export default Admin; 