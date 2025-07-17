'use client';

import { useEffect, useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined, DashboardOutlined } from '@ant-design/icons';
import { menuApi } from '@/services/menu';

const { Header, Sider, Content } = Layout;

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      console.log('Attempting to fetch user data...');
      try {
        const response = await menuApi.getMenu()
        console.log('Response:', response);
      } catch (e) {
        // Эта ошибка, скорее всего, означает, что браузер инициировал
        // перенаправление на страницу входа из-за cross-origin политики.
        // Ничего делать не нужно, пользователь вернется сюда после логина.
        console.error('Fetch failed, likely due to auth redirect:', e);
      }
    }

    fetchUser();
  }, []); // Пустой массив зависимостей гарантирует, что эффект выполнится один раз при монтировании

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <DashboardOutlined />,
              label: 'Главная',
            },
            {
              key: '2',
              icon: <UserOutlined />,
              label: 'Профиль',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0 }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              color: '#fff',
            }}
          />
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>ARM - Автоматизированное рабочее место</span>
        </Header>
        <Content>
          <div>
            <h1>Hello World</h1>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
