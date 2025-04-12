<script lang="ts">
import type { ColumnDef, RowData, Table } from '@tanstack/vue-table'

export interface TSTableProps<TData extends RowData & object> {
  columns: ColumnDef<TData>[]
  data: TData[]
  tableOptions?: Record<string, any>
}
</script>

<script setup lang="ts" generic="TData extends RowData & object">
import { computed, useSlots } from 'vue'
import { useVueTable, createColumnHelper, type ColumnDef as TStackColumnDef, getCoreRowModel } from '@tanstack/vue-table'
import { processColumns } from '../shared'

const props = defineProps<TSTableProps<TData>>()

const slots = useSlots()
const columnHelper = createColumnHelper<TData>()

const processedColumns = computed(() => {
  const initialTable = useVueTable<TData>({
    columns: props.columns as unknown as TStackColumnDef<TData>[],
    data: props.data,
    getCoreRowModel: getCoreRowModel(),
    ...props.tableOptions
  })
  return processColumns(columnHelper, props.columns, slots, initialTable)
})

const tableOptions = {
  columns: processedColumns.value,
  data: props.data,
  getCoreRowModel: getCoreRowModel(),
  ...props.tableOptions
}

const table = useVueTable<TData>(tableOptions)

defineSlots<{
  default: (props: {
    table: Table<TData>;
  }) => any;

  [key: `header-${string}`]: (props: any) => any;
  [key: `cell-${string}`]: (props: any) => any;
  [key: `footer-${string}`]: (props: any) => any;
}>()
</script>

<template>
  <slot :table="table" />
</template>