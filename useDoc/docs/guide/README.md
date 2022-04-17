# 数据配置
## tableHeader(必需)
- type: `Array`

说明: 定义表头的数据,应包含`label、prop`字段

### width(可选)
- type: `Number`
- 默认值: 自适应宽度时计算的值

说明: 自定义每列的宽度,该字段需在`tableHeader`的数据中,例`{label: '性别', prop: 'sex', width: 200}`

### hidden(可选)
- type: `Boolean`
- 默认值: `false`

说明: 自定义每行的显隐,该字段需在`tableHeader`的数据中,例`{label: '性别', prop: 'sex', hidden: true}`

## tableData
- type: `Array`
- 默认值: `[]`

说明: 定义表体的数据