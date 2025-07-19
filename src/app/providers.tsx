'use client'

import React from 'react'
import { ConfigProvider } from 'antd'
import { theme } from './theme'

export function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={theme}>
      {children}
    </ConfigProvider>
  )
} 