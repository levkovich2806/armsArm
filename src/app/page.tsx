'use client'

import { menuApi } from '@/services/menu'
import { Layout } from 'antd'
import { useEffect } from 'react'


export default function Home() {
  useEffect(() => {
    async function fetchUser() {
      console.log('Attempting to fetch user data...')
      try {
        const response = await menuApi.getMenu()
        console.log('Response:', response)
      } catch (e) {
        // Эта ошибка, скорее всего, означает, что браузер инициировал
        // перенаправление на страницу входа из-за cross-origin политики.
        // Ничего делать не нужно, пользователь вернется сюда после логина.
        console.error('Fetch failed, likely due to auth redirect:', e)
      }
    }

    fetchUser()
  }, []) // Пустой массив зависимостей гарантирует, что эффект выполнится один раз при монтировании

  return (
    <Layout style={{ minHeight: '100vh' }}>

    </Layout>
  )
}
