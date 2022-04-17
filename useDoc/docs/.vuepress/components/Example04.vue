<template>
  <div>
    <table-scroll
      :table-header="tableHeader"
      :table-data="tableData"
      :options = "options"
    />
  </div>
</template>

<script>

export default {
  data() {
    return {
      tableHeader: [
        {label: '日期', prop: "date"},
        {label: '姓名', prop: "name"},
        {label: '性别', prop: "sex"},
        {label: '地址', prop: "address"}
      ],
      tableData:[
      {
        date: '2016-05-02',
        name: '王小虎',
        sex: '男',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        sex: '男',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        sex: '男',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        sex: '男',
        address: '上海市普陀区金沙江路 1519 弄'
      } , {
        date: '2016-05-01',
        name: '王小虎',
        sex: '男',
        address: '上海市普陀区金沙江路 1519 弄'
      } , {
        date: '2016-05-01',
        name: '王小虎',
        sex: '男',
        address: '上海市普陀区金沙江路 1519 弄'
      } , {
        date: '2016-05-01',
        name: '王小虎',
        sex: '男',
        address: '上海市普陀区金沙江路 1519 弄'
      } , {
        date: '2016-05-01',
        name: '王小虎',
        sex: '男',
        address: '上海市普陀区金沙江路 1519 弄'
      } , {
        date: '2016-05-01',
        name: '王小虎',
        sex: '男',
        address: '上海市普陀区金沙江路 1519 弄'
      } , {
        date: '2016-05-01',
        name: '王小虎',
        sex: '男',
        address: '上海市普陀区金沙江路 1519 弄'
      } , {
        date: '2016-05-01',
        name: '王小虎',
        sex: '男',
        address: '上海市普陀区金沙江路 1519 弄'
      } 
    ],
    options: {
      index: true
    }
    }
  }
}
</script>

<style>
</style>