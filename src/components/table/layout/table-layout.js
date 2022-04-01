import Vue from 'vue';


class TableLayout {
  constructor(options) {
    this.index= null;
    this.table = null;
    this.store = null;
    this.columns = null;
    this.height = null;
    this.bodyWidth = null;
    
    for (let name in options) {
      if (options.hasOwnProperty(name)) {
        this[name] = options[name];
      }
    }

    if (!this.table) {
      throw new Error('table is required for Table Layout');
    }
    if (!this.store) {
      throw new Error('store is required for Table Layout');
    }
  }



  updateColumnsWidth() {
    const bodyWidth = this.table.$el.clientWidth;
    this.bodyWidth = bodyWidth
    // this.bodyWidth = 1000
  }

}

export default TableLayout;
