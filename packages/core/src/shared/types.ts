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

export interface TSTableColumnMeta {
  size?: number
  style?: Record<string, string>
  enableSorting?: boolean
  headerClass?: string
  cellClass?: string
}

declare module '@tanstack/vue-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> extends TSTableColumnMeta {}
}