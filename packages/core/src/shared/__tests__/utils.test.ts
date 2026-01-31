import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { createColumnHelper, type CellContext, type HeaderContext } from '@tanstack/vue-table'
import { processColumns, valueUpdater } from '../utils'

interface TestRow {
  name: string
  age: number
  video_url: string
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

describe('slot name resolution (id takes priority over accessorKey)', () => {
  const columnHelper = createColumnHelper<TestRow>()

  const createMockCellContext = (value: any, row: TestRow) =>
    ({
      getValue: () => value,
      row: { original: row },
      cell: {},
    }) as unknown as CellContext<TestRow, any>

  const createMockHeaderContext = () =>
    ({
      column: {},
    }) as unknown as HeaderContext<TestRow, any>

  describe('cell slots', () => {
    it('uses accessorKey for slot when id is not provided', () => {
      const cellSlot = vi.fn(() => 'slot-content')
      const slots = { 'cell-name': cellSlot } as any

      const columns = [{ accessorKey: 'name' as const, header: 'Name' }]
      const result = processColumns(columnHelper, columns, slots)

      const cellFn = result[0]!.cell as (context: CellContext<TestRow, any>) => any
      const output = cellFn(createMockCellContext('John', { name: 'John', age: 30, video_url: '' }))

      expect(cellSlot).toHaveBeenCalled()
      expect(output).toBe('slot-content')
    })

    it('uses id for slot when both id and accessorKey are provided', () => {
      const previewSlot = vi.fn(() => 'preview-slot-content')
      const videoUrlSlot = vi.fn(() => 'video-url-slot-content')
      const slots = {
        'cell-preview': previewSlot,
        'cell-video_url': videoUrlSlot,
      } as any

      const columns = [{ accessorKey: 'video_url' as const, header: 'Preview', id: 'preview' }]
      const result = processColumns(columnHelper, columns, slots)

      const cellFn = result[0]!.cell as (context: CellContext<TestRow, any>) => any
      const output = cellFn(
        createMockCellContext('http://example.com/video.mp4', {
          name: 'Test',
          age: 25,
          video_url: 'http://example.com/video.mp4',
        }),
      )

      expect(previewSlot).toHaveBeenCalled()
      expect(videoUrlSlot).not.toHaveBeenCalled()
      expect(output).toBe('preview-slot-content')
    })

    it('allows same accessorKey with different ids for multiple columns', () => {
      const previewSlot = vi.fn(() => 'preview-content')
      const typeSlot = vi.fn(() => 'type-content')
      const slots = {
        'cell-preview': previewSlot,
        'cell-type': typeSlot,
      } as any

      const columns = [
        { accessorKey: 'video_url' as const, header: 'Preview', id: 'preview' },
        { accessorKey: 'video_url' as const, header: 'Type', id: 'type' },
      ]
      const result = processColumns(columnHelper, columns, slots)

      const previewCellFn = result[0]!.cell as (context: CellContext<TestRow, any>) => any
      const typeCellFn = result[1]!.cell as (context: CellContext<TestRow, any>) => any

      const mockContext = createMockCellContext('http://example.com/video.mp4', {
        name: 'Test',
        age: 25,
        video_url: 'http://example.com/video.mp4',
      })

      previewCellFn(mockContext)
      expect(previewSlot).toHaveBeenCalled()

      typeCellFn(mockContext)
      expect(typeSlot).toHaveBeenCalled()
    })

    it('falls back to cell function when slot is not provided', () => {
      const slots = {} as any
      const cellFn = vi.fn(() => 'cell-fn-content')

      const columns = [{ accessorKey: 'name' as const, header: 'Name', cell: cellFn }]
      const result = processColumns(columnHelper, columns, slots)

      const processedCellFn = result[0]!.cell as (context: CellContext<TestRow, any>) => any
      const output = processedCellFn(createMockCellContext('John', { name: 'John', age: 30, video_url: '' }))

      expect(cellFn).toHaveBeenCalled()
      expect(output).toBe('cell-fn-content')
    })

    it('falls back to raw value when no slot and no cell function', () => {
      const slots = {} as any

      const columns = [{ accessorKey: 'name' as const, header: 'Name' }]
      const result = processColumns(columnHelper, columns, slots)

      const cellFn = result[0]!.cell as (context: CellContext<TestRow, any>) => any
      const output = cellFn(createMockCellContext('John', { name: 'John', age: 30, video_url: '' }))

      expect(output).toBe('John')
    })

    it('returns dash for null/undefined values when no slot and no cell function', () => {
      const slots = {} as any

      const columns = [{ accessorKey: 'name' as const, header: 'Name' }]
      const result = processColumns(columnHelper, columns, slots)

      const cellFn = result[0]!.cell as (context: CellContext<TestRow, any>) => any

      expect(cellFn(createMockCellContext(null, { name: '', age: 30, video_url: '' }))).toBe('-')
      expect(cellFn(createMockCellContext(undefined, { name: '', age: 30, video_url: '' }))).toBe('-')
    })
  })

  describe('header slots', () => {
    it('uses id for header slot when both id and accessorKey are provided', () => {
      const previewHeaderSlot = vi.fn(() => 'preview-header-content')
      const slots = { 'header-preview': previewHeaderSlot } as any

      const columns = [{ accessorKey: 'video_url' as const, header: 'Preview', id: 'preview' }]
      const result = processColumns(columnHelper, columns, slots)

      const headerFn = result[0]!.header as (context: HeaderContext<TestRow, any>) => any
      const output = headerFn(createMockHeaderContext())

      expect(previewHeaderSlot).toHaveBeenCalled()
      expect(output).toBe('preview-header-content')
    })

    it('uses accessorKey for header slot when id is not provided', () => {
      const nameHeaderSlot = vi.fn(() => 'name-header-content')
      const slots = { 'header-name': nameHeaderSlot } as any

      const columns = [{ accessorKey: 'name' as const }]
      const result = processColumns(columnHelper, columns, slots)

      const headerFn = result[0]!.header as (context: HeaderContext<TestRow, any>) => any
      const output = headerFn(createMockHeaderContext())

      expect(nameHeaderSlot).toHaveBeenCalled()
      expect(output).toBe('name-header-content')
    })

    it('falls back to header prop when no slot', () => {
      const slots = {} as any

      const columns = [{ accessorKey: 'name' as const, header: 'Full Name' }]
      const result = processColumns(columnHelper, columns, slots)

      const headerFn = result[0]!.header as (context: HeaderContext<TestRow, any>) => any
      const output = headerFn(createMockHeaderContext())

      expect(output).toBe('Full Name')
    })
  })

  describe('display columns', () => {
    it('uses id for slot in display columns', () => {
      const actionsSlot = vi.fn(() => 'actions-content')
      const slots = { 'cell-actions': actionsSlot } as any

      const columns = [{ id: 'actions', header: 'Actions' }]
      const result = processColumns(columnHelper, columns, slots)

      const cellFn = result[0]!.cell as (context: CellContext<TestRow, any>) => any
      const output = cellFn(createMockCellContext(undefined, { name: 'Test', age: 25, video_url: '' }))

      expect(actionsSlot).toHaveBeenCalled()
      expect(output).toBe('actions-content')
    })
  })
})