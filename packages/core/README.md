# tanstack-table-vue

Vue 3 wrapper for TanStack Table with slot-based rendering and headless composables.

## Installation

```bash
pnpm add tanstack-table-vue
```

## Core — `TSTable` Component

```vue
<script setup lang="ts">
import { TSTable } from 'tanstack-table-vue'
import type { ColumnDef } from '@tanstack/vue-table'

interface User {
  name: string
  age: number
}

const columns: ColumnDef<User, any>[] = [{ accessorKey: 'name' }, { accessorKey: 'age' }]
const data: User[] = [{ name: 'Alice', age: 30 }]
</script>

<template>
  <TSTable :columns="columns" :data="data" v-slot="{ table }">
    <!-- render table using the table instance -->
  </TSTable>
</template>
```

### Slots

- `#header-{columnId}` — custom header: `{ column, context }`
- `#cell-{columnId}` — custom cell: `{ row, value, context }`
- `#footer-{columnId}` — custom footer: `{ column, context }`

### Typed Column Meta

Column `meta` is typed via `TSTableColumnMeta`:

```ts
const columns: ColumnDef<User, any>[] = [
  {
    accessorKey: 'name',
    meta: { size: 200, enableSorting: true, headerClass: 'font-bold' },
  },
]
```

Available meta fields: `size`, `style`, `enableSorting`, `headerClass`, `cellClass`.

## Plugins — Headless Composables

Import from the `tanstack-table-vue/plugins` subpath:

```ts
import { usePaginationState, useTableSorting, useTableSelection } from 'tanstack-table-vue/plugins'
```

### `usePaginationState(options?)`

Manages 1-based page state and provides TanStack-compatible pagination options.

```ts
const { page, pageSize, paginationState, paginationOptions, setPage, setPageSize, resetPagination } =
  usePaginationState({ defaultPage: 1, defaultPageSize: 10 })
```

Spread `paginationOptions.value` into your `tableOptions` prop.

### `useTableSorting(defaultSorting?)`

Manages sorting state with a pre-configured sorted row model.

```ts
const { sorting, sortingOptions, clearSorting } = useTableSorting([{ id: 'name', desc: false }])
```

### `useTableSelection()`

Manages row selection state.

```ts
const { rowSelection, selectionOptions, selectedCount, clearSelection } = useTableSelection()
```

### Combining Plugins

```ts
const { paginationOptions } = usePaginationState()
const { sortingOptions } = useTableSorting()
const { selectionOptions } = useTableSelection()

const tableOptions = computed(() => ({
  ...paginationOptions.value,
  ...sortingOptions.value,
  ...selectionOptions.value,
}))
```

```vue
<TSTable :columns="columns" :data="data" :tableOptions="tableOptions" v-slot="{ table }">
  <!-- render -->
</TSTable>
```

## Utilities

```ts
import { valueUpdater, processColumns } from 'tanstack-table-vue'
```

- `valueUpdater(updaterOrValue, ref)` — apply TanStack updater functions to Vue refs
- `processColumns(columnHelper, columns, slots)` — process column definitions with slot integration

## License

MIT