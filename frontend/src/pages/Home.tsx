import { useQuery } from '@tanstack/react-query'
import { shopApi } from '../api/shops'
import ShopCard from '../components/ShopCard'
import SearchBar from '../components/SearchBar'

const CATEGORY_ICONS: Record<string, string> = {
  Apparel: '👗',
  Groceries: '🛒',
  Electronics: '📱',
  Pharmacy: '💊',
  Hardware: '🔧',
  'Home Essentials': '🏠',
  Stationery: '📚',
  Footwear: '👟'
}

export default function Home() {
  const { data: shops = [], isLoading: shopsLoading, isError: shopsError } = useQuery({
    queryKey: ['shops'],
    queryFn: shopApi.getAll
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: shopApi.getCategories
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">LocalShops</h1>
            <p className="text-xs text-gray-500">Singrauli</p>
          </div>
          <a href="/admin" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            Shopkeeper Login
          </a>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-10 space-y-6 pt-6">
        {/* Search */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Find what you need
          </h2>
          <SearchBar />
        </section>

        {/* Categories */}
        {categories.length > 0 && (
          <section>
            <h2 className="text-base font-semibold text-gray-700 mb-3">Browse by category</h2>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  className="flex-shrink-0 flex flex-col items-center gap-1 bg-white border border-gray-200
                             rounded-xl px-4 py-3 text-xs font-medium text-gray-700
                             hover:border-brand-400 hover:text-brand-600 transition-colors min-w-[72px]"
                  onClick={() => {/* Feature 2: filter by category */}}
                >
                  <span className="text-2xl">{CATEGORY_ICONS[cat] ?? '🏪'}</span>
                  {cat}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Shops */}
        <section>
          <h2 className="text-base font-semibold text-gray-700 mb-3">Shops near you</h2>

          {shopsLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map(n => (
                <div key={n} className="card animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/4 mb-3" />
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                </div>
              ))}
            </div>
          )}

          {shopsError && (
            <div className="card text-center py-8">
              <p className="text-gray-500 text-sm">Could not load shops. Please check your connection.</p>
              <button
                className="mt-3 text-sm text-brand-600 font-medium"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
            </div>
          )}

          {!shopsLoading && !shopsError && shops.length === 0 && (
            <div className="card text-center py-8">
              <p className="text-2xl mb-2">🏪</p>
              <p className="text-gray-500 text-sm">No shops available right now.</p>
              <p className="text-gray-400 text-xs mt-1">Check back soon — more shops are being onboarded.</p>
            </div>
          )}

          {!shopsLoading && !shopsError && shops.length > 0 && (
            <div className="space-y-3">
              {shops.map(shop => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
