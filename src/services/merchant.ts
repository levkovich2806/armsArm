import { API_CONFIG } from "../config/api"
import { MerchantCreateRequest, Merchant, MerchantResponse, MerchantUpdateRequest } from "../types/api"
import { apiClient } from "./apiClient"
import { PageNavigator } from "@/types/api"

export const merchantApi = {
  getMerchants: async (pageNavigator: PageNavigator) => {
    const response = await apiClient<MerchantResponse>({
      url: API_CONFIG.endpoints.merchantList,
      method: 'POST',
      data: pageNavigator,
    })

    return response
  },
  getMerchant: async (merchantId: number) => {
    const response = await apiClient<Merchant>({
      url: API_CONFIG.endpoints.merchant(merchantId),
      method: 'GET',
    })

    return response
  },
  closeMerchant: async (merchantId: number, reason: string) => {
    const response = await apiClient<MerchantResponse>({
      url: API_CONFIG.endpoints.merchantClose,
      method: 'PUT',
      data: {
        key: merchantId,
        value: reason,
      },
    })

    return response
  },
  createMerchant: async (data: MerchantCreateRequest) => {
    const response = await apiClient<MerchantResponse>({
      url: API_CONFIG.endpoints.merchantCreate,
      method: 'POST',
      data,
    })

    return response
  },
  updateMerchant: async (merchantId: number, data: MerchantUpdateRequest) => {
    const response = await apiClient<MerchantResponse>({
      url: API_CONFIG.endpoints.merchant(merchantId),
      method: 'PUT',
      data,
    })

    return response
  },
}