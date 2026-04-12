import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import apiClient from '../api/client'
import ShopCard from '../components/ShopCard'
import type { Shop } from '../types'

interface SearchResult {
  id: number
  name: string
  description: string | null
  price: number | null
  isAvailable: boolean
  shop: Shop
}

export default function SearchResults() {
  const [params] = useSearchParams()
  const query = params.get('q') ?? ''
  const navigate = useNavigate()

  const { data = [], isLoading, isError } = useQuery({
    queryKey: ['search', query],
    queryFn: () =>
      apiClient.get<SearchResult[]>(`/products/search?q=${encodeURIComponent(query)}`).then(r => r.data),
    enabled: query.length > 0
  })

  // Deduplicate shops from results
  const shops: Shop[] = []
  const seen = new Set<number>()
  data.forEach(r => {
    if (!seen.has(r.shop.id)) { seen.add(r.shop.id); shops.push(r.shop) }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-gray-100 text-gray-600" aria-label="Back">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="font-semibold text-gray-900 truncate">Results for "{query}"</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-10 pt-6 space-y-4">
        {isLoading && (
          <div className="space-y-3">
            {[1,2,3].map(n => (
              <div key={n} className="card animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="card text-center py-8">
            <p className="text-gray-500 text-sm">Search failed. Please check your connection.</p>
          </div>
        )}

        {!isLoading && !isError && data.length === 0 && (
          <div className="card text-center py-10">
            <p className="text-2xl mb-2">🔍</p>
            <p className="font-medium text-gray-700">No results for "{query}"</p>
            <p className="text-sm text-gray-400 mt-1">Try a different keyword or browse by category.</p>
            <button className="btn-primary mt-4" onClick={() => navigate('/')}>Browse all shops</button>
          </div>
        )}

        {!isLoading && !isError && data.length > 0 && (
          <>
            <p className="text-sm text-gray-500">{data.length} product{data.length !== 1 ? 's' : ''} in {shops.length} shop{shops.length !== 1 ? 's' : ''}</p>

            {/* Products grouped by match */}
            <div className="space-y-2">
              {data.map(r => (
                <div key={r.id} className="card flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{r.name}</p>
                    <p className="text-xs text-brand-600 mt-0.5">{r.shop.name} · {r.shop.category}</p>
                    {!r.isAvailable && (
                      <span className="text-xs text-gray-400">Unavailable</span>
                    )}
                  </div>
                  <div className="flex-shrink-0 text-right">
                    {r.price != null && (
                      <p className="text-sm font-semibold text-gray-800">₹{r.price.toLocaleString('en-IN')}</p>
                    )}
                    <button
                      className="text-xs text-brand-600 font-medium mt-1 hover:underline"
                      onClick={() => navigate(`/shops/${r.shop.id}`)}
                    >
                      View shop →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Shops with matching products */}
            {shops.length > 0 && (
              <>
                <p className="text-sm font-semibold text-gray-600 pt-2">Shops with matching products</p>
                <div className="space-y-3">
                  {shops.map(shop => <ShopCard key={shop.id} shop={shop} />)}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}
