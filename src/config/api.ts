export const API_CONFIG = {
  endpoints: {
    menuList: '/menu/list',
    merchant: (merchantId: number) => `/merchant/${merchantId}`,
    merchantList: '/merchant/list',
    merchantClose: '/merchant/close',
    merchantCreate: '/merchant',
  },
}