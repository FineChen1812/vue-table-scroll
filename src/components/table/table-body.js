import Vue from 'vue';
import {debounce} from 'throttle-debounce';
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
    const tableData = this.store.tableData
    const isIndex = this.tableLayout.index
    const lineClick = (data) => {
      this.$emit('lineClick', data)
    }
    return (
      <table
        class="el-table__body"
        cellspacing="0"
        cellpadding="0"
        border="0">
        <colgroup>
        {
          isIndex && <col name={ `el-table_1_column_0` }  width="50" />
        }
        {
          tableHeader.map((column,index) => !column.hidden &&<col name={ `el-table_1_column_${index+1}` }  key={index} />)
        }
        </colgroup>
        <tbody>
          {
            tableData.map((bodyColumn, bodyIndex) => {
              return (
                <tr onClick={() => lineClick(bodyColumn)}>
                  {  isIndex && <td class={['el-table__cell']}>
                      <div class={ ['cell'] }>{bodyIndex+1}</div>
                    </td>
                  }
                  {
                    tableHeader.map((headerColumn, headerIndex) => {
                      return (
                        !headerColumn.hidden&& <td class={['el-table__cell']}
                          on-mouseenter={($event) => this.handleCellMouseEnter($event)}
                          on-mouseleave={this.handleCellMouseLeave}
                        >
                          <div class={ ['cell', 'el-tooltip'] }>
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
    );
  },

  computed: {
    table() {
      return this.$parent;
    },
  },

  watch: {
  },

  data() {
    return {
      tooltipContent: '',
      tipStyle: "",
      arrowStyle: ''
    };
  },
  beforeCreate() {
    this.popperVM = null 
  },

  methods: {
    handleCellMouseEnter(event) {
      const cell = event.target;
      const cellChild = cell.querySelector('.cell');
      const range = document.createRange();
      range.setStart(cellChild, 0);
      range.setEnd(cellChild, cellChild.childNodes.length);
      const rangeWidth = range.getBoundingClientRect().width;
      if (rangeWidth > cellChild.offsetWidth) {
        if(!this.VM) this.createTooltip()
        let offsetTop = this.getOffsetTop(event)
        let {offsetLeft, arrowOffsetLeft } = this.getOffsetLeft(event,rangeWidth)
        this.VM.$el.style.display  = ''
        this.tooltipContent = cell.innerText || cell.textContent;
        this.tipStyle = `z-index: 9999;position:absolute; left: ${offsetLeft}px; top: ${event.y}px;`
        this.arrowStyle = `left: ${arrowOffsetLeft}px`
      }
    },
    createTooltip() {
      const that = this
      this.VM = new Vue({
        render(h) {
          return (
            <transition>
              <div x-placement="bottom" ref = 'tooltip' class='el-tooltip__popper is-dark' style={that.tipStyle}>
              {
                that.tooltipContent
              }
              <div class="popper__arrow" style={that.arrowStyle}></div>
              </div>
            </transition>
          )
        }
      }).$mount();
      document.getElementsByTagName('body')[0].appendChild(this.VM.$el)
    },

    getOffsetTop(event) {
      let headerOffsetTop
      const getParentNode = node => {
        if (node.$el._prevClass === 'el-table') {
          headerOffsetTop = node.$refs.tableHeader.$el.clientHeight
          return node.$el.offsetTop
        }
        return getParentNode(node.$parent)
      }
      let parentOffsetTop = getParentNode(this)
      return parentOffsetTop + event.target.offsetTop + headerOffsetTop + event.target.clientHeight
    },

    getOffsetLeft(event, rangeWidth){
      let removeWidth = parseInt((rangeWidth - event.target.clientWidth)/2)
      const getParentNode = node => {
        if (node.$el._prevClass === 'el-table') {
          return node.$el.offsetLeft
        }
        return getParentNode(node.$parent)
      }
      let parentOffsetLeft = getParentNode(this)
      let leftWidth = parentOffsetLeft + event.target.offsetLeft - removeWidth
      let offsetLeft = leftWidth < 0 ? 0 : leftWidth
      let arrowOffsetLeft = leftWidth < 0 ? event.target.offsetLeft + event.target.clientWidth/2 : rangeWidth/2
      return {offsetLeft, arrowOffsetLeft }
    },
    handleCellMouseLeave(event) {
      if(this.VM) {
        this.VM.$el.style.display  = 'none'
      }
    },
  }
};
