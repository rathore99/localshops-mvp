import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ShopCard from './ShopCard'
import type { Shop } from '../types'

const mockShop: Shop = {
  id: 1,
  name: 'Shri Fashion',
  category: 'Apparel',
  phone: '9876543210',
  address: 'Main Road, Singrauli',
  town: 'Singrauli',
  description: 'Ready-to-wear kurtas and shirts'
}

function renderShopCard(shop: Shop = mockShop) {
  return render(
    <BrowserRouter>
      <ShopCard shop={shop} />
    </BrowserRouter>
  )
}

describe('ShopCard', () => {
  test('renders shop name', () => {
    renderShopCard()
    expect(screen.getByText('Shri Fashion')).toBeInTheDocument()
  })

  test('renders shop category', () => {
    renderShopCard()
    expect(screen.getByText('Apparel')).toBeInTheDocument()
  })

  test('renders shop description when provided', () => {
    renderShopCard()
    expect(screen.getByText('Ready-to-wear kurtas and shirts')).toBeInTheDocument()
  })

  test('renders town name', () => {
    renderShopCard()
    expect(screen.getByText('Singrauli')).toBeInTheDocument()
  })

  test('links to correct shop detail page', () => {
    renderShopCard()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/shops/1')
  })

  test('renders without description gracefully', () => {
    renderShopCard({ ...mockShop, description: null })
    expect(screen.getByText('Shri Fashion')).toBeInTheDocument()
    expect(screen.queryByText('Ready-to-wear')).not.toBeInTheDocument()
  })
})
