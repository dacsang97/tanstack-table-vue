# TanStack Table Vue

> **No more render functions, just Vue!** — Simple, type-safe TanStack Table integration for Vue.js

TanStack Table Vue is a wrapper library that simplifies using TanStack Table (formerly React Table) with Vue.js. It eliminates the need for JSX and render functions by leveraging Vue's scoped slots and template system.

## 🌟 Features

- ✅ **No JSX Required** - Define columns with plain objects, not render functions
- ✅ **Vue Idiomatic** - Uses scoped slots and Vue template syntax
- ✅ **Type-Safe** - Full TypeScript support with generics
- ✅ **Flexible** - Supports all TanStack Table features
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
import { TSTable, defineColumns } from 'tanstack-table-vue'

interface Person {
  firstName: string
  lastName: string
  age: number
}

const data: Person[] = [
  { firstName: 'John', lastName: 'Doe', age: 30 },
  { firstName: 'Jane', lastName: 'Smith', age: 25 },
]

const columns = defineColumns<Person>([
  {
    id: 'firstName',
    header: 'First Name',
  },
  {
    id: 'lastName',
    header: 'Last Name',
  },
  {
    id: 'age',
    header: 'Age',
  },
  {
    id: 'actions',
    header: 'Actions',
  },
]
</script>

<template>
  <TSTable :data="data" :columns="columns">
    <!-- Custom cell rendering with scoped slots -->
    <template #cell-age="{ value }">
      <span :class="value > 25 ? 'text-red' : 'text-green'"> {{ value }} years old </span>
    </template>

    <!-- Actions column with custom rendering -->
    <template #cell-actions="{ row }">
      <button @click="editPerson(row.original)">Edit</button>
      <button @click="deletePerson(row.original)">Delete</button>
    </template>
  </TSTable>
</template>
```

### Available Slots

Customize your table with these scoped slots:

- `#cell-{columnId}="{ value, row, info }"` - Custom cell rendering
- `#header-{columnId}="{ header }"` - Custom header rendering
- `#footer-{columnId}="{ footer }"` - Custom footer rendering

## 🔄 Migration from JSX

Before:

```typescript
// Using JSX and render functions
columnHelper.accessor('firstName', {
  header: () => <span>First Name</span>,
  cell: (info) =>
    h(CustomComponent, {
      props: {
        value: info.getValue(),
      },
    }),
  footer: (props) => props.column.id,
})
```

After:

```typescript
// Using plain objects
{
  id: 'firstName',
}

// And in your template
<template #header-firstName>
  <span>First Name</span>
</template>
<template #cell-firstName="{ value }">
  <CustomComponent>{{ value }}</CustomComponent>
</template>
<template #footer-firstName="{ column }">
  <span>{{ column.id }}</span>
</template>
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

[MIT](LICENSE)
