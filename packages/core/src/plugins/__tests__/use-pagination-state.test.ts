import { describe, it, expect } from 'vitest'
import { usePaginationState } from '../use-pagination-state'

describe('usePaginationState', () => {
  it('has default values (page=1, pageSize=10)', () => {
    const { page, pageSize } = usePaginationState()
    expect(page.value).toBe(1)
    expect(pageSize.value).toBe(10)
  })

  it('accepts custom defaults', () => {
    const { page, pageSize } = usePaginationState({ defaultPage: 3, defaultPageSize: 25 })
    expect(page.value).toBe(3)
    expect(pageSize.value).toBe(25)
  })

  it('setPage updates page', () => {
    const { page, setPage } = usePaginationState()
    setPage(5)
    expect(page.value).toBe(5)
  })

  it('setPageSize updates pageSize and resets page to 1', () => {
    const { page, pageSize, setPage, setPageSize } = usePaginationState()
    setPage(3)
    expect(page.value).toBe(3)
    setPageSize(50)
    expect(pageSize.value).toBe(50)
    expect(page.value).toBe(1)
  })

  it('paginationState converts page to 0-based pageIndex', () => {
    const { paginationState, setPage } = usePaginationState()
    expect(paginationState.value.pageIndex).toBe(0)
    setPage(3)
    expect(paginationState.value.pageIndex).toBe(2)
  })

  it('resetPagination restores defaults', () => {
    const { page, pageSize, setPage, setPageSize, resetPagination } = usePaginationState({
      defaultPage: 2,
      defaultPageSize: 20,
    })
    setPage(5)
    setPageSize(50)
    resetPagination()
    expect(page.value).toBe(2)
    expect(pageSize.value).toBe(20)
  })

  it('paginationOptions includes getPaginationRowModel', () => {
    const { paginationOptions } = usePaginationState()
    expect(paginationOptions.value.getPaginationRowModel).toBeDefined()
  })

  it('onPaginationChange handles function updater', () => {
    const { page, pageSize, paginationOptions } = usePaginationState()
    paginationOptions.value.onPaginationChange((prev: any) => ({
      ...prev,
      pageIndex: 4,
      pageSize: 25,
    }))
    expect(page.value).toBe(5)
    expect(pageSize.value).toBe(25)
  })

  it('onPaginationChange handles direct value updater', () => {
    const { page, pageSize, paginationOptions } = usePaginationState()
    paginationOptions.value.onPaginationChange({ pageIndex: 2, pageSize: 30 })
    expect(page.value).toBe(3)
    expect(pageSize.value).toBe(30)
  })
})