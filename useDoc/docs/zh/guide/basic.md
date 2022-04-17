# 默认配置

<ClientOnly>
<Example01></Example01>
</ClientOnly>

```vue
<template>
  <div>
    <table-scroll
      :table-header="tableHeader"
      :table-data="tableData"
    />
  </div>
</template>

<script>
import TableScroll from 'vue-table-scroll'
import 'vue-table-scroll/dist/style.css'

export default {
  components: {
    TableScroll
  },
  data() {
    return {
      tableHeader: [
        {label: '日期', prop: "date"},
        {label: '姓名', prop: "name"},
        {label: '地址', prop: "address"}
      ],
      tableData:[
      {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      } , {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }
    ]
    }
  }
}
</script>

<style>
</style>
```

