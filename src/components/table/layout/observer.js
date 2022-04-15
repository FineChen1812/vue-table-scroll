export default {
  computed: {
    tableLayout() {
      let layout
      if (this.table) {
        layout = this.table || this.table.$parent
      }
      if (!layout) {
        throw new Error('Can not find table')
      }
      return layout
    }
  },
  mounted() {
    this.onColumnsChange(this.tableLayout)
  },
  updated() {
    // this.onColumnsChange(this.tableLayout);
  },
  methods: {
    onColumnsChange(layout) {
      const column = layout.store.tableHeader
      const cols = this.$el.querySelectorAll('colgroup > col')
      if (!cols.length) return
      for (let i = layout.index ? 1 : 0, j = cols.length; i < j; i++) {
        const col = cols[i]
        const name = col.getAttribute('name')
        // col width属性h5虽已废弃，但是主流浏览器目前还支持 https://caniuse.com/?search=col%20width
        if (name) {
          col.setAttribute('width', column[i]?.width)
        }
      }
    }
  }
}
