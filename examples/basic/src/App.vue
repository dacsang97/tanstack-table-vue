<script setup lang="ts">
import { TSTable, defineColumns } from 'tanstack-table-vue'

type Person = {
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
</script>

<template>
  <TSTable :columns="columns" :data="defaultData">
    <template #cell-status="{ value }">
      <span class="px-2 py-1 rounded" :class="{
        'bg-green-100 text-green-700': value === 'In Relationship',
        'bg-yellow-100 text-yellow-700': value === 'Complicated',
        'bg-red-100 text-red-700': value === 'Single'
      }">
        {{ value }}
      </span>
    </template>
    <template #cell-progress="{ value }">
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: `${value}%` }"></div>
      </div>
    </template>
  </TSTable>
</template>
