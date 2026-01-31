import type {
  ColumnHelper,
  HeaderContext,
  CellContext,
  RowData,
  ColumnDef as TStackColumnDef,
  ColumnDef,
  Updater,
} from '@tanstack/vue-table'
import type { Ref, Slots } from 'vue'
import capitalize from 'lodash.capitalize'

/** Helper to apply TanStack Table updater functions to Vue refs */
export function valueUpdater<T>(updaterOrValue: Updater<T>, ref: Ref<T>): void {
  ref.value = typeof updaterOrValue === 'function' ? (updaterOrValue as (old: T) => T)(ref.value) : updaterOrValue
}

const getHeader = <TData extends RowData & object>(
  col: ColumnDef<TData, any>,
  slots: Readonly<Slots>,
  context: HeaderContext<TData, any>,
) => {
  const columnId = col.id || (col as any).accessorKey || ''
  const slotName = `header-${columnId}`

  // Check slot first
  if (slots[slotName]) {
    return slots[slotName]({
      column: context.column,
      context,
    })
  }

  // Then use header prop if provided
  if (col.header) {
    return col.header
  }

  // Finally fallback to capitalized id
  return capitalize(columnId.split('-').join(' '))
}

const getFooter = <TData extends RowData & object>(
  col: ColumnDef<TData, any>,
  slots: Readonly<Slots>,
  context: HeaderContext<TData, any>,
) => {
  const columnId = col.id || (col as any).accessorKey || ''
  const slotName = `footer-${columnId}`

  // Check slot first
  if (slots[slotName]) {
    return slots[slotName]({
      column: context.column,
      context,
    })
  }

  // Then use footer prop if provided
  if (col.footer) {
    return col.footer
  }

  return undefined
}

const getCell = <TData extends RowData & object>(
  col: ColumnDef<TData, any>,
  slots: Readonly<Slots>,
  context: CellContext<TData, any>,
) => {
  const columnId = col.id || (col as any).accessorKey || ''
  const slotName = `cell-${columnId}`

  // Check slot first
  if (slots[slotName]) {
    return slots[slotName]({
      cell: context.cell,
      row: context.row,
      value: context.getValue(),
    })
  }

  // Then handle cell value
  const value = context.getValue()
  if (col.cell) {
    return typeof col.cell === 'function' ? col.cell(context) : col.cell
  }
  return value !== undefined && value !== null ? value : '-'
}

export const processColumns = <TData extends RowData & object>(
  columnHelper: ColumnHelper<TData>,
  columns: ColumnDef<TData, any>[],
  slots: Readonly<Slots>,
): TStackColumnDef<TData, any>[] => {
  return columns.map((col): TStackColumnDef<TData, any> => {
    // Handle group columns by checking if columns property exists
    if ('columns' in col && Array.isArray(col.columns)) {
      return columnHelper.group({
        id: col.id || String(Math.random()),
        header: (context: HeaderContext<TData, any>) => getHeader(col, slots, context),
        footer: col.footer ? (context: HeaderContext<TData, any>) => getFooter(col, slots, context) : undefined,
        columns: processColumns(columnHelper, col.columns as ColumnDef<TData, any>[], slots),
        meta: col.meta,
      })
    }

    // Handle accessor columns
    const accessorCol = col as any
    if (accessorCol.accessorKey) {
      return columnHelper.accessor(accessorCol.accessorKey, {
        id: accessorCol.id || accessorCol.accessorKey,
        header: (context: HeaderContext<TData, any>) => getHeader(col, slots, context),
        footer: col.footer ? (context: HeaderContext<TData, any>) => getFooter(col, slots, context) : undefined,
        cell: (context: CellContext<TData, any>) => getCell(col, slots, context),
        meta: col.meta,
      })
    }

    if (accessorCol.accessorFn) {
      return columnHelper.accessor(accessorCol.accessorFn, {
        id: accessorCol.id || String(Math.random()),
        header: (context: HeaderContext<TData, any>) => getHeader(col, slots, context),
        footer: col.footer ? (context: HeaderContext<TData, any>) => getFooter(col, slots, context) : undefined,
        cell: (context: CellContext<TData, any>) => getCell(col, slots, context),
        meta: col.meta,
      })
    }

    // Default case - treat as display column
    return columnHelper.display({
      id: col.id || String(Math.random()),
      header: (context: HeaderContext<TData, any>) => getHeader(col, slots, context),
      footer: col.footer ? (context: HeaderContext<TData, any>) => getFooter(col, slots, context) : undefined,
      cell: (context: CellContext<TData, any>) => getCell(col, slots, context),
      meta: col.meta,
    })
  })
}