'use client'

import React from 'react'
import { Layout, Typography } from 'antd'
import { MainMenu } from './MainMenu'

const { Header, Content, Footer } = Layout
const { Title } = Typography

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      }}>
        <Title level={4} style={{ margin: 0, marginRight: 24 }}>
          ARM
        </Title>
        <MainMenu />
      </Header>
      <Content style={{ padding: '12px' }}>
        <div style={{
          background: '#fff',
          padding: 24,
          minHeight: 280,
          borderRadius: 4,
        }}>
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        ARM © {new Date().getFullYear()}
      </Footer>
    </Layout>
  )
} 