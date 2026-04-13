// TODO [Feature 2]: Wire this to GET /api/v1/products/search?q= when implemented.
// Currently disabled — search API not yet available.

export default function SearchBar() {
  return (
    <div className="space-y-2">
      <div className="flex gap-2 opacity-60 cursor-not-allowed">
        <input
          type="search"
          disabled
          placeholder="Search for a product or brand..."
          className="flex-1 rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm
                     placeholder-gray-400 cursor-not-allowed min-h-[48px]"
          aria-label="Search products"
        />
        <button
          disabled
          className="px-6 rounded-xl bg-gray-300 text-gray-500 font-semibold text-sm
                     min-h-[48px] min-w-[48px] cursor-not-allowed"
          aria-label="Search"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
      {/* Feature 2 coming-soon label */}
      <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
        🔧 Product search coming soon — browse shops below for now
      </p>
    </div>
  )
}
