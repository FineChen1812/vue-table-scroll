# options

## index
- type: `Boolean`
- 默认值: `false`

说明: 是否开启行序号

## showTip
- type: `Boolean`
- 默认值: `true`

说明: 数据超长隐藏并提示

## bodyHeight
- type: `Number`
- 默认值: 300

说明: 表体高度,当`tableData`数据高度大于表体高度时将会滚动

## step
- type: `Number`
- 默认值: 1

说明: 无缝滚动步长,数字越大滚动越快

## delayTime
- type: `Number`
- 默认值: 2000

说明: 表格渲染完后2s开始滚动

## hoverStop
- type: `Boolean`
- 默认值: `true`

说明: 是否开启鼠标hover控制停止/滚动

## singleStepMove
- type: `Boolean`
- 默认值: `false`

说明: 是否启用单步滚动

## singleStep
- type: `Number`
- 默认值: 6

说明: 单步滚动步长,数据越大，单步滚动越快(不建议更改,如果改则应设置为`singleHeight`的约数,避免单步滚动出现位置错乱)

## singleHeight
- type: `Number`
- 默认值: 48

说明: 单条数据的高度

## waitTime
- type: `Number`
- 默认值: 2000

说明: 单步滚动间隔时间
