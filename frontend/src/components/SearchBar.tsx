import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
  initialValue?: string
}

export default function SearchBar({ initialValue = '' }: Props) {
  const [query, setQuery] = useState(initialValue)
  const navigate = useNavigate()

  function handleSearch() {
    const q = query.trim()
    if (q.length === 0) return
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="flex gap-2">
      <input
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSearch()}
        placeholder="Search for a product or brand..."
        className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm
                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400
                   focus:border-transparent min-h-[48px]"
        aria-label="Search products"
      />
      <button
        onClick={handleSearch}
        disabled={query.trim().length === 0}
        className="px-5 rounded-xl bg-brand-500 text-white font-semibold text-sm
                   min-h-[48px] min-w-[48px] hover:bg-brand-600 active:bg-brand-700
                   disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
                   transition-colors"
        aria-label="Search"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  )
}
