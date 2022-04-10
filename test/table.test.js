import { enableAutoDestroy, mount } from '@vue/test-utils'
import { afterAll,  describe, expect, it } from 'vitest'
import TableScroll from '../src/components/table/table.vue'
import { tableData, tableHeader, tableColumnData, tableColumnHeader } from './mock/mock'

const toArray = (obj) => {
  return [].slice.call(obj)
}

const getTestData = (arr, headerArr) => {
  const testDataArr = []
  const hideArr = headerArr.filter(cur => cur.hidden).map(item => item.prop)
  arr.forEach(cur => {
    Object.keys(cur).forEach(prop => {
      !hideArr.includes(prop) && !testDataArr.push(cur[prop].toString())
    })
  })
  return testDataArr
}

enableAutoDestroy(afterAll)

describe('TableScroll rendering data is correct', () => {
  const wrapper = mount(TableScroll, {
    propsData: {
      tableData,
      tableHeader
    }
  })

  it('header', () => {
    const headerArr = toArray(wrapper.vm.$el.querySelectorAll('thead th'))
    expect(
      headerArr.map( node => node.textContent)
    ).toEqual(['日期', '名称', '城市', '地区', '地址', '邮编'])
  })

  it('row length', () => {
    const body = toArray(wrapper.vm.$el.querySelectorAll('.el-table__body-wrapper tbody tr'))
    expect(body).toHaveLength(tableData.length)
  })

  it('row data', () => {
    const cells = toArray(wrapper.vm.$el.querySelectorAll('td .cell'))
    expect(cells.map(node => node.textContent)).toEqual(getTestData(tableData,tableHeader))
  })

})

describe('event', () => {
  const wrapper = mount(TableScroll, {
    propsData: {
      tableData,
      tableHeader
    },
  })

  it('line click', async () => {
    wrapper.find('td').trigger('click')
    const emit = wrapper.emitted('lineClick')
    expect(emit[0][0]).toEqual(tableData[0])
  })

})

describe('options attributes', () => {
  const wrapper = mount(TableScroll, {
    propsData: {
      tableData: tableColumnData,
      tableHeader: tableColumnHeader,
      options: {
        height: 500,
        showTip: true
      }
    }
  })

  it('column header width', () => {
    const headerArr = toArray(wrapper.vm.$el.querySelectorAll('.el-table_header col'))
    const headerWidth = parseFloat(headerArr[0].width)
    expect(headerWidth).toEqual(tableColumnHeader[0].width)
  })

  it('body height', () => {
    const body = wrapper.vm.$el.querySelector('.el-table__body-wrapper')
    expect(body.style.height).toEqual('500px')
  })

})


