<script setup lang="ts">
import { TSTable, defineColumns } from 'tanstack-table-vue'
import { FlexRender, getCoreRowModel, getSortedRowModel, type Column } from '@tanstack/vue-table'

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

const columns = defineColumns<Person>([
  {
    id: 'name',
    header: 'Name',
    columns: [
      {
        id: 'firstName',
        header: 'First Name'
      },
      {
        id: 'lastName',
        header: 'Last Name'
      },
    ]
  },
  {
    id: 'info',
    header: 'Info',
    columns: [
      {
        id: 'age',
        header: 'Age'
      },
      {
        id: 'visits',
        header: 'Visits'
      },
    ]
  },
  {
    id: 'status',
    header: 'Status'
  },
  {
    id: 'progress',
    header: 'Profile Progress'
  }
])

const tableOptions = {
  getSortedRowModel: getSortedRowModel(),
  getCoreRowModel: getCoreRowModel(),
}
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">TSTable with Slots Example</h1>
    <TSTable :columns="columns" :data="defaultData" :tableOptions="tableOptions">

      <!-- Sử dụng TSTable với slots -->
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

      <!-- Định nghĩa slot cell -->
      <template #cell-status="{ value }">
        <span class="px-2 py-1 rounded text-xs font-medium inline-block" :class="getStatusClass(value)">
          {{ value }}
        </span>
      </template>

      <!-- Main table layout -->
      <template #default="{ table }">

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
      </template>
    </TSTable>
  </div>
</template>
