<template>
  <div class="el-table">
    <div ref="headerWrapper" class="el-table__header-wrapper">
      <table-header
        ref="tableHeader"
        :store="store"
        :style="{ width: parentWidth ? parentWidth + 'px' : '' }"
      />
    </div>
    <div
      ref="bodyWrapper"
      class="el-table__body-wrapper"
      :style="`height: ${mergeOption.bodyHeight}px;`"
    >
      <img-empty v-if="isEmpty"></img-empty>
      <table-body
        v-else
        ref="tableBody"
        :key="updateKey"
        :store="store"
        :style="{ width: parentWidth ? parentWidth + 'px' : '' }"
      />
    </div>
  </div>
</template>

<script>
import { addResizeListener, removeResizeListener } from './utils/resize-event'
import TableBody from './body'
import TableHeader from './header'
import ImgEmpty from '../empty/imgEmpty.vue'
import '@/style/element-style/theme-chalk/index.css'
import { parseWidth } from './utils/util'

export default {
  name: 'TableScroll',

  components: {
    TableHeader,
    TableBody,
    ImgEmpty
  },
  props: {
    tableHeader: {
      type: Array,
      default: function () {
        return []
      }
    },
    tableData: {
      type: Array,
      default: function () {
        return []
      }
    },

    options: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    return {
      store: {
        tableHeader: [],
        tableData: [],
        table: this
      },
      updateKey: 0,
      tableHeaderData: [],
      tableBodyData: [],
      bodyWidth: '',
      isEmpty: true
    }
  },

  computed: {
    defaultOptions() {
      return {
        bodyHeight: 300,
        index: false,
        showTip: true
      }
    },
    mergeOption() {
      return Object.assign({}, this.defaultOptions, this.options)
    },

    bodyWrapper() {
      return this.$refs.headerWrapper
    },
    parentWidth() {
      const bodyWidth = this.bodyWidth
      // this.updateColumns(bodyWidth)
      this.initData()
      return bodyWidth
    }
  },
  watch: {
    tableHeader: {
      immediate: true,
      handler(value) {
        this.tableHeaderData = value
      }
    },
    tableData: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal?.length > 0 && oldVal !== newVal) {
          this.isEmpty = false
          this.updateKey++
          this.tableBodyData = newVal
        } else {
          this.isEmpty = true
        }
      }
    }
  },
  mounted() {
    this.bindEvents()
    this.updateColumnsWidth()
    this.updateColumns(this.bodyWidth)
    this.$ready = true
  },
  destroyed() {
    this.unbindEvents()
  },

  methods: {
    initData() {
      this.store.tableData = this.tableBodyData
      this.store.tableHeader = this.tableHeaderData.filter(item => !item.hidden)
    },
    bindEvents() {
      addResizeListener(this.$el, this.resizeListener)
    },

    unbindEvents() {
      removeResizeListener(this.$el, this.resizeListener)
    },

    resizeListener() {
      if (!this.$ready) return
      this.updateColumnsWidth()
    },
    updateColumnsWidth() {
      this.bodyWidth = this.$el.clientWidth
    },
    updateColumns(bodyWidth) {
      bodyWidth = bodyWidth || this.$el.clientWidth
      let tables = this.tableHeaderData.filter(item => !item.hidden)
      let indexWidth = this.mergeOption.index ? 50 : 0
      let widthSum = 0
      let num = 0
      for (let i = 0; i < tables.length; i++) {
        if (tables[i].width) {
          widthSum += parseWidth(tables[i].width)
          parseWidth(tables[i].width) && num++
        }
      }
      const width = parseWidth(
        (bodyWidth - widthSum - indexWidth) / (tables.length - num)
      )
      const header = (this.store.tableHeader = tables)
      header.forEach((item, index) => {
        if (!item.width) {
          this.$set(header[index], 'width', width)
        }
      })
    }
  }
}
</script>
