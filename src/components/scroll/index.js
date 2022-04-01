import { debounce} from 'throttle-debounce';
export default {
  name: 'Scroll',
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    classOption: {
      type: Object,
      default: () => {
        return {}
      }
    },
    store: {
      required: true
    },
  },
  render(h) {
    const slotList = this.slotList
    const height = this.realBoxHeight / 2
    const enter = () => {
      if (this.hoverStopSwitch) this._stopMove()
    }
    const leave = () => {
      if (this.hoverStopSwitch) this._startMove()
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
    const pos = this.pos
    return (
      <div ref="wrap">
        <div ref="realBox" style={pos} vOn:mousewheel={wheel} vOn:mouseenter={enter} vOn:mouseleave={leave}>
          {
            slotList.map(item => {
              return item
            })
          }
        </div>
      </div>
    );
  },
  data () {
    return {
      xPos: 0,
      yPos: 0,
      delay: 0,
      i:0,
      copyHtml: '',
      slotList:[],
      parentHeight: 0,
      height: 0,
      width: 0, // 外容器宽度
      realBoxWidth: 0, // 内容实际宽度
    }
  },
  computed: {
    pos () {
      return {
        transform: `translate(${this.xPos}px,${this.yPos}px)`,
        transition: `all ${this.ease} ${this.delay}ms`,
        // overflow: 'hidden'
        width: '100%'
      }
    },
    defaultOption () {
      return {
        step: 1, //步长
        // limitMoveNum: 5, //启动无缝滚动最小数据数
        hoverStop: true, //是否启用鼠标hover控制
        singleHeight: 0, //单条数据高度有值hoverStop关闭
        singleWidth: 0, //单条数据宽度有值hoverStop关闭
        waitTime: 1000, //单步停止等待时间
        autoPlay: true,
        delayTime: 2000, //刚开始延迟滚动时间
        navigation: false,
        switchSingleStep: 134,
        switchDelay: 400,
      }
    },
    options () {
      return Object.assign({}, this.defaultOption, this.classOption)
    },
    navigation () {
      return this.options.navigation
    },
    autoPlay () {
      if (this.navigation) return false
      return this.options.autoPlay
    },
    // scrollSwitch () {
    //   return this.data.length >= this.options.limitMoveNum
    // },
    hoverStopSwitch () {
      return this.options.hoverStop && this.autoPlay
    },
    canTouchScroll () {
      return this.options.openTouch
    },
    isHorizontal () {
      return this.options.direction > 1
    },
    baseFontSize () {
      return this.options.isSingleRemUnit ? parseInt(window.getComputedStyle(document.documentElement, null).fontSize) : 1
    },
    realSingleStopWidth () {
      return this.options.singleWidth * this.baseFontSize
    },
    realSingleStopHeight () {
      return this.options.singleHeight * this.baseFontSize
    },
    step () {
      let singleStep
      let step = this.options.step
      if (this.isHorizontal) {
        singleStep = this.realSingleStopWidth
      } else {
        singleStep = this.realSingleStopHeight
      }
      if (singleStep > 0 && singleStep % step > 0) {
        console.error('如果设置了单步滚动,step需是单步大小的约数,否则无法保证单步滚动结束的位置是否准确。~~~~~')
      }
      return step
    }
  },
  methods: {
    reset () {
      // this._cancle()
      // this._initMove()
    },
    _cancle () {
      cancelAnimationFrame(this.reqFrame || '')
    },
    _move () {
      // 鼠标移入时拦截_move()
      if (this.isHover) return
      this._cancle() //进入move立即先清除动画 防止频繁touchMove导致多动画同时进行
      this.reqFrame = requestAnimationFrame(
        function () {
          const h = this.realBoxHeight / 2  //实际高度
          let { waitTime } = this.options
          let { step } = this
          if (Math.abs(this.yPos) >= h) {
            this.yPos = 0
          }
          this.yPos -= step
          if (this.singleWaitTime) clearTimeout(this.singleWaitTime)
          if (!!this.realSingleStopHeight) { //是否启动了单行暂停配置
            if (Math.abs(this.yPos) % this.realSingleStopHeight < step) { // 符合条件暂停waitTime
              this.singleWaitTime = setTimeout(() => {
                this._move()
              }, waitTime)
            } else {
              this._move()
            }
          } else if (!!this.realSingleStopWidth) {
            if (Math.abs(this.xPos) % this.realSingleStopWidth < step) { // 符合条件暂停waitTime
              this.singleWaitTime = setTimeout(() => {
                this._move()
              }, waitTime)
            } else {
              this._move()
            }
          } else {
            this._move()
          }
        }.bind(this)
      )
    },
    _initMove () {
      this.$nextTick(() => {
        const { switchDelay } = this.options
        const { autoPlay, isHorizontal } = this
        this._dataWarm(this.data)
        if (isHorizontal) {
          this.height = this.$refs.wrap.offsetHeight
          this.width = this.$refs.wrap.offsetWidth
        }

        if (autoPlay) {
          this.ease = 'ease-in'
          this.delay = 0
        } else {
          this.ease = 'linear'
          this.delay = switchDelay
          return
        }

        // 是否可以滚动判断
        if (this.isStart) {
          let timer
          if (timer) clearTimeout(timer)
          setTimeout(() => {
            this.realBoxHeight = this.$refs?.realBox?.offsetHeight
            this._move()
          }, 0);
        } else {
          this._cancle()
          this.yPos = 0
        }
      })
    },
    _dataWarm (data) {
      if (data.length > 100) {
        console.warn(`数据达到了${data.length}条有点多哦~,可能会造成部分老旧浏览器卡顿。`);
      }
    },
    _startMove () {
      this.isHover = false 
      this.isStart && this._move()
    },
    _stopMove () {
      this.isHover = true //关闭_move
      // 防止频频hover进出单步滚动,导致定时器乱掉
      if (this.singleWaitTime) clearTimeout(this.singleWaitTime)
      this._cancle()
    },
  },
  mounted () {
  },
  updated() {
    if(this.isStart && this.i == 0) {
      let timer = setTimeout(() => {
        this._initMove()
        clearTimeout(timer)
      }, this.options.delayTime)
    }
    this.i ++
  },
  watch: {
  },
  created() {
    const height = this.parentHeight = this.$parent.layout.height
    this.slotList.push(this.$slots.default)
    this.$nextTick(() => {
      if (this.$el.clientHeight > height) {
        this.isStart = true
        this.slotList.push(this.$slots.default)
      }
    })
  },
  beforeCreate () {
    this.reqFrame = null // move动画的animationFrame定时器
    this.singleWaitTime = null // single 单步滚动的定时器
    this.isHover = false // mouseenter mouseleave 控制this._move()的开关
    this.isStart = false // 外部定义高度高于表格高度开始滚动
    this.ease = 'ease-in'
  },
  beforeDestroy () {
    this._cancle()
    clearTimeout(this.singleWaitTime)
  }
}