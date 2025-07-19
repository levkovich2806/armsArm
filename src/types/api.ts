interface BaseResponse<T> {
  countAll: number
  list: T[]
}

export interface MenuItem {
  menuId: string
  name: string
  url: string
}

export type MenuResponse = BaseResponse<MenuItem>

export interface AnType {
  anType: number
  anTypeName: string
  isOpen: boolean // 1 or 0
}

export type AnTypeResponse = BaseResponse<AnType>

type MerchantBase = {
  merchantName: string
  description: string
  prepaidPeriod: number
  productCount: number
}

export type Merchant = MerchantBase & {
  merchantId: number
  dateOpen: string
  dateClose: string | null
}

export type MerchantResponse = BaseResponse<Merchant>

export type MerchantCreateRequest = MerchantBase & { 
  fixedPaymentAmount: number 
}

export type MerchantUpdateRequest = MerchantBase

export type FilterList = {
  field: string
  oper: string
  values: string[] | number[]
  isCaseSensitive: number
}

export type SortList = {
  field: string
  order: string
}

export type PageNavigator = {
  pageNum: number
  pageSize: number
  filter: {
    list: FilterList[]
  }
  sort: {
    sortList: SortList[]
  }
}