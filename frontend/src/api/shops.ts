import apiClient from './client'
import type { Shop, ShopDetail } from '../types'

export const shopApi = {
  getAll: (): Promise<Shop[]> =>
    apiClient.get<Shop[]>('/shops').then(r => r.data),

  getById: (id: number): Promise<ShopDetail> =>
    apiClient.get<ShopDetail>(`/shops/${id}`).then(r => r.data),

  getCategories: (): Promise<string[]> =>
    apiClient.get<string[]>('/categories').then(r => r.data)
}
