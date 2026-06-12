import { render } from '@testing-library/react-native'
import React from 'react'

import { PriceDisplay } from './PriceDisplay'

describe('PriceDisplay', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<PriceDisplay amount={500} />)
    expect(toJSON()).toBeTruthy()
  })

  it('shows the amount number somewhere in the output', () => {
    const { getByText } = render(<PriceDisplay amount={500} />)
    // Intl.NumberFormat output varies by Node ICU data; match just the number
    expect(getByText(/500/)).toBeTruthy()
  })

  it('shows discount badge when originalAmount provided', () => {
    // 800 from 1000 = 20% off
    const { getByText } = render(<PriceDisplay amount={800} originalAmount={1000} />)
    expect(getByText('%20')).toBeTruthy()
  })

  it('does not show discount badge when no originalAmount', () => {
    const { queryByText } = render(<PriceDisplay amount={800} />)
    expect(queryByText(/%\d+/)).toBeNull()
  })

  it('does not show discount badge when discount is 0%', () => {
    const { queryByText } = render(<PriceDisplay amount={1000} originalAmount={1000} />)
    expect(queryByText(/%\d+/)).toBeNull()
  })

  it('shows period when provided', () => {
    const { getByText } = render(<PriceDisplay amount={500} period="seans" />)
    expect(getByText('/seans')).toBeTruthy()
  })

  it('does not show period when not provided', () => {
    const { queryByText } = render(<PriceDisplay amount={500} />)
    expect(queryByText(/^\//)).toBeNull()
  })

  it('renders compact variant without crashing', () => {
    const { toJSON } = render(
      <PriceDisplay amount={500} variant="compact" originalAmount={700} period="seans" />
    )
    expect(toJSON()).toBeTruthy()
  })

  it('renders prominent variant without crashing', () => {
    const { toJSON } = render(<PriceDisplay amount={1500} variant="prominent" />)
    expect(toJSON()).toBeTruthy()
  })

  it('renders all sizes without crashing', () => {
    const sizes = ['sm', 'md', 'lg', 'xl'] as const
    sizes.forEach((size) => {
      const { unmount } = render(<PriceDisplay amount={100} size={size} />)
      unmount()
    })
  })

  it('renders all variants without crashing', () => {
    const variants = ['default', 'prominent', 'compact'] as const
    variants.forEach((variant) => {
      const { unmount } = render(<PriceDisplay amount={100} variant={variant} />)
      unmount()
    })
  })

  it('compact variant shows discount badge', () => {
    const { getByText } = render(
      <PriceDisplay amount={600} originalAmount={1000} variant="compact" />
    )
    expect(getByText('%40')).toBeTruthy()
  })

  it('shows strikethrough original amount', () => {
    const { getByText } = render(<PriceDisplay amount={800} originalAmount={1000} />)
    // Both amounts should appear in the tree
    expect(getByText(/800/)).toBeTruthy()
    expect(getByText(/1\.000|1000/)).toBeTruthy()
  })
})
