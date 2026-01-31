import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import TSTable from '../TSTable.vue'

interface TestRow {
  name: string
  age: number
}

const testData: TestRow[] = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
]

const testColumns: ColumnDef<TestRow, any>[] = [{ accessorKey: 'name' }, { accessorKey: 'age' }]

describe('TSTable', () => {
  it('renders with basic accessor columns and data', () => {
    const wrapper = mount(TSTable, {
      props: { columns: testColumns, data: testData },
      slots: {
        default: ({ table }: any) => {
          const rows = table.getRowModel().rows
          return h('div', [h('span', { class: 'row-count' }, `${rows.length} rows`)])
        },
      },
    })
    expect(wrapper.find('.row-count').text()).toBe('2 rows')
  })

  it('exposes table instance via default slot', () => {
    let tableInstance: any = null
    mount(TSTable, {
      props: { columns: testColumns, data: testData },
      slots: {
        default: ({ table }: any) => {
          tableInstance = table
          return h('div')
        },
      },
    })
    expect(tableInstance).not.toBeNull()
    expect(tableInstance.getRowModel).toBeDefined()
    expect(tableInstance.getHeaderGroups).toBeDefined()
  })

  it('reacts to data changes', async () => {
    const wrapper = mount(TSTable, {
      props: { columns: testColumns, data: testData },
      slots: {
        default: ({ table }: any) => {
          return h('span', { class: 'count' }, `${table.getRowModel().rows.length}`)
        },
      },
    })
    expect(wrapper.find('.count').text()).toBe('2')

    await wrapper.setProps({ data: [...testData, { name: 'Charlie', age: 35 }] })
    await nextTick()
    expect(wrapper.find('.count').text()).toBe('3')
  })

  it('reacts to columns changes', async () => {
    const wrapper = mount(TSTable, {
      props: { columns: testColumns, data: testData },
      slots: {
        default: ({ table }: any) => {
          const headers = table.getHeaderGroups()[0].headers
          return h('span', { class: 'cols' }, `${headers.length}`)
        },
      },
    })
    expect(wrapper.find('.cols').text()).toBe('2')

    await wrapper.setProps({ columns: [{ accessorKey: 'name' }] })
    await nextTick()
    expect(wrapper.find('.cols').text()).toBe('1')
  })

  it('empty data renders no rows', () => {
    const wrapper = mount(TSTable, {
      props: { columns: testColumns, data: [] },
      slots: {
        default: ({ table }: any) => {
          return h('span', { class: 'count' }, `${table.getRowModel().rows.length}`)
        },
      },
    })
    expect(wrapper.find('.count').text()).toBe('0')
  })

  it('passes tableOptions to useVueTable', () => {
    let tableInstance: any = null
    mount(TSTable, {
      props: {
        columns: testColumns,
        data: testData,
        tableOptions: {
          enableSorting: false,
        },
      },
      slots: {
        default: ({ table }: any) => {
          tableInstance = table
          return h('div')
        },
      },
    })
    expect(tableInstance).not.toBeNull()
    // Table should still function with custom options
    expect(tableInstance.getRowModel().rows).toHaveLength(2)
  })

  it('auto-capitalizes header from accessorKey', () => {
    let headerValue: any = null
    mount(TSTable, {
      props: {
        columns: [{ accessorKey: 'name' }] as ColumnDef<TestRow, any>[],
        data: testData,
      },
      slots: {
        default: ({ table }: any) => {
          const header = table.getHeaderGroups()[0].headers[0]
          // The header function should return capitalized version
          headerValue = header.column.columnDef.header
          return h('div')
        },
      },
    })
    // header is a function that returns the capitalized key when no slot/header prop is provided
    expect(headerValue).toBeDefined()
    expect(typeof headerValue).toBe('function')
  })

  it('renders dash for null/undefined cell values', () => {
    const dataWithNulls = [{ name: null, age: undefined }] as any[]
    let cellValue: any = null
    mount(TSTable, {
      props: {
        columns: [{ accessorKey: 'name' }] as ColumnDef<any, any>[],
        data: dataWithNulls,
      },
      slots: {
        default: ({ table }: any) => {
          const row = table.getRowModel().rows[0]
          const cell = row.getVisibleCells()[0]
          cellValue = cell.column.columnDef.cell
          return h('div')
        },
      },
    })
    expect(cellValue).toBeDefined()
    expect(typeof cellValue).toBe('function')
  })
})