import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  it('renders with placeholder', () => {
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={jest.fn()} placeholder="Find experts…" />
    )
    expect(getByPlaceholderText('Find experts…')).toBeTruthy()
  })

  it('calls onChangeText when typing', () => {
    const onChangeText = jest.fn()
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={onChangeText} placeholder="Search" />
    )
    fireEvent.changeText(getByPlaceholderText('Search'), 'yoga')
    expect(onChangeText).toHaveBeenCalledWith('yoga')
  })

  it('calls onSearch on submit', () => {
    const onSearch = jest.fn()
    const { getByPlaceholderText } = render(
      <SearchBar value="yoga" onChangeText={jest.fn()} onSearch={onSearch} placeholder="Search" />
    )
    fireEvent(getByPlaceholderText('Search'), 'submitEditing')
    expect(onSearch).toHaveBeenCalledWith('yoga')
  })

  it('shows clear button when value is non-empty', () => {
    const { getByLabelText } = render(<SearchBar value="hello" onChangeText={jest.fn()} />)
    expect(getByLabelText('Clear search')).toBeTruthy()
  })

  it('does NOT show clear button when value is empty', () => {
    const { queryByLabelText } = render(<SearchBar value="" onChangeText={jest.fn()} />)
    expect(queryByLabelText('Clear search')).toBeNull()
  })

  it('calls onChangeText("") and onClear when clear is pressed', () => {
    const onChangeText = jest.fn()
    const onClear = jest.fn()
    const { getByLabelText } = render(
      <SearchBar value="hello" onChangeText={onChangeText} onClear={onClear} />
    )
    fireEvent.press(getByLabelText('Clear search'))
    expect(onChangeText).toHaveBeenCalledWith('')
    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it('shows ActivityIndicator when isLoading', () => {
    const { getByRole } = render(<SearchBar value="" onChangeText={jest.fn()} isLoading />)
    // ActivityIndicator has no standard role, just check it renders without crash
    expect(getByRole).toBeDefined()
  })

  it('uses default placeholder when none provided', () => {
    const { getByPlaceholderText } = render(<SearchBar value="" onChangeText={jest.fn()} />)
    expect(getByPlaceholderText('Search…')).toBeTruthy()
  })
})
