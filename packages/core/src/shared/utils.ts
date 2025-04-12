import type {
  ColumnHelper,
  HeaderContext,
  CellContext,
  RowData,
  ColumnDef as TStackColumnDef,
  Table,
  ColumnDef,
} from '@tanstack/vue-table'
import type { Slots } from 'vue'
import capitalize from 'lodash.capitalize'

const getHeader = <TData extends RowData & object>(
  col: ColumnDef<TData>,
  slots: Readonly<Slots>,
  context: HeaderContext<TData, unknown>,
) => {
  const columnId = (col as any).accessorKey || col.id || ''
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
  col: ColumnDef<TData>,
  slots: Readonly<Slots>,
  context: HeaderContext<TData, unknown>,
) => {
  const columnId = (col as any).accessorKey || col.id || ''
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
  col: ColumnDef<TData>,
  slots: Readonly<Slots>,
  context: CellContext<TData, unknown>,
) => {
  const columnId = (col as any).accessorKey || col.id || ''
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
  columns: ColumnDef<TData>[],
  slots: Readonly<Slots>,
  table: Table<TData>,
): TStackColumnDef<TData>[] => {
  return columns.map((col): TStackColumnDef<TData> => {
    // Handle group columns by checking if columns property exists
    if ('columns' in col && Array.isArray(col.columns)) {
      return columnHelper.group({
        id: col.id || String(Math.random()),
        header: (context: HeaderContext<TData, unknown>) => getHeader(col, slots, context),
        footer: col.footer ? (context: HeaderContext<TData, unknown>) => getFooter(col, slots, context) : undefined,
        columns: processColumns(columnHelper, col.columns, slots, table),
        meta: col.meta,
      })
    }

    // Handle accessor columns
    const accessorCol = col as any
    if (accessorCol.accessorKey) {
      return columnHelper.accessor(accessorCol.accessorKey, {
        id: accessorCol.id || accessorCol.accessorKey,
        header: (context: HeaderContext<TData, unknown>) => getHeader(col, slots, context),
        footer: col.footer ? (context: HeaderContext<TData, unknown>) => getFooter(col, slots, context) : undefined,
        cell: (context: CellContext<TData, unknown>) => getCell(col, slots, context),
        meta: col.meta,
      })
    }

    if (accessorCol.accessorFn) {
      return columnHelper.accessor(accessorCol.accessorFn, {
        id: accessorCol.id || String(Math.random()),
        header: (context: HeaderContext<TData, unknown>) => getHeader(col, slots, context),
        footer: col.footer ? (context: HeaderContext<TData, unknown>) => getFooter(col, slots, context) : undefined,
        cell: (context: CellContext<TData, unknown>) => getCell(col, slots, context),
        meta: col.meta,
      })
    }

    // Default case - treat as display column
    return columnHelper.display({
      id: col.id || String(Math.random()),
      header: (context: HeaderContext<TData, unknown>) => getHeader(col, slots, context),
      footer: col.footer ? (context: HeaderContext<TData, unknown>) => getFooter(col, slots, context) : undefined,
      cell: (context: CellContext<TData, unknown>) => getCell(col, slots, context),
      meta: col.meta,
    })
  })
}
