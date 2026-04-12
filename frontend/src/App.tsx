import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ShopDetail from './pages/ShopDetail'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shops/:id" element={<ShopDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
