import { describe, it, expect } from 'vitest'
import { useTableSorting } from '../use-table-sorting'

describe('useTableSorting', () => {
  it('has default empty sorting', () => {
    const { sorting } = useTableSorting()
    expect(sorting.value).toEqual([])
  })

  it('accepts custom default sorting', () => {
    const defaultSorting = [{ id: 'name', desc: false }]
    const { sorting } = useTableSorting(defaultSorting)
    expect(sorting.value).toEqual(defaultSorting)
  })

  it('sortingOptions includes getSortedRowModel', () => {
    const { sortingOptions } = useTableSorting()
    expect(sortingOptions.value.getSortedRowModel).toBeDefined()
  })

  it('clearSorting resets to empty array', () => {
    const { sorting, clearSorting } = useTableSorting([{ id: 'name', desc: true }])
    expect(sorting.value).toHaveLength(1)
    clearSorting()
    expect(sorting.value).toEqual([])
  })

  it('onSortingChange handles function updater', () => {
    const { sorting, sortingOptions } = useTableSorting()
    sortingOptions.value.onSortingChange(() => [{ id: 'age', desc: true }])
    expect(sorting.value).toEqual([{ id: 'age', desc: true }])
  })

  it('onSortingChange handles direct value updater', () => {
    const { sorting, sortingOptions } = useTableSorting()
    sortingOptions.value.onSortingChange([{ id: 'name', desc: false }])
    expect(sorting.value).toEqual([{ id: 'name', desc: false }])
  })
})