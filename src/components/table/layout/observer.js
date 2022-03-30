export default {
  computed: {
    tableLayout() {
      let layout = this.layout;
      if (!layout && this.table) {
        layout =  this.table.layout || this.table.$parent.layout;
      }
      if (!layout) {
        throw new Error('Can not find table layout.');
      }
      return layout;
    }
  },

  mounted() {
    this.onColumnsChange(this.tableLayout);
  },

  updated() {
    this.onColumnsChange(this.tableLayout);
  },

  methods: {
    onColumnsChange(layout) {
      const column = layout.store.tableHeader;
      const cols = this.$el.querySelectorAll('colgroup > col');
      if (!cols.length) return;
      for (let i = layout.index ? 1 : 0, j = cols.length; i < j; i++) {
        const col = cols[i];
        const name = col.getAttribute('name');
        if (name) {
          col.setAttribute('width', column[i]?.width);
        }
      }
    },
    
  }
};
