import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ShopDetail from './pages/ShopDetail'
import SearchResults from './pages/SearchResults'
import NotFound from './pages/NotFound'

// Feature 3 — Reserve page will be added when POST /api/v1/reservations is implemented

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shops/:id" element={<ShopDetail />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
