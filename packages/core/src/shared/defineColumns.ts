import type { ColumnDef } from './types'

type ColumnConfig<TData extends object> = {
  id: keyof TData & string
  header?: string
  footer?: string
}

type GroupConfig<TData extends object> = {
  id: string
  header?: string
  footer?: string
  columns: (ColumnConfig<TData> | GroupConfig<TData>)[]
}

export function defineColumns<TData extends object>(
  columns: (ColumnConfig<TData> | GroupConfig<TData>)[],
): ColumnDef<TData>[] {
  return columns.map((col): ColumnDef<TData> => {
    if ('columns' in col) {
      return {
        id: col.id,
        type: 'group',
        header: col.header,
        footer: col.footer,
        columns: defineColumns(col.columns),
      }
    }

    return {
      id: col.id,
      type: 'accessor',
      header: col.header,
      footer: col.footer,
    }
  })
}
