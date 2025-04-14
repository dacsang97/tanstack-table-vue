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
import { computed, useSlots, watch } from 'vue'
import { useVueTable, createColumnHelper, getCoreRowModel } from '@tanstack/vue-table'
import { processColumns } from '../shared'

const props = defineProps<TSTableProps<TData>>()

const slots = useSlots()
const columnHelper = createColumnHelper<TData>()

// Use memo pattern for expensive column processing
const processedColumns = computed(() => {
  return processColumns(columnHelper, props.columns, slots)
})

// Create initial table options
const initialTableOptions = {
  columns: processedColumns.value,
  data: props.data,
  getCoreRowModel: getCoreRowModel(),
  ...props.tableOptions
}

// Initialize table with initial options
const table = useVueTable<TData>(initialTableOptions)

// Watch for data changes and update table efficiently
watch(() => props.data, (newData) => {
  table.setOptions((old) => ({
    ...old,
    data: newData,
  }))
}, { flush: 'sync' })

// Watch columns separately to avoid unnecessary recalculations
watch(processedColumns, (newColumns) => {
  table.setOptions((old) => ({
    ...old,
    columns: newColumns,
  }))
}, { flush: 'sync' })

defineSlots<{
  default: (props: {
    table: Table<TData>;
  }) => any;

  [key: `header-${string}`]: (props: HeaderSlotProps<TData>) => any;
  [key: `cell-${string}`]: (props: CellSlotProps<TData>) => any;
  [key: `footer-${string}`]: (props: FooterSlotProps<TData>) => any;
}>()
</script>

<template>
  <slot :table="table" />
</template>