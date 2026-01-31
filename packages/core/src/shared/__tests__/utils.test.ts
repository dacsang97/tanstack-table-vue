import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { createColumnHelper } from '@tanstack/vue-table'
import { processColumns, valueUpdater } from '../utils'

interface TestRow {
  name: string
  age: number
}

describe('valueUpdater', () => {
  it('applies function updater', () => {
    const r = ref(10)
    valueUpdater((old: number) => old + 5, r)
    expect(r.value).toBe(15)
  })

  it('applies direct value', () => {
    const r = ref('hello')
    valueUpdater('world', r)
    expect(r.value).toBe('world')
  })
})

describe('processColumns', () => {
  const columnHelper = createColumnHelper<TestRow>()
  const emptySlots = {} as any

  it('detects accessor column with accessorKey', () => {
    const columns = [{ accessorKey: 'name' as const }]
    const result = processColumns(columnHelper, columns, emptySlots)
    expect(result).toHaveLength(1)
    expect(result[0]!.id).toBe('name')
  })

  it('detects accessor column with accessorFn', () => {
    const columns = [
      {
        id: 'fullName',
        accessorFn: (row: TestRow) => row.name,
      },
    ]
    const result = processColumns(columnHelper, columns, emptySlots)
    expect(result).toHaveLength(1)
    expect(result[0]!.id).toBe('fullName')
  })

  it('detects display column', () => {
    const columns = [{ id: 'actions' }]
    const result = processColumns(columnHelper, columns, emptySlots)
    expect(result).toHaveLength(1)
    expect(result[0]!.id).toBe('actions')
  })

  it('detects group column with nested columns', () => {
    const columns = [
      {
        id: 'info',
        header: 'Info',
        columns: [{ accessorKey: 'name' as const }, { accessorKey: 'age' as const }],
      },
    ]
    const result = processColumns(columnHelper, columns, emptySlots)
    expect(result).toHaveLength(1)
    expect(result[0]!.id).toBe('info')
    expect((result[0] as any).columns).toHaveLength(2)
  })

  it('preserves column meta', () => {
    const columns = [
      {
        accessorKey: 'name' as const,
        meta: { size: 200, enableSorting: true },
      },
    ]
    const result = processColumns(columnHelper, columns, emptySlots)
    expect(result[0]!.meta).toEqual({ size: 200, enableSorting: true })
  })
})
