# vue-table-scroll
A scrollable table for Vue.js

## 安装
`npm install vue-table-scroll -D`
## 使用说明
### 局部
`import TableScroll from 'vue-table-scroll'`\
`import 'vue-table-scroll/dist/style.css'`\
```js
components: {
  TableScroll
}
```
### 全局
`import TableScroll from 'vue-table-scroll'`\
`import 'vue-table-scroll/dist/style.css'`
`Vue.use(TableScroll);`
## 注意事项
该项目样式引用的是element-ui样式,如果项目中未使用element-ui，则需要导入样式文件，否则不需要导入 