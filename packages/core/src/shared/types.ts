import type {
  ColumnDef as VueTableColumnDef,
  Row,
  Column,
  Table,
  HeaderContext,
  CellContext,
  RowData,
} from '@tanstack/vue-table'

export interface DisplayColumnDef<TData extends object> {
  id: string
  type: 'display'
  header?: string
  footer?: string | ((props: any) => any)
  cell?: (info: CellContext<TData, unknown>) => any
  meta?: Record<string, any>
}

export interface AccessorColumnDef<TData extends object> {
  id: string
  type?: 'accessor'
  header?: string
  footer?: string | ((props: any) => any)
  cell?: (info: any) => any
  meta?: Record<string, any>
}

export interface GroupColumnDef<TData extends object> {
  id: string
  type: 'group'
  header?: string
  footer?: string | ((props: any) => any)
  columns: Array<VueTableColumnDef<TData>>
  meta?: Record<string, any>
}

export type ColumnDef<TData extends object> = DisplayColumnDef<TData> | AccessorColumnDef<TData> | GroupColumnDef<TData>

export interface TableContext<TData extends RowData> {
  table: Table<TData>
  column: Column<TData>
  row?: Row<TData>
  getValue: () => any
}

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
