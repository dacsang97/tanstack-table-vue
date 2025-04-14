import type { CellContext, Column, HeaderContext, Row, RowData } from '@tanstack/vue-table'

export interface HeaderSlotProps<TData extends RowData> {
  column: Column<TData, any>
  context: HeaderContext<TData, any>
}

export interface CellSlotProps<TData extends RowData> {
  row: Row<TData>
  context: CellContext<TData, any>
  value: any
}

export interface FooterSlotProps<TData extends RowData> {
  column: Column<TData, any>
  context: HeaderContext<TData, any>
}
