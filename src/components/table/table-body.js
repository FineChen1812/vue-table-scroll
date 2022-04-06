import Vue from 'vue';
import { debounce} from 'throttle-debounce';
import LayoutObserver from './layout/observer';

export default {
  name: 'TableBody',
  mixins: [LayoutObserver],
  props: {
    store: {
      required: true
    },
  },
  
  render(h) {
    const tableHeader = this.store.tableHeader
    const tableData = this.tableData
    const height = this.realBoxHeight / 2
    const {isIndex, showTip} = this.table.mergeOption
    const  bodyWidth = this.table.bodyWidth
    const table = this.table
    const pos = this.pos
    const enter = () => {
      if (this.hoverStopSwitch) this.stopMove()
    }
    const leave = () => {
      if (this.hoverStopSwitch) this.startMove()
    }
    const lineClick = (data) => {
      table.$emit('lineClick', data)
    }
    const upScroll = () => {
      if (this.yPos > 0) this.yPos = -height
      this.yPos += 20
    }
    const downScroll = () => {
      if (Math.abs(this.yPos) >= height) this.yPos = 0
      this.yPos -= 20
    }
    const wheel = (e) => {
      this.isStart && debounce(10, () => {
        e.wheelDelta > 0 ? upScroll(): downScroll()
      })()
    }
    return (
      <div ref="wrap">
        <div ref="realBox" style={pos} vOn:mousewheel={wheel} vOn:mouseenter={enter} vOn:mouseleave={leave}>
          <table
            class="el-table__body"
            cellspacing="0"
            cellpadding="0"
            style={`width:${bodyWidth}px`}
            border="0">
            <colgroup>
            {
              isIndex && <col name={ `column_0` }  width="50" />
            }
            {
              tableHeader.map((column,index) => !column.hidden &&<col name={ `column_${index+1}` } />)
            }
            </colgroup>
            <tbody>
              {
                tableData.map((bodyColumn, bodyIndex) => {
                  return (
                    <tr onClick={() => lineClick(bodyColumn)}>
                      {  isIndex && <td class={['el-table__cell', 'is-center']}>
                          <div class={ ['cell'] }>{bodyIndex+1}</div>
                        </td>
                      }
                      {
                        tableHeader.map((headerColumn, headerIndex) => {
                          return (
                            !headerColumn.hidden&& <td class={['el-table__cell', 'is-center']}
                              on-mouseenter={($event) => this.handleCellMouseEnter($event)}
                              on-mouseleave={this.handleCellMouseLeave}
                            >
                              <div class={showTip? ['cell', 'el-tooltip']:['cell'] }>
                              {
                                bodyColumn[headerColumn.prop]
                              }
                              </div>
                            </td>
                          )
                        })
                      }
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  },

  computed: {
    table() {
      return this.$parent;
    },
    pos () {
      return {
        transform: `translateY(${this.yPos}px)`,
        transition: `all ease-in 0`,
        overflow: 'hidden'
      }
    },
    defaultOption () {
      return {
        step: 2, //步长
        singleStep: 6, //单步滚动步长
        hoverStop: true, //是否启用鼠标hover控制
        singleHeight: 48, //单条数据高度
        singleStepMove: false, //开启单步滚动
        delayTime: 2000, //刚开始延迟滚动时间
        waitTime: 2000 //单步滚动间隔时间
      }
    },
    options () {
      return Object.assign({}, this.defaultOption, this.tableLayout.options)
    },
    hoverStopSwitch () {
      return this.options.hoverStop
    },
    singleStep () {
      let step = this.options.singleStep
      let singleHeight = this.options.singleHeight
      if ( singleHeight % singleStep !== 0  ) {
        console.warn('当前单步长不是单条数据高度的约数,请及时调整,避免造成滚动错位*&……%&')
      }
      return step
    }
  },

  data() {
    return {
      tooltipContent: '',
      tipStyle: "",
      tableData: this.store.tableData,
      arrowStyle: '',
      yPos: 0,
      realBoxHeight: 0, // 内容实际宽度
    }
  },
  beforeCreate() {
    this.VM = null 
    this.reqFrame = null // move动画的animationFrame定时器
    this.singleWaitTime = null // single 单步滚动的定时器
    this.isHover = false // mouseenter mouseleave 控制this._move()的开关
    this.isStart = false // 外部定义高度高于表格高度开始滚动
  },

  mounted(){
    const height = this.$parent.mergeOption.bodyHeight
    const cellHeight =  this.$el.offsetHeight
    if (cellHeight > height) {
      this.tableData.push(...this.tableData)
      this.isStart = true
      let timer = setTimeout(() => {
        this.initMove()
        clearTimeout(timer)
      }, this.options.delayTime)
    }
  },
  beforeDestroy () {
    this.cancle()
    this.VM && this.VM.$destroy()
    if(this.singleWaitTime)clearTimeout(this.singleWaitTime)
  },

  methods: {
    handleCellMouseEnter(event) {
      if (!this.table.mergeOption.showTip) return
      const cell = event.target;
      const cellChild = cell.querySelector('.cell');
      const range = document.createRange();
      range.setStart(cellChild, 0);
      range.setEnd(cellChild, cellChild.childNodes.length);
      const rangeWidth = range.getBoundingClientRect().width;
      if (rangeWidth > cellChild.offsetWidth) {
        if(!this.VM) this.createTooltip()
        let offsetTop = this.getOffsetTop(range,event)
        const {offsetLeft, arrowOffsetLeft } = this.getOffsetLeft(range,event,rangeWidth)
        this.VM.$el.style.display  = ''
        this.tooltipContent = cell.innerText || cell.textContent;
        this.tipStyle = `z-index: 9999;position:fixed; left: ${offsetLeft}px; top: ${offsetTop}px;`
        this.arrowStyle = `left: ${arrowOffsetLeft}px`
      }
    },
    createTooltip() {
      const that = this
      this.VM = new Vue({
        render(h) {
          return (
              <div x-placement="bottom" ref = 'tooltip' class='el-tooltip__popper is-dark' style={that.tipStyle}>
              {
                that.tooltipContent
              }
              <div class="popper__arrow" style={that.arrowStyle}></div>
              </div>
          )
        }
      }).$mount();
      document.getElementsByTagName('body')[0].appendChild(this.VM.$el)
    },

    getOffsetTop(range,event) {
      const rangeTop = range.getBoundingClientRect().top
      // TODO 待优化 目前默认35
      const skewing = 35
      return rangeTop + skewing
    },

    getOffsetLeft(range,event, rangeWidth){
      const rangeLeft = range.getBoundingClientRect().left
      const removeWidth = parseInt((rangeWidth - event.target.clientWidth)/2)
      const leftWidth = rangeLeft - removeWidth
      const offsetLeft = leftWidth < 0 ? 0 : leftWidth
      const arrowOffsetLeft = leftWidth < 0 ? rangeLeft + event.target.clientWidth/2 : rangeWidth/2
      return {offsetLeft, arrowOffsetLeft }
    },
    handleCellMouseLeave(event) {
      if(this.VM) {
        this.VM.$el.style.display  = 'none'
      }
    },
    reset () {
      this.cancle()
      this.initMove()
    },
    cancle () {
      cancelAnimationFrame(this.reqFrame || '')
    },
    move () {
      if (this.isHover) return
      this.cancle()
      this.reqFrame = requestAnimationFrame(
        () => {
          const h = this.realBoxHeight / 2  
          let { step } = this.options
          if (Math.abs(this.yPos) >= h) {
            this.yPos = 0
          }
          this.yPos -= step
          this.move()
        }
      )
    },

    singleMove () {
      if (this.isHover) return
      this.cancle() 
      this.reqFrame = requestAnimationFrame(
        () => {
          const h = this.realBoxHeight / 2  
          let { waitTime, singleStep,singleHeight } = this.options
          if (Math.abs(this.yPos) >= h) {
            this.yPos = 0
          }
          this.yPos -= singleStep
          if (this.singleWaitTime) clearTimeout(this.singleWaitTime)
          if (Math.abs(this.yPos) % singleHeight < singleStep) {
            this.singleWaitTime = setTimeout(() => {
              this.singleMove()
            }, waitTime)
          } else {
            this.singleMove()
          }
        }
      )
    },
    initMove () {
      console.log(this.options, 'options')
      this.$nextTick(() => {
        // 是否可以滚动判断
        if (this.isStart) {
          let timer = setTimeout(() => {
            this.realBoxHeight = this.$refs.realBox.offsetHeight
            this.options.singleStepMove? this.singleMove() : this.move()
            clearTimeout(timer)
          }, 0);
        } else {
          this.cancle()
          this.yPos = 0
        }
      })
    },
    startMove () {
      this.isHover = false 
      this.isStart?this.options.singleStepMove?this.singleMove() :this.move():null
    },
    stopMove () {
      this.isHover = true 
      // 防止频频hover进出单步滚动,导致定时器乱掉
      if (this.singleWaitTime) clearTimeout(this.singleWaitTime)
      this.cancle()
    },
  }
  
}
