# TanStack Table Vue

> **No more render functions, just Vue!** — Simple, type-safe TanStack Table integration for Vue.js

TanStack Table Vue is a wrapper library that simplifies using TanStack Table (formerly React Table) with Vue.js. It eliminates the need for JSX and render functions by leveraging Vue's scoped slots and template system.

## 🌟 Features

- ✅ **No JSX Required** - Define columns with plain objects, not render functions
- ✅ **Vue Idiomatic** - Uses scoped slots and Vue template syntax
- ✅ **Type-Safe** - Full TypeScript support with generics
- ✅ **Flexible** - Supports all TanStack Table features including sorting, grouping, and more
- ✅ **Simple API** - Easy to understand and use
- ✅ **Lightweight** - Minimal abstraction over TanStack Table

## 📦 Installation

```bash
# npm
npm install tanstack-table-vue @tanstack/vue-table

# yarn
yarn add tanstack-table-vue @tanstack/vue-table

# pnpm
pnpm add tanstack-table-vue @tanstack/vue-table

# bun
bun add tanstack-table-vue @tanstack/vue-table
```

## 🚀 Quick Start

```vue
<script setup lang="ts">
import { TSTable } from 'tanstack-table-vue'
import { createColumnHelper, getCoreRowModel, getSortedRowModel } from '@tanstack/vue-table'

interface Person {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const data: Person[] = [
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
]

const columnHelper = createColumnHelper<Person>()

const columns = [
  columnHelper.group({
    id: 'name',
    header: 'Name',
    columns: [columnHelper.accessor('firstName', {}), columnHelper.accessor('lastName', {})],
  }),
  columnHelper.group({
    id: 'info',
    header: 'Info',
    columns: [
      columnHelper.accessor('age', {}),
      columnHelper.group({
        id: 'moreInfo',
        header: 'More Info',
        columns: [
          columnHelper.accessor('visits', {}),
          columnHelper.accessor('status', {}),
          columnHelper.accessor('progress', {}),
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
  <TSTable :columns="columns" :data="data" :tableOptions="tableOptions">
    <!-- Custom header rendering with sorting -->
    <template #header-firstName="{ column }">
      <div class="flex items-center cursor-pointer" @click="column.toggleSorting()">
        <span class="font-bold">First Name</span>
        <span v-if="column.getIsSorted() === 'desc'">🔽</span>
        <span v-else-if="column.getIsSorted() === 'asc'">🔼</span>
        <span v-else>⏺️</span>
      </div>
    </template>

    <!-- Custom cell rendering -->
    <template #cell-status="{ value }">
      <span class="px-2 py-1 rounded text-xs font-medium" :class="getStatusClass(value)">
        {{ value }}
      </span>
    </template>
  </TSTable>
</template>
```

### Available Slots

Customize your table with these scoped slots:

- `#cell-{columnId}="{ value, row, cell }"` - Custom cell rendering
- `#header-{columnId}="{ column, header }"` - Custom header rendering with sorting support
- `#footer-{columnId}="{ column, footer }"` - Custom footer rendering

## 🔄 Column Definition

The library supports two ways to define columns:

1. Using `columnHelper.accessor`:

```typescript
// Simple accessor
columnHelper.accessor('firstName', {})

// With group
columnHelper.group({
  id: 'name',
  header: 'Name',
  columns: [columnHelper.accessor('firstName', {}), columnHelper.accessor('lastName', {})],
})
```

2. Using `columnHelper.display` for custom columns:

```typescript
columnHelper.display({
  id: 'actions',
  cell: () => 'Actions',
})
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

[MIT](LICENSE)
