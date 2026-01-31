import { describe, it, expect } from 'vitest'
import { useTableSelection } from '../use-table-selection'

describe('useTableSelection', () => {
  it('has default empty selection', () => {
    const { rowSelection } = useTableSelection()
    expect(rowSelection.value).toEqual({})
  })

  it('selectedCount computes correctly', () => {
    const { rowSelection, selectedCount } = useTableSelection()
    expect(selectedCount.value).toBe(0)
    rowSelection.value = { '0': true, '1': true, '2': false }
    expect(selectedCount.value).toBe(2)
  })

  it('clearSelection resets to empty object', () => {
    const { rowSelection, clearSelection } = useTableSelection()
    rowSelection.value = { '0': true, '1': true }
    clearSelection()
    expect(rowSelection.value).toEqual({})
  })

  it('selectionOptions enables row selection', () => {
    const { selectionOptions } = useTableSelection()
    expect(selectionOptions.value.enableRowSelection).toBe(true)
  })

  it('onRowSelectionChange handles function updater', () => {
    const { rowSelection, selectionOptions } = useTableSelection()
    selectionOptions.value.onRowSelectionChange(() => ({ '0': true, '3': true }))
    expect(rowSelection.value).toEqual({ '0': true, '3': true })
  })

  it('onRowSelectionChange handles direct value updater', () => {
    const { rowSelection, selectionOptions } = useTableSelection()
    selectionOptions.value.onRowSelectionChange({ '1': true })
    expect(rowSelection.value).toEqual({ '1': true })
  })
})