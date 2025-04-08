<script lang="ts">
export interface TSTableProps<TData extends object> {
  data: TData[]
  columns: ColumnDef<TData>[]
}
</script>

<script setup lang="ts" generic="TData extends object">
import type { ColumnDef, HeaderSlotProps, CellSlotProps, FooterSlotProps } from '../shared/types'
import { computed, useSlots } from 'vue'
import { FlexRender } from '@tanstack/vue-table'
import {
  createColumnHelper,
  useVueTable,
  getCoreRowModel,
} from '@tanstack/vue-table'
import { processColumns } from '../shared/utils';

const props = defineProps<TSTableProps<TData>>()

defineSlots<{
  [key: `cell-${string}`]: (props: CellSlotProps<TData>) => any;
  [key: `header-${string}`]: (props: HeaderSlotProps<TData>) => any;
  [key: `footer-${string}`]: (props: FooterSlotProps<TData>) => any;
}>()

const slots = useSlots()

const columnHelper = createColumnHelper<TData>()

const tableColumns = computed(() => {
  return processColumns(columnHelper, props.columns, slots)
})

const table = useVueTable<TData>({
  get data() {
    return props.data
  },
  get columns() {
    return tableColumns.value
  },
  getCoreRowModel: getCoreRowModel()
})
</script>

<template>
  <div class="p-2">
    <table>
      <thead>
        <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <th v-for="header in headerGroup.headers" :key="header.id" :colSpan="header.colSpan">
            <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
              :props="header.getContext()" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.getRowModel().rows" :key="row.id">
          <td v-for="cell in row.getVisibleCells()" :key="cell.id">
            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr v-for="footerGroup in table.getFooterGroups()" :key="footerGroup.id">
          <th v-for="header in footerGroup.headers" :key="header.id" :colSpan="header.colSpan">
            <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.footer"
              :props="header.getContext()" />
          </th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>