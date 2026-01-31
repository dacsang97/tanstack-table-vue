import { ref, computed } from 'vue'
import type { RowSelectionState } from '@tanstack/vue-table'
import { valueUpdater } from '../shared/utils'

export function useTableSelection() {
  const rowSelection = ref<RowSelectionState>({})

  const selectionOptions = computed(() => ({
    enableRowSelection: true,
    onRowSelectionChange: (updater: any) => valueUpdater(updater, rowSelection),
    state: {
      get rowSelection() {
        return rowSelection.value
      },
    },
  }))

  const selectedCount = computed(() => Object.values(rowSelection.value).filter(Boolean).length)
  const clearSelection = () => {
    rowSelection.value = {}
  }

  return { rowSelection, selectionOptions, selectedCount, clearSelection }
}