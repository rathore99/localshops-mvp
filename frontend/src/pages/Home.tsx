import { useState } from 'react'
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
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const { data: shops = [], isLoading: shopsLoading, isError: shopsError } = useQuery({
    queryKey: ['shops'],
    queryFn: shopApi.getAll
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: shopApi.getCategories
  })

  const filteredShops = activeCategory
    ? shops.filter(s => s.category === activeCategory)
    : shops

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
              {categories.map(cat => {
                const isActive = activeCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(isActive ? null : cat)}
                    className={`flex-shrink-0 flex flex-col items-center gap-1 border rounded-xl px-4 py-3
                               text-xs font-medium transition-colors min-w-[72px]
                               ${isActive
                                 ? 'bg-brand-500 border-brand-500 text-white'
                                 : 'bg-white border-gray-200 text-gray-700 hover:border-brand-400 hover:text-brand-600'
                               }`}
                  >
                    <span className="text-2xl">{CATEGORY_ICONS[cat] ?? '🏪'}</span>
                    {cat}
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* Shops */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-700">
              {activeCategory ? `${activeCategory} shops` : 'Shops near you'}
            </h2>
            {activeCategory && (
              <button
                onClick={() => setActiveCategory(null)}
                className="text-xs text-brand-600 font-medium hover:text-brand-700"
              >
                Clear filter ✕
              </button>
            )}
          </div>

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

          {!shopsLoading && !shopsError && filteredShops.length === 0 && (
            <div className="card text-center py-8">
              <p className="text-2xl mb-2">🏪</p>
              {activeCategory
                ? <p className="text-gray-500 text-sm">No {activeCategory} shops found.</p>
                : <p className="text-gray-500 text-sm">No shops available right now.</p>
              }
              {!activeCategory && (
                <p className="text-gray-400 text-xs mt-1">Check back soon — more shops are being onboarded.</p>
              )}
            </div>
          )}

          {!shopsLoading && !shopsError && filteredShops.length > 0 && (
            <div className="space-y-3">
              {filteredShops.map(shop => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
