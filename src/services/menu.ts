import { apiClient } from './apiClient'
import { API_CONFIG } from '../config/api'
import { MenuResponse } from '../types/api'

export const menuApi = {
  getMenu: async () => {
    const response = await apiClient<MenuResponse>({
      url: API_CONFIG.endpoints.menuList,
      method: 'POST',
    })
    
    return response
  },
}