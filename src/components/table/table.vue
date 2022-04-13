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
      <component
        :is="module"
        ref="tableBody"
        :store="store"
        :style="{ width: parentWidth ? parentWidth + 'px' : '' }"
      ></component>
      <!-- <table-body
        ref="tableBody"
        :store="store"
        :style="{ width: parentWidth ? parentWidth + 'px' : '' }"
      /> -->
    </div>
  </div>
</template>

<script>
import { createStore } from './store/index'
import { debounce } from 'throttle-debounce'
import { addResizeListener, removeResizeListener } from './utils/resize-event'
import TableBody from './body'
import TableHeader from './header'
import ImgEmpty from '../empty/imgEmpty.vue'
import '@/style/element-style/theme-chalk/index.css'

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
    const store = createStore(this)
    const table = this
    return {
      store,
      table,
      bodyWidth: '',
      module: 'ImgEmpty'
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
      this.store.updateColumns(bodyWidth)
      return bodyWidth
    }
  },
  watch: {
    tableHeader: {
      immediate: true,
      handler(value) {
        this.store.setData('tableHeader', value)
      }
    },
    tableData: {
      // immediate: true,
      handler(value) {
        this.store.setData('tableData', value)
        this.module = 'TableBody'
      }
    }
  },
  created() {
    this.debouncedUpdateLayout = debounce(50, () => this.doLayout())
  },
  mounted() {
    this.bindEvents()
    this.updateColumnsWidth()
    this.store.updateColumns(this.bodyWidth)
    this.$ready = true
  },
  destroyed() {
    this.unbindEvents()
  },

  methods: {
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
    }
  }
}
</script>
