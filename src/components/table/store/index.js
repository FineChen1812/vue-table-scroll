// 数据仓库
import { parseWidth } from '../util';
export default class Store {
  constructor() {
    this.tableHeader = null
    this.tableData = null
    this.table = null
  }
  setData(type, data) {
    this[type] = data
  }
  updateColumns(bodyWidth) {
    let tables = this.tableHeader.filter(item => !item.hidden)
    let indexWidth = this.table.layout.index ? 50 : 0
    let widthSum = 0, num = 0
    for(let i = 0; i < tables.length; i++) {
      if(tables[i].width) {
        widthSum += parseWidth(tables[i].width)
        parseWidth(tables[i].width) && num++
      }
    }
    this.tableHeader = tables.map(item => {
      if(!item.width) item.width = parseInt((bodyWidth - widthSum - indexWidth)/(tables.length - num))
      return item
    })
  }
}

export function createStore(table) {
  const store = new Store()
  store.table = table
  return store
}
