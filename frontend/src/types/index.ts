export interface Shop {
  id: number
  name: string
  category: string
  phone: string
  address: string
  town: string
  description: string | null
  imageUrl: string | null
}

export interface Product {
  id: number
  name: string
  description: string | null
  price: number | null
  isAvailable: boolean
}

export interface ShopDetail extends Shop {
  products: Product[]
}
