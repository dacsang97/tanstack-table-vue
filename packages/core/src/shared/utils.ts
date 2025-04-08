import type {
  ColumnHelper,
  HeaderContext,
  CellContext,
  RowData,
  ColumnDef as TStackColumnDef,
} from '@tanstack/vue-table'
import type { Slots } from 'vue'
import capitalize from 'lodash.capitalize'
import type {
  ColumnDef,
  AccessorColumnDef,
  GroupColumnDef,
  HeaderSlotProps,
  CellSlotProps,
  FooterSlotProps,
} from './types'

const getHeader = <TData extends RowData & object>(
  col: ColumnDef<TData>,
  slots: Readonly<Slots>,
  context: HeaderContext<TData, unknown>,
) => {
  if (col.header) {
    return col.header
  }

  const slotName = `header-${col.id}`

  if (slots[slotName]) {
    return slots[slotName]({
      column: context.column,
      context,
    } as HeaderSlotProps<TData>)
  }

  return capitalize(col.id.split('-').join(' '))
}

const getFooter = <TData extends RowData & object>(
  col: ColumnDef<TData>,
  slots: Readonly<Slots>,
  context: HeaderContext<TData, unknown>,
) => {
  if (col.footer) {
    return col.footer
  }

  const slotName = `footer-${col.id}`

  if (slots[slotName]) {
    return slots[slotName]({
      column: context.column,
      context,
    } as FooterSlotProps<TData>)
  }

  return undefined
}

const getCell = <TData extends RowData & object>(
  col: ColumnDef<TData>,
  slots: Readonly<Slots>,
  context: CellContext<TData, unknown>,
) => {
  const slotName = `cell-${col.id}`

  if (slots[slotName]) {
    return slots[slotName]({
      row: context.row,
      context,
      value: context.getValue(),
    } as CellSlotProps<TData>)
  }

  return context.getValue()
}

export const processColumns = <TData extends RowData & object>(
  columnHelper: ColumnHelper<TData>,
  columns: ColumnDef<TData>[],
  slots: Readonly<Slots>,
): TStackColumnDef<TData>[] => {
  return columns.map((col) => {
    if (col.type === 'group') {
      const groupCol = col as GroupColumnDef<TData>
      return columnHelper.group({
        id: groupCol.id,
        header: (context: HeaderContext<TData, unknown>) => getHeader(groupCol, slots, context),
        footer: (context: HeaderContext<TData, unknown>) => getFooter(groupCol, slots, context),
        columns: processColumns(columnHelper, groupCol.columns as ColumnDef<TData>[], slots),
      }) as TStackColumnDef<TData>
    }

    if (col.type === 'display') {
      return columnHelper.display({
        id: col.id,
        header: (context: HeaderContext<TData, unknown>) => getHeader(col, slots, context),
        footer: (context: HeaderContext<TData, unknown>) => getFooter(col, slots, context),
        cell: (context: CellContext<TData, unknown>) => getCell(col, slots, context),
      }) as TStackColumnDef<TData>
    }

    // For accessor columns
    const accessorCol = col as AccessorColumnDef
    return columnHelper.accessor((row) => row[accessorCol.id as keyof TData], {
      id: accessorCol.id,
      header: (context: HeaderContext<TData, unknown>) => getHeader(col, slots, context),
      footer: (context: HeaderContext<TData, unknown>) => getFooter(col, slots, context),
      cell: (context: CellContext<TData, unknown>) => getCell(col, slots, context),
    }) as TStackColumnDef<TData>
  })
}
