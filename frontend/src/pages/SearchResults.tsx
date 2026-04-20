import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productApi } from '../api/products'
import type { ProductSearchResult } from '../types'

function ResultCard({ result }: { result: ProductSearchResult }) {
  const priceFormatted = result.price != null
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(result.price)
    : null

  return (
    <Link
      to={`/shops/${result.shopId}`}
      className="card block hover:shadow-md hover:border-brand-200 transition-all duration-150 active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 text-base leading-snug">{result.productName}</h3>
            {!result.isAvailable && (
              <span className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-full px-2 py-0.5 flex-shrink-0">
                Unavailable
              </span>
            )}
          </div>
          {result.description && (
            <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{result.description}</p>
          )}
          {priceFormatted && (
            <p className="text-sm font-semibold text-brand-600 mt-1">{priceFormatted}</p>
          )}
        </div>
        <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* Shop info */}
      <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
        <span className="text-brand-600 bg-brand-50 rounded-full px-2 py-0.5 font-medium">
          {result.shopCategory}
        </span>
        <span>·</span>
        <span className="font-medium text-gray-600">{result.shopName}</span>
        <span>·</span>
        <span>{result.town}</span>
      </div>
    </Link>
  )
}

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const q = searchParams.get('q') ?? ''

  const { data: results = [], isLoading, isError } = useQuery({
    queryKey: ['search', q],
    queryFn: () => productApi.search(q),
    enabled: q.trim().length > 0
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 text-gray-600"
            aria-label="Go back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400">Results for</p>
            <h1 className="font-semibold text-gray-900 truncate">"{q}"</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6 pb-10 space-y-4">

        {/* Empty query */}
        {q.trim().length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-500 text-sm">Enter a product name to search.</p>
            <button className="mt-4 btn-primary" onClick={() => navigate('/')}>Back to Home</button>
          </div>
        )}

        {/* Loading */}
        {isLoading && q.trim().length > 0 && (
          <div className="space-y-3">
            {[1, 2, 3].map(n => (
              <div key={n} className="card animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="card text-center py-8">
            <p className="text-gray-500 text-sm">Search failed. Please check your connection.</p>
            <button className="mt-3 text-sm text-brand-600 font-medium" onClick={() => navigate('/')}>
              Back to Home
            </button>
          </div>
        )}

        {/* No results */}
        {!isLoading && !isError && q.trim().length > 0 && results.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🏪</p>
            <p className="text-gray-900 font-semibold">No products found for "{q}"</p>
            <p className="text-gray-500 text-sm mt-1">Try a different name, or browse shops directly.</p>
            <button className="mt-4 btn-primary" onClick={() => navigate('/')}>Browse Shops</button>
          </div>
        )}

        {/* Results */}
        {!isLoading && !isError && results.length > 0 && (
          <>
            <p className="text-sm text-gray-500">
              {results.length} product{results.length !== 1 ? 's' : ''} found
            </p>
            <div className="space-y-2">
              {results.map(r => (
                <ResultCard key={r.productId} result={r} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
