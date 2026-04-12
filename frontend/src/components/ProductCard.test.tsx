import { render, screen } from '@testing-library/react'
import ProductCard from './ProductCard'
import type { Product } from '../types'

const availableProduct: Product = {
  id: 1,
  name: 'Blue Cotton Shirt',
  description: "Men's regular fit",
  price: 599,
  isAvailable: true
}

const unavailableProduct: Product = {
  id: 2,
  name: 'Kids School Uniform',
  description: null,
  price: 350,
  isAvailable: false
}

describe('ProductCard', () => {
  test('renders product name', () => {
    render(<ProductCard product={availableProduct} />)
    expect(screen.getByText('Blue Cotton Shirt')).toBeInTheDocument()
  })

  test('renders price formatted in INR', () => {
    render(<ProductCard product={availableProduct} />)
    expect(screen.getByText('₹599')).toBeInTheDocument()
  })

  test('renders description when provided', () => {
    render(<ProductCard product={availableProduct} />)
    expect(screen.getByText("Men's regular fit")).toBeInTheDocument()
  })

  test('does not show Unavailable badge for available product', () => {
    render(<ProductCard product={availableProduct} />)
    expect(screen.queryByText('Unavailable')).not.toBeInTheDocument()
  })

  test('shows Unavailable badge for unavailable product', () => {
    render(<ProductCard product={unavailableProduct} />)
    expect(screen.getByText('Unavailable')).toBeInTheDocument()
  })

  test('renders without description gracefully', () => {
    render(<ProductCard product={unavailableProduct} />)
    expect(screen.getByText('Kids School Uniform')).toBeInTheDocument()
  })

  test('renders without price gracefully', () => {
    render(<ProductCard product={{ ...availableProduct, price: null }} />)
    expect(screen.getByText('Blue Cotton Shirt')).toBeInTheDocument()
    expect(screen.queryByText('₹')).not.toBeInTheDocument()
  })
})
