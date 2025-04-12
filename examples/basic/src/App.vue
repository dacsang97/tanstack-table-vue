<script setup lang="ts">
import { TSTable } from 'tanstack-table-vue'
import { createColumnHelper, FlexRender, getCoreRowModel, getSortedRowModel, type Column } from '@tanstack/vue-table'
import Table from './components/ui/table/Table.vue'
import { TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from './components/ui/table'


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
  columnHelper.group({
    id: 'name',
    header: 'Name',
    columns: [
      columnHelper.accessor('firstName', {
        id: 'firstName',
      }),
      columnHelper.accessor('lastName', {
        id: 'lastName',
      }),
    ],
  }),
  columnHelper.group({
    id: 'info',
    header: 'Info',
    columns: [
      columnHelper.accessor('age', {
        id: 'age',
      }),
      columnHelper.group({
        id: 'moreInfo',
        header: 'More Info',
        columns: [
          columnHelper.accessor('visits', {
            id: 'visits',
          }),
          columnHelper.accessor('status', {
            id: 'status',
          }),
          columnHelper.accessor('progress', {
            id: 'progress',
          }),
        ],
      }),
    ],
  }),
]

const tableOptions = {
  getSortedRowModel: getSortedRowModel(),
  getCoreRowModel: getCoreRowModel(),
}
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">TSTable with Slots Example</h1>
    <TSTable :columns="columns" :data="defaultData" :tableOptions="tableOptions">

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
                <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                  :props="header.getContext()" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </template>
    </TSTable>
  </div>
</template>
