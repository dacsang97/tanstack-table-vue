<script lang="ts">
export interface TSTableProps<TData extends object> {
  data: TData[]
  columns: ColumnDef<TData>[]

  /**
   * Custom components for the table
   */
  tableComponent?: string | object
  theadComponent?: string | object
  tbodyComponent?: string | object
  tfootComponent?: string | object
  trComponent?: string | object
  thComponent?: string | object
  tdComponent?: string | object
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

const props = withDefaults(defineProps<TSTableProps<TData>>(), {
  tableComponent: 'table',
  theadComponent: 'thead',
  tbodyComponent: 'tbody',
  tfootComponent: 'tfoot',
  trComponent: 'tr',
  thComponent: 'th',
  tdComponent: 'td'
})

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
    <component :is="props.tableComponent">
      <component :is="props.theadComponent">
        <component :is="props.trComponent" v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <component :is="props.thComponent" v-for="header in headerGroup.headers" :key="header.id"
            :colSpan="header.colSpan">
            <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
              :props="header.getContext()" />
          </component>
        </component>
      </component>
      <component :is="props.tbodyComponent">
        <component :is="props.trComponent" v-for="row in table.getRowModel().rows" :key="row.id">
          <component :is="props.tdComponent" v-for="cell in row.getVisibleCells()" :key="cell.id">
            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
          </component>
        </component>
      </component>
      <component :is="props.tfootComponent" v-if="table.getFooterGroups().some(group =>
        group.headers.some(header =>
          !header.isPlaceholder && header.column.columnDef.footer
        )
      )">
        <component :is="props.trComponent" v-for="footerGroup in table.getFooterGroups()" :key="footerGroup.id">
          <component :is="props.thComponent" v-for="header in footerGroup.headers" :key="header.id"
            :colSpan="header.colSpan">
            <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.footer"
              :props="header.getContext()" />
          </component>
        </component>
      </component>
    </component>
  </div>
</template>