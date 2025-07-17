interface ApiRequest {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any // В данном случае any оправдан, так как это общий API клиент
  headers?: Record<string, string>
}

interface RequestHeaders {
  'Content-Type': string
  'Authorization'?: string
  [key: string]: string | undefined
}

export const apiClient = async <T>({ url, method, data, headers = {} }: ApiRequest): Promise<T> => {
  const requestHeaders: RequestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${url}`, {
      method,
      headers: requestHeaders as Record<string, string>,
      body: data ? JSON.stringify(data) : undefined,
      mode: 'cors',
      credentials: 'include',
    })

    // Особая обработка для 202 Accepted - считаем успешным ответом
    if (response.status === 202) {
      return null as T
    }

    if (!response.ok) {
      if (response.status === 401) {
        console.log('401')
      }
      throw new Error(`HTTP error! status: ${response.status}. Url: ${url}`)
    }

    const text = await response.text()
    if (!text) {
      return null as T
    }

    try {
      return JSON.parse(text) as T
    }
    catch {
      console.warn('Не удалось распарсить ответ как JSON:', text)
      return null as T
    }
  }
  catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}
