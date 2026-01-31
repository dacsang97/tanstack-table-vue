<script setup lang="ts">
import { TSTable } from 'tanstack-table-vue'
import { useTableSorting } from 'tanstack-table-vue/plugins'
import { createColumnHelper, FlexRender, type Column } from '@tanstack/vue-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table'
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

interface Person {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const defaultData: Person[] = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
]

const { data, isLoading } = useQuery({
  queryKey: ['people'],
  queryFn: async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return defaultData
  },
})

const persons = computed(() => data.value ?? [])

// Use the sorting composable from plugins
const { sortingOptions } = useTableSorting()

const tableOptions = computed(() => ({
  ...sortingOptions.value,
}))

function getSortIcon(column: Column<Person>) {
  if (!column.getCanSort?.()) return null

  if (column.getIsSorted() === 'desc') {
    return ' 🔽'
  } else if (column.getIsSorted() === 'asc') {
    return ' 🔼'
  }
  return ' ⏺️'
}

function getStatusClass(status: string) {
  switch (status) {
    case 'In Relationship':
      return 'bg-green-100 text-green-800'
    case 'Single':
      return 'bg-red-100 text-red-800'
    case 'Complicated':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const columnHelper = createColumnHelper<Person>()

const columns = [
  columnHelper.display({
    id: 'avatar',
    header: 'Avatar',
  }),
  columnHelper.accessor('firstName', {
    meta: { enableSorting: true },
  }),
  columnHelper.accessor('lastName', {
    meta: { enableSorting: true },
  }),
  columnHelper.accessor('age', {
    meta: { size: 80 },
  }),
  columnHelper.group({
    id: 'info',
    header: 'Info',
    columns: [
      columnHelper.group({
        id: 'moreInfo',
        header: 'More Info ',
        columns: [
          columnHelper.accessor('visits', {}),
          columnHelper.accessor('status', {}),
          columnHelper.accessor('progress', {}),
        ],
      }),
    ],
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
  }),
]
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">TSTable with Slots Example</h1>
    <TSTable :columns="columns" :data="persons" :tableOptions="tableOptions">
      <template #header-firstName="{ column }">
        <div class="flex items-center cursor-pointer" @click="column.toggleSorting()">
          <span class="font-bold">First Name</span>
          <span>{{ getSortIcon(column) }}</span>
        </div>
      </template>

      <template #header-lastName="{ column }">
        <div class="flex items-center cursor-pointer" @click="column.toggleSorting()">
          <span class="font-bold">Last Name</span>
          <span>{{ getSortIcon(column) }}</span>
        </div>
      </template>

      <template #cell-status="{ value }">
        <span class="px-2 py-1 rounded text-xs font-medium inline-block" :class="getStatusClass(value)">
          {{ value }}
        </span>
      </template>

      <template #default="{ table }">
        <Table>
          <TableHeader>
            <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
              <TableHead v-for="header in headerGroup.headers" :key="header.id" :colSpan="header.colSpan">
                <FlexRender
                  v-if="!header.isPlaceholder"
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-if="isLoading" v-for="i in 5" :key="`skeleton-${i}`">
              <TableCell v-for="j in table.getAllLeafColumns().length" :key="`cell-${i}-${j}`" class="py-3">
                <div class="h-5 w-full bg-muted rounded animate-pulse"></div>
              </TableCell>
            </TableRow>
            <template v-else-if="table.getRowModel().rows?.length">
              <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </TableCell>
              </TableRow>
            </template>
            <TableRow v-else>
              <TableCell colspan="100%" class="h-24 text-center">No results.</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </template>
    </TSTable>
  </div>
</template>