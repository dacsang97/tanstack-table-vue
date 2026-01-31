<script lang="ts">
import type { ColumnDef, RowData, Table, TableOptionsWithReactiveData } from '@tanstack/vue-table'
import type { CellSlotProps, FooterSlotProps, HeaderSlotProps } from '../shared/types'

export type TableOptions = Omit<TableOptionsWithReactiveData<any>, 'columns' | 'data' | 'getCoreRowModel'>

export interface TSTableProps<TData extends RowData & object> {
  columns: ColumnDef<TData, any>[]
  data: TData[]
  tableOptions?: TableOptions
}
</script>

<script setup lang="ts" generic="TData extends RowData & object">
import { computed, useSlots } from 'vue'
import { useVueTable, createColumnHelper, getCoreRowModel } from '@tanstack/vue-table'
import { processColumns } from '../shared'

const props = defineProps<TSTableProps<TData>>()

const slots = useSlots()
const columnHelper = createColumnHelper<TData>()

// Use memo pattern for expensive column processing
const processedColumns = computed(() => {
  return processColumns(columnHelper, props.columns, slots)
})

// Initialize table with reactive getters for data and columns
// This is the recommended approach for TanStack Table Vue v8.20.0+
const table = useVueTable<TData>({
  get columns() {
    return processedColumns.value
  },
  get data() {
    return props.data
  },
  getCoreRowModel: getCoreRowModel(),
  ...props.tableOptions,
})

defineSlots<{
  default: (props: { table: Table<TData> }) => any

  [key: `header-${string}`]: (props: HeaderSlotProps<TData>) => any
  [key: `cell-${string}`]: (props: CellSlotProps<TData>) => any
  [key: `footer-${string}`]: (props: FooterSlotProps<TData>) => any
}>()
</script>

<template>
  <slot :table="table" />
</template>