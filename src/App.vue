<template>
  <div >
    <div style="display: flex;width:100%;">
      <div style="flex:1;"></div>
      <el-table
      :data="tableData"
      style="width: 50%;flex:1;">
      <el-table-column
        prop="parentPlantName"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
      align="center"
        prop="interLockCount"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="castRate"
        label="地址">
      </el-table-column>
      </el-table>
    </div>
    
    <!-- <div style="display: flex;width:100%;">
      <div style="flex:1;"></div>
      <div style="flex:1;"> -->
      <table-scroll  :tableHeader="tableHeader" @lineClick = 'lineClick'  :tableData="tableData" :options="options" ></table-scroll>

      <!-- </div>
    </div> -->
    
  </div>
</template>

<script>
import TableScroll from '@/components/table/table.vue'
  export default {
    components: {
      TableScroll
    },
    name: 'Example01Basic',
    data () {
      return {
        tableHeader: [
          {label: "id",prop: "id", hidden: true},
          {label: "车间",prop: "parentPlantName"},
          {label: "联锁总数",prop: "interLockCount"},
          {label: "投用联锁数",prop: "castCount"},
          {label: "摘除联锁数",prop: "removeCount"},
          {label: "投用率(%)",prop: "castRate"},
          {label: "摘除联锁时长(min)",prop: "durationMinutesSum"},
        ],
        tableData: [{
          id: '123333',
          parentPlantName: '2016-05-01',
          interLockCount: '王小虎',
          castCount: '上海',
          removeCount: '普陀区',
          castRate: '上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄',
          durationMinutesSum: 200333
        }, {
          id: '123333',
          parentPlantName: '2016-05-02',
          interLockCount: '王小虎',
          castCount: '上海',
          removeCount: '普陀区',
          castRate: '上海市普陀区金沙江路 1518 弄',
          durationMinutesSum: 200333
        }, {
          id: '123333',
          parentPlantName: '2016-05-03',
          interLockCount: '王小虎',
          castCount: '上海',
          removeCount: '普陀区',
          castRate: '上海市普陀区金沙江路 1518 弄',
          durationMinutesSum: 200333
        }, {
          id: '123333',
          parentPlantName: '2016-05-04',
          interLockCount: '王小虎',
          castCount: '上海',
          removeCount: '普陀区',
          castRate: '上海市普陀区金沙江路 1518 弄',
          durationMinutesSum: 200333
        }, {
          id: '123333',
          parentPlantName: '2016-05-05',
          interLockCount: '王小虎',
          castCount: '上海',
          removeCount: '普陀区',
          castRate: '上海市普陀区金沙江路 1518 弄',
          durationMinutesSum: 200333
        }, {
          id: '123333',
          parentPlantName: '2016-05-06',
          interLockCount: '王小虎',
          castCount: '上海',
          removeCount: '普陀区',
          castRate: '上海市普陀区金沙江路 1518 弄',
          durationMinutesSum: 200333
        }, {
          id: '123333',
          parentPlantName: '2016-05-07',
          interLockCount: '王小虎',
          castCount: '上海',
          removeCount: '普陀区',
          castRate: '上海市普陀区金沙江路 1518 弄',
          durationMinutesSum: 200333
        }, {
          id: '123333',
          parentPlantName: '2016-05-08',
          interLockCount: '王小虎',
          castCount: '上海',
          removeCount: '普陀区',
          castRate: '上海市普陀区金沙江路 1518 弄',
          durationMinutesSum: 200333
        }, {
          id: '123333',
          parentPlantName: '2016-05-09',
          interLockCount: '王小虎',
          castCount: '上海',
          removeCount: '普陀区',
          castRate: '上海市普陀区金沙江路 1518 弄',
          durationMinutesSum: 200333
        }],
        options: {
          bodyHeight: 500
        }
      }
    },
    methods: {
      lineClick(data){
        console.log(data, '222')
      }
    },
    mounted() {
    }
  }
</script>

<style>
  
</style>