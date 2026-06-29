import { describe, it, expect } from 'vitest'
import { filterProducts, brandInitials } from '../lib/products'
import type { Product } from '../types'
import products from '../data/products.json'

const ALL = products as Product[]

describe('filterProducts', () => {
  const sample: Product[] = [
    { id: '1', department: 'Men', category: 'men-boxers', brand: 'Jockey', name: 'A', description: '', image: '' },
    { id: '2', department: 'Men', category: 'men-shorts', brand: 'Jockey', name: 'B', description: '', image: '' },
    { id: '3', department: 'Women', category: 'women-shorts', brand: 'Jockey', name: 'C', description: '', image: '' },
  ]

  it('filters by department', () => {
    expect(filterProducts(sample, 'Men').map((p) => p.id)).toEqual(['1', '2'])
    expect(filterProducts(sample, 'Women').map((p) => p.id)).toEqual(['3'])
  })

  it('filters by department + category', () => {
    expect(filterProducts(sample, 'Men', 'men-boxers').map((p) => p.id)).toEqual(['1'])
  })

  it('returns all in department when category is null', () => {
    expect(filterProducts(sample, 'Men', null)).toHaveLength(2)
  })

  it('works against the real dataset', () => {
    expect(filterProducts(ALL, 'Kids', 'kids-socks').length).toBeGreaterThan(0)
    expect(filterProducts(ALL, 'Men').every((p) => p.department === 'Men')).toBe(true)
  })
})

describe('brandInitials', () => {
  it('derives initials for placeholders', () => {
    expect(brandInitials('Van Heusen')).toBe('VH')
    expect(brandInitials('Jockey')).toBe('JO')
    expect(brandInitials('Enamor')).toBe('EN')
  })
})
