import type {
  ColumnHelper,
  HeaderContext,
  CellContext,
  RowData,
  ColumnDef as TStackColumnDef,
  Table,
} from '@tanstack/vue-table'
import type { Slots } from 'vue'
import type { ColumnDef } from './types'
import capitalize from 'lodash.capitalize'

const getHeader = <TData extends RowData & object>(
  col: ColumnDef<TData>,
  slots: Readonly<Slots>,
  context: HeaderContext<TData, unknown>,
) => {
  const slotName = `header-${col.id}`

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
  return capitalize(col.id.split('-').join(' '))
}

const getFooter = <TData extends RowData & object>(
  col: ColumnDef<TData>,
  slots: Readonly<Slots>,
  context: HeaderContext<TData, unknown>,
) => {
  const slotName = `footer-${col.id}`

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
  const slotName = `cell-${col.id}`

  // Check slot first
  if (slots[slotName]) {
    return slots[slotName]({
      cell: context.cell,
      row: context.row,
      value: context.getValue(),
    })
  }

  // Then handle based on column type
  const value = context.getValue()
  if (col.type === 'display') {
    return col.cell ? col.cell(context) : '-'
  }
  if (col.type === 'accessor' || col.type === undefined) {
    return col.cell ? col.cell(context) : value !== undefined && value !== null ? value : '-'
  }
  return '-'
}

export const processColumns = <TData extends RowData & object>(
  columnHelper: ColumnHelper<TData>,
  columns: ColumnDef<TData>[],
  slots: Readonly<Slots>,
  table: Table<TData>,
): TStackColumnDef<TData>[] => {
  return columns.map((col: any): TStackColumnDef<TData> => {
    // Handle group columns
    if (col.type === 'group' && col.columns) {
      return columnHelper.group({
        id: col.id,
        header: (context) => getHeader(col, slots, context),
        footer: col.footer ? (context) => getFooter(col, slots, context) : undefined,
        columns: processColumns(columnHelper, col.columns, slots, table),
        meta: col.meta,
      }) as TStackColumnDef<TData>
    }

    // Handle accessor columns
    if (col.type === 'accessor' || col.type === undefined) {
      return columnHelper.accessor((row) => row[col.id as keyof TData], {
        id: col.id,
        header: (context) => getHeader(col, slots, context),
        footer: col.footer ? (context) => getFooter(col, slots, context) : undefined,
        cell: (context) => getCell(col, slots, context),
        meta: col.meta,
      }) as TStackColumnDef<TData>
    }

    // Handle display columns
    if (col.type === 'display') {
      return columnHelper.display({
        id: col.id,
        header: (context) => getHeader(col, slots, context),
        footer: col.footer ? (context) => getFooter(col, slots, context) : undefined,
        cell: (context) => getCell(col, slots, context),
        meta: col.meta,
      }) as TStackColumnDef<TData>
    }

    // If no type is specified, treat as accessor column
    return columnHelper.accessor((row) => row[col.id as keyof TData], {
      id: col.id,
      header: (context) => getHeader(col, slots, context),
      footer: col.footer ? (context) => getFooter(col, slots, context) : undefined,
      cell: (context) => getCell(col, slots, context),
      meta: col.meta,
    }) as TStackColumnDef<TData>
  })
}
