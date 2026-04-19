import { Link } from 'react-router-dom'
import type { Shop } from '../types'

interface Props {
  shop: Shop
}

const CATEGORY_COLORS: Record<string, string> = {
  Apparel:     'bg-pink-100 text-pink-700',
  Groceries:   'bg-green-100 text-green-700',
  Electronics: 'bg-blue-100 text-blue-700',
  Pharmacy:    'bg-red-100 text-red-700',
  Hardware:    'bg-yellow-100 text-yellow-700',
}

function categoryColor(category: string) {
  return CATEGORY_COLORS[category] ?? 'bg-brand-100 text-brand-700'
}

export default function ShopCard({ shop }: Props) {
  return (
    <Link
      to={`/shops/${shop.id}`}
      className="card flex gap-3 hover:shadow-md hover:border-brand-200 transition-all duration-150 active:scale-[0.98]"
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
        {shop.imageUrl ? (
          <img
            src={shop.imageUrl}
            alt={shop.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center text-2xl font-bold ${categoryColor(shop.category)}`}>
            {shop.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 text-base leading-snug truncate">
              {shop.name}
            </h3>
            <span className="inline-block mt-0.5 text-xs font-medium text-brand-600 bg-brand-50 rounded-full px-2 py-0.5">
              {shop.category}
            </span>
          </div>
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {shop.description && (
          <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">{shop.description}</p>
        )}

        <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
          {/* button prevents <a>-inside-<a> invalid HTML; stopPropagation keeps card nav working */}
          <button
            type="button"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              window.open(
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.address}, ${shop.town}, Madhya Pradesh, India`)}`,
                '_blank',
                'noopener,noreferrer'
              )
            }}
            className="flex items-center gap-1 hover:text-brand-500 transition-colors bg-transparent border-0 p-0 cursor-pointer"
            aria-label="View on Google Maps"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{shop.town}</span>
          </button>
        </div>
      </div>
    </Link>
  )
}
