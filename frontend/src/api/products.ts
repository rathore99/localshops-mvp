import apiClient from './client'
import type { ProductSearchResult } from '../types'

export const productApi = {
  search: (q: string): Promise<ProductSearchResult[]> =>
    apiClient.get<ProductSearchResult[]>('/products/search', { params: { q } }).then(r => r.data)
}
