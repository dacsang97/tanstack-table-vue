# @tanstack-table-vue/core

Core package for TanStack Table Vue integration.

## Overview

This package contains the core functionality for integrating TanStack Table with Vue.js. It provides:

- TSTable component for rendering tables
- Column processing utilities
- Type definitions and helpers
- Slot management system

## Components

### TSTable

The main component that renders the table structure. It accepts:

- `columns`: Column definitions
- `data`: Table data
- `tableOptions`: TanStack Table options

```vue
<TSTable :columns="columns" :data="data" :tableOptions="tableOptions">
  <!-- Slots for customization -->
</TSTable>
```

## Utilities

### Column Processing

The package includes utilities for processing columns and managing slots:

- `processColumns`: Converts column definitions to TanStack Table format
- `getHeader`, `getCell`, `getFooter`: Slot management functions

### Types

```typescript
interface TSTableProps<TData extends RowData & object> {
  columns: ColumnDef<TData>[]
  data: TData[]
  tableOptions?: Record<string, any>
}
```

## Usage with Slots

The package provides a flexible slot system:

```vue
<TSTable :columns="columns" :data="data">
  <!-- Header slot -->
  <template #header-columnId="{ column }">
    Custom Header
  </template>

  <!-- Cell slot -->
  <template #cell-columnId="{ value, row }">
    Custom Cell
  </template>

  <!-- Footer slot -->
  <template #footer-columnId="{ column }">
    Custom Footer
  </template>
</TSTable>
```

## Internal Architecture

The package uses a slot-based system instead of render functions, making it more Vue-idiomatic. Key features:

- Automatic header generation from accessorKey
- Flexible slot naming based on column IDs
- Support for nested column groups
- Integration with TanStack Table's sorting, filtering, and other features

## Contributing

When contributing to this package, please:

1. Maintain type safety
2. Follow Vue.js best practices
3. Update tests for any new functionality
4. Document any public APIs

## License

MIT
