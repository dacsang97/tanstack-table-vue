import { ref, computed } from 'vue'
import type { SortingState } from '@tanstack/vue-table'
import { getSortedRowModel } from '@tanstack/vue-table'
import { valueUpdater } from '../shared/utils'

export function useTableSorting(defaultSorting?: SortingState) {
  const sorting = ref<SortingState>(defaultSorting ?? [])

  const sortingOptions = computed(() => ({
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: (updater: any) => valueUpdater(updater, sorting),
    state: {
      get sorting() {
        return sorting.value
      },
    },
  }))

  const clearSorting = () => {
    sorting.value = []
  }

  return { sorting, sortingOptions, clearSorting }
}