import { AnTypeResponse, PageNavigator } from "@/types/api"
import { apiClient } from "./apiClient"

export const analyticApi = {
  getAnTypes: async (pageNavigator: PageNavigator): Promise<AnTypeResponse> => {
    return apiClient<AnTypeResponse>({
      url: '/analytic/antype/list',
      method: 'POST',
      data: pageNavigator,
    })
  }
} 