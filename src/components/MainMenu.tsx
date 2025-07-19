'use client'

import { MenuItem } from '@/types/api'
import { 
  HomeOutlined, 
  GlobalOutlined, 
  ScheduleOutlined, 
  NotificationOutlined, 
  DollarOutlined, 
  SettingOutlined,
  UserOutlined,
  TeamOutlined,
  MenuOutlined,
  HistoryOutlined,
  ShoppingOutlined,
  KeyOutlined
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Хардкодные пункты меню
const menuItems: ExtendedMenuItem[] = [
  { 
    menuId: 'web', 
    name: 'Web', 
    url: '/web',
    children: [
      { menuId: 'users', name: 'Пользователи', url: '/web/users' },
      { menuId: 'organizations', name: 'Организация', url: '/web/organizations' },
      { 
        menuId: 'menus', 
        name: 'Меню', 
        url: '/web/menus',
        children: [
          { menuId: 'menu', name: 'menu', url: '/web/menus/menu' },
          { menuId: 'filters', name: 'filters', url: '/web/menus/filters' },
          { menuId: 'headers', name: 'headers', url: '/web/menus/headers' },
          { menuId: 'merch_filter_data', name: 'merch_filter_Data', url: '/web/menus/merch_filter_data' },
          { menuId: 'merch_menu', name: 'merch_menu', url: '/web/menus/merch_menu' },
          { menuId: 'merch_filters', name: 'merch_filters', url: '/web/menus/merch_filters' },
          { menuId: 'merch_headers', name: 'merch_headers', url: '/web/menus/merch_headers' }
        ]
      },
      { menuId: 'contact_history', name: 'История контактов', url: '/web/contact_history' },
      { menuId: 'products', name: 'Продукты', url: '/web/products' },
      { menuId: 'api_keys', name: 'Ключи Api', url: '/web/api_keys' }
    ]
  },
  { menuId: 'scheduler', name: 'Планировщик', url: '/scheduler' },
  { 
    menuId: 'notification', 
    name: 'Оповещения', 
    url: '/notification',
    children: [
      { menuId: 'notifications', name: 'Оповещения', url: '/notification/notifications' },
      { menuId: 'history', name: 'История', url: '/notification/history' }
    ]
  },
  { menuId: 'payment', name: 'Оплата', url: '/payment' },
  { 
    menuId: 'settings', 
    name: 'Настройки', 
    url: '/settings',
    children: [
      { menuId: 'global', name: 'Глобальные', url: '/settings/global' },
      { menuId: 'analytics', name: 'Аналитика', url: '/settings/analytics' }
    ]
  }
]

// Расширяем тип MenuItem для поддержки подменю
interface ExtendedMenuItem extends MenuItem {
  children?: ExtendedMenuItem[];
}

export function MainMenu() {
  const pathname = usePathname()

  // Получаем иконку для пункта меню
  const getIcon = (url: string, menuId: string) => {
    // Иконки для главных пунктов
    if (menuId === 'web') return <GlobalOutlined />
    if (menuId === 'scheduler') return <ScheduleOutlined />
    if (menuId === 'notification') return <NotificationOutlined />
    if (menuId === 'payment') return <DollarOutlined />
    if (menuId === 'settings') return <SettingOutlined />
    
    // Иконки для подпунктов Web
    if (url.startsWith('/web/users')) return <UserOutlined />
    if (url.startsWith('/web/organizations')) return <TeamOutlined />
    if (url.startsWith('/web/menus')) return <MenuOutlined />
    if (url.startsWith('/web/contact_history')) return <HistoryOutlined />
    if (url.startsWith('/web/products')) return <ShoppingOutlined />
    if (url.startsWith('/web/api_keys')) return <KeyOutlined />
    
    // Дефолтная иконка
    return <HomeOutlined />
  }

  // Рекурсивная функция для преобразования данных меню в формат для Ant Design Menu
  const getMenuItems = (items: ExtendedMenuItem[] = menuItems): MenuProps['items'] => {
    return items
      .filter(item => item && typeof item.url === 'string')
      .map((item) => {
        const menuItem = {
          key: item.url || '',
          icon: getIcon(item.url || '', item.menuId || ''),
          label: <Link href={item.url || '/'}>{item.name || 'Меню'}</Link>,
          children: undefined as MenuProps['items'],
        }

        // Если есть дочерние элементы, добавляем их как подменю
        if (item.children && item.children.length > 0) {
          menuItem.children = getMenuItems(item.children)
        }

        return menuItem
      })
  }

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[pathname]}
      style={{ lineHeight: '64px', flex: 1, border: 'none' }}
      items={getMenuItems()}
      disabledOverflow={true}
    />
  )
}