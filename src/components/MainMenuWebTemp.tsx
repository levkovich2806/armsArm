'use client'

import { menuApi } from '@/services/menu'
import { MenuItem } from '@/types/api'
import { HomeOutlined, ShopOutlined, UserOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Menu, Spin } from 'antd'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

// Дефолтные пункты меню на случай, если API недоступно
const defaultMenuItems: MenuItem[] = [
  { menuId: 'home', name: 'Главная', url: '/' },
  { menuId: 'merchant', name: 'Мерчанты', url: '/merchant' },
]

type MenuItemType = Required<MenuProps>['items'][number];

export function MainMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenuItems)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    // Загружаем элементы меню при монтировании компонента
    const fetchMenu = async () => {
      try {
        const response = await menuApi.getMenu()
        if (response.list && response.list.length > 0) {
          // Проверяем, что все URL корректные
          const validItems = response.list.filter(item => item && typeof item.url === 'string')
          setMenuItems(validItems.length > 0 ? validItems : defaultMenuItems)
        }
      } catch (error) {
        console.error('Ошибка при загрузке меню:', error)
        // Оставляем дефолтные пункты меню при ошибке
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
  }, [])

  // Получаем иконку для пункта меню
  const getIcon = (url: string) => {
    if (url === '/') return <HomeOutlined />
    if (url === '/merchant') return <ShopOutlined />
    return <UserOutlined />
  }

  // Преобразуем данные меню в формат для Ant Design Menu
  const getMenuItems = (): MenuItemType[] => {
    return menuItems
      .filter(item => item && typeof item.url === 'string') // Дополнительная проверка
      .map((item) => ({
        key: item.url || '',
        icon: getIcon(item.url || ''),
        label: <Link href={item.url || '/'}>{item.name || 'Меню'}</Link>,
      }))
  }

  // Показываем спиннер во время загрузки
  if (loading) {
    return <Spin size="small" />
  }

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[pathname]}
      style={{ lineHeight: '64px', flex: 1, border: 'none' }}
      items={getMenuItems()}
    />
  )
}