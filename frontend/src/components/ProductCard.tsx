import type { Product } from '../types'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  return (
    <div className={`card flex items-start gap-3 ${!product.isAvailable ? 'opacity-60' : ''}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
          {!product.isAvailable && (
            <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
              Unavailable
            </span>
          )}
        </div>
        {product.description && (
          <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{product.description}</p>
        )}
      </div>
      {product.price != null && (
        <span className="flex-shrink-0 text-sm font-semibold text-gray-800">
          ₹{product.price.toLocaleString('en-IN')}
        </span>
      )}
    </div>
  )
}
