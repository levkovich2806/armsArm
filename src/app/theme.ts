import { ThemeConfig } from 'antd';

// Конфигурация темы Ant Design
export const theme: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff',
    borderRadius: 4,
    // Можно добавить другие настройки темы
  },
  components: {
    Layout: {
      siderBg: '#001529',
      headerBg: '#fff',
    },
    Menu: {
      darkItemBg: '#001529',
    },
  },
}; 