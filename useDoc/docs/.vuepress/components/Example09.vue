<template>
  <div>
    <table-scroll
      :table-header="tableHeader"
      :table-data="tableData"
      @lineClick= "lickClick"
    />
  </div>
</template>

<script>

export default {
  data() {
    return {
      tableHeader: [
        {label: 'id', prop: "id", hidden: true},
        {label: '日期', prop: "date"},
        {label: '姓名', prop: "name"},
        {label: '地址', prop: "address"}
      ],
      tableData:[
      {
        id: "123",
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        id: "1234",
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        id: "1235",
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        id: "1236",
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        id: "1236",
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        id: "1236",
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        id: "1236",
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }
    ]
    }
  },
  methods: {
    lickClick(data){
      alert(JSON.stringify(data))
    }
  }
}
</script>

<style>
</style>