import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { shopApi } from '../api/shops'
import ProductCard from '../components/ProductCard'

export default function ShopDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: shop, isLoading, isError, error } = useQuery({
    queryKey: ['shop', id],
    queryFn: () => shopApi.getById(Number(id)),
    enabled: !!id && !isNaN(Number(id))
  })

  const whatsappUrl = shop
    ? `https://wa.me/91${shop.phone}?text=${encodeURIComponent(`Hi! I found your shop on LocalShops. I'd like to know about your products.`)}`
    : null

  const callUrl = shop ? `tel:+91${shop.phone}` : null

  const availableCount = shop?.products.filter(p => p.isAvailable).length ?? 0
  const totalCount = shop?.products.length ?? 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 pt-6 space-y-4">
          <div className="card animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-1/4 mb-4" />
            <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-2/4" />
          </div>
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    const is404 = (error as { response?: { status: number } })?.response?.status === 404
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-4xl mb-3">🏪</p>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            {is404 ? 'Shop not found' : 'Could not load shop'}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {is404
              ? 'This shop may no longer be active.'
              : 'Please check your connection and try again.'}
          </p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (!shop) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 text-gray-600"
            aria-label="Go back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="font-semibold text-gray-900 truncate">{shop.name}</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-24 pt-6 space-y-5">
        {/* Shop info card */}
        <section className="card space-y-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{shop.name}</h2>
            <span className="inline-block mt-1 text-xs font-medium text-brand-600 bg-brand-50 rounded-full px-2 py-0.5">
              {shop.category}
            </span>
          </div>

          {shop.description && (
            <p className="text-sm text-gray-600">{shop.description}</p>
          )}

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{shop.address}, {shop.town}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+91 {shop.phone}</span>
            </div>
          </div>

          {/* Contact buttons */}
          <div className="flex gap-3 pt-1">
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1 gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.858L.057 23.704a.5.5 0 00.614.676l6.04-1.522A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.686-.518-5.22-1.42l-.374-.214-3.888.98.93-3.797-.236-.39A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
                WhatsApp
              </a>
            )}
            {callUrl && (
              <a href={callUrl} className="btn-secondary flex-1 gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call
              </a>
            )}
          </div>
        </section>

        {/* Products */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-800">
              Products
            </h3>
            <span className="text-xs text-gray-400">
              {availableCount} of {totalCount} available
            </span>
          </div>

          {shop.products.length === 0 ? (
            <div className="card text-center py-6">
              <p className="text-sm text-gray-500">No products listed yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {shop.products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Sticky Reserve CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-10">
        <div className="max-w-2xl mx-auto">
          <a
            href={`/reserve/${shop.id}`}
            className="btn-primary w-full text-center"
          >
            Reserve Items from this Shop
          </a>
        </div>
      </div>
    </div>
  )
}
