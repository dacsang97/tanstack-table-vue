import type { CellContext, Column, HeaderContext, Row, RowData } from '@tanstack/vue-table'

export interface HeaderSlotProps<TData extends RowData> {
  column: Column<TData>
  context: HeaderContext<TData, unknown>
}

export interface CellSlotProps<TData extends RowData> {
  row: Row<TData>
  context: CellContext<TData, unknown>
  value: any
}

export interface FooterSlotProps<TData extends RowData> {
  column: Column<TData>
  context: HeaderContext<TData, unknown>
}
