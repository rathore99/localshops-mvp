import { Link } from 'react-router-dom'
import type { Shop } from '../types'

interface Props {
  shop: Shop
}

export default function ShopCard({ shop }: Props) {
  return (
    <Link
      to={`/shops/${shop.id}`}
      className="card block hover:shadow-md hover:border-brand-200 transition-all duration-150 active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 text-base leading-snug truncate">
            {shop.name}
          </h3>
          <span className="inline-block mt-1 text-xs font-medium text-brand-600 bg-brand-50 rounded-full px-2 py-0.5">
            {shop.category}
          </span>
        </div>
        <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {shop.description && (
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{shop.description}</p>
      )}

      <div className="mt-3 flex items-center gap-1 text-xs text-gray-400">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>{shop.town}</span>
      </div>
    </Link>
  )
}
