<template>
  <div class="el-table">
    <div class="el-table__header-wrapper" ref="headerWrapper">
      <table-header
        ref="tableHeader"
        :store="store"
        :style="{ width: layout.bodyWidth ? layout.bodyWidth + 'px' : ''}"
        >
      </table-header>
    </div>
    <div class="el-table__body-wrapper" ref="bodyWrapper" :style="`height: ${bodyHeight}px;`">
      <table-body
        ref="tableBody"
        :store="store"
        :style="{ width: layout.bodyWidth ? layout.bodyWidth + 'px' : ''}">
      </table-body>
    </div>
  </div>
</template>

<script>
  import {createStore} from './store/index'
  import { debounce} from 'throttle-debounce';
  import { addResizeListener, removeResizeListener } from '@/utils/resize-event';
  import TableLayout from './layout/table-layout';
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

      bodyHeight: {
        type: [Number,String],
        default: 300
      },

      index: {
        type: Boolean,
        default: false
      },

      showTip: {
        type: Boolean,
        default: true
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
        this.doLayout();
      },

      doLayout() {
        this.layout.updateColumnsWidth();
      },
    },

    computed: {

      bodyWrapper() {
        return this.$refs.headerWrapper;
      },
      bodyWidth() {
        const { bodyWidth } = this.layout;
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
      this.doLayout();
      this.store.updateColumns(this.layout.bodyWidth);
      this.$ready = true;
    },
    destroyed() {
      this.unbindEvents();
    },
    data() {
      this.store = createStore(this)
      const layout = new TableLayout({
        height: this.bodyHeight,
        store: this.store,
        table: this,
        fit: this.fit,
        index: this.index
      });
      return {
        layout,
        isHidden: false,
      };
    }
  };
</script>
