import { render } from '@testing-library/react-native'
import React from 'react'

import { StatCard } from './StatCard'

describe('StatCard', () => {
  it('renders value and label', () => {
    const { getByText } = render(<StatCard value={48} label="Aktif Danışan" />)
    expect(getByText(/48/)).toBeTruthy()
    expect(getByText('Aktif Danışan')).toBeTruthy()
  })

  it('renders string value', () => {
    const { getByText } = render(<StatCard value="4.9" label="Puan" />)
    expect(getByText('4.9')).toBeTruthy()
  })

  it('renders subLabel when provided', () => {
    const { getByText } = render(<StatCard value={48} label="Seans" subLabel="Bu ay" />)
    expect(getByText('Bu ay')).toBeTruthy()
  })

  it('does not render subLabel when not provided', () => {
    const { queryByText } = render(<StatCard value={48} label="Seans" />)
    expect(queryByText('Bu ay')).toBeNull()
  })

  it('renders upward trend with + sign', () => {
    const { getByText } = render(
      <StatCard value={48} label="Seans" trend={{ value: 12, direction: 'up' }} />
    )
    expect(getByText('+12%')).toBeTruthy()
  })

  it('renders downward trend without + sign', () => {
    const { getByText } = render(
      <StatCard value={48} label="Seans" trend={{ value: -5, direction: 'down' }} />
    )
    expect(getByText('-5%')).toBeTruthy()
  })

  it('renders neutral trend', () => {
    const { getByText } = render(
      <StatCard value={48} label="Seans" trend={{ value: 0, direction: 'neutral' }} />
    )
    expect(getByText('0%')).toBeTruthy()
  })

  it('renders icon slot when icon is provided', () => {
    const { toJSON } = render(<StatCard value={48} label="Seans" icon={<React.Fragment />} />)
    expect(toJSON()).toBeTruthy()
  })

  it('renders accentColor border via style', () => {
    const { UNSAFE_getAllByType } = render(
      <StatCard value={10} label="Test" accentColor="#5C4FD6" />
    )
    const { View } = require('react-native')
    const [card] = UNSAFE_getAllByType(View)
    expect(card!.props.style).toMatchObject({ borderLeftColor: '#5C4FD6' })
  })

  it('renders all sizes without crashing', () => {
    const sizes = ['sm', 'md', 'lg'] as const
    sizes.forEach((size) => {
      const { unmount } = render(<StatCard value={10} label="Test" size={size} />)
      unmount()
    })
  })
})
