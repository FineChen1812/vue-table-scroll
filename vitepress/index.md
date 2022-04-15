# 指南
## 安装
```
npm install vue-table-scroll
```
## 使用
### 注册组件
<i style="color:red;font-size:18px;">⚠️</i>
<i style="color:#4569d4;">注意:该组件依赖element-ui样式,如果使用的项目中使用了element-ui,无需再引入样式文件。即:</i>`vue-table-scroll/dist/style.css`
```js
// main.js
// 1.全局引入
import TableScroll from 'vue-table-scroll'
import 'vue-table-scroll/dist/style.css'

Vue.use(TableScroll)

// 自定义名称 默认组件名称为 TableScroll
Vue.use(TableScroll, { componentName: 'table' })

// 2.组件内引入
<script>
import TableScroll from 'vue-table-scroll'
import 'vue-table-scroll/dist/style.css'
export default {
  components: {
    TableScroll
  }
}
</script>
```

### 使用组件
```html
<template>
  <div>
    11
  </div>
</template>
```
