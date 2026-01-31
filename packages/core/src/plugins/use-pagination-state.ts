import { ref, computed } from 'vue'
import type { PaginationState } from '@tanstack/vue-table'
import { getPaginationRowModel } from '@tanstack/vue-table'

export function usePaginationState(options?: { defaultPage?: number; defaultPageSize?: number }) {
  const page = ref(options?.defaultPage ?? 1)
  const pageSize = ref(options?.defaultPageSize ?? 10)

  const paginationState = computed<PaginationState>(() => ({
    pageIndex: page.value - 1,
    pageSize: pageSize.value,
  }))

  const paginationOptions = computed(() => ({
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: (updater: any) => {
      const newState = typeof updater === 'function' ? updater(paginationState.value) : updater
      page.value = newState.pageIndex + 1
      pageSize.value = newState.pageSize
    },
    state: {
      get pagination() {
        return paginationState.value
      },
    },
  }))

  const setPage = (p: number) => {
    page.value = p
  }
  const setPageSize = (s: number) => {
    pageSize.value = s
    page.value = 1
  }
  const resetPagination = () => {
    page.value = options?.defaultPage ?? 1
    pageSize.value = options?.defaultPageSize ?? 10
  }

  return { page, pageSize, paginationState, paginationOptions, setPage, setPageSize, resetPagination }
}