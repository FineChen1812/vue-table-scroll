<template>
  <div class="el-table">
    <div class="el-table__header-wrapper" ref="headerWrapper">
      <table-header
        ref="tableHeader"
        :store="store"
        :style="{ width: parentWidth ? parentWidth + 'px' : ''}"
        >
      </table-header>
    </div>
    <div class="el-table__body-wrapper" ref="bodyWrapper" :style="`height: ${mergeOption.bodyHeight}px;`">
      <table-body
        ref="tableBody"
        :store="store"
        :style="{ width: parentWidth ? parentWidth + 'px' : ''}">
      </table-body>
    </div>
  </div>
</template>

<script>
  import {createStore} from './store/index'
  import { debounce} from 'throttle-debounce';
  import { addResizeListener, removeResizeListener } from '@/utils/resize-event';
  import TableBody from './table-body';
  import TableHeader from './table-header';

  export default {
    name: 'TableScroll',
    props: {
      tableHeader: {
        type: Array,
        default: function() {
          return [];
        }
      },
      tableData: {
        type: Array,
        default: function() {
          return [];
        }
      },

      options: {
        type: Object,
        default: function() {
          return {}
        }
      },
    },

    components: {
      TableHeader,
      TableBody,
    },

    methods: {

      bindEvents() {
        addResizeListener(this.$el, this.resizeListener);
      },

      unbindEvents() {
        removeResizeListener(this.$el, this.resizeListener);
      },

      resizeListener() {
        if (!this.$ready) return;
        this.updateColumnsWidth();
      },
      updateColumnsWidth() {
        this.bodyWidth = this.$el.clientWidth;
      }
    },

    computed: {
      defaultOptions(){
        return {
          bodyHeight: 300,
          index: false,
          showTip: true
        }
      },
      mergeOption(){
        return Object.assign({}, this.defaultOptions, this.options)
      },

      bodyWrapper() {
        return this.$refs.headerWrapper;
      },
      parentWidth() {
        const bodyWidth = this.bodyWidth;
        this.store.updateColumns(bodyWidth)
        return bodyWidth
      },
    },
    watch: {
      tableHeader: {
        immediate: true,
        handler(value) {
          this.store.setData('tableHeader',value)
        }
      },
      tableData: {
        immediate: true,
        handler(value) {
          this.store.setData('tableData',value)
        }
      },
    },
    created() {
      this.debouncedUpdateLayout = debounce(50, () => this.doLayout());
    },
    mounted() {
      this.bindEvents();
      this.updateColumnsWidth();
      this.store.updateColumns(this.bodyWidth);
      this.$ready = true;
    },
    destroyed() {
      this.unbindEvents();
    },
    data() {
      const store = createStore(this)
      const table = this
      return {
        store,
        table,
        bodyWidth: '',
      };
    }
  };
</script>
