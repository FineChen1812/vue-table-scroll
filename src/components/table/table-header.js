// import { mapStates } from './store/helper';
import LayoutObserver from './layout/observer';

export default {
  name: 'tableHeader',
  mixins: [LayoutObserver],
  render(h) {
    const tableHeader = this.store.tableHeader
    const isIndex = this.tableLayout.index
    return (
      <table
        class="el-table_header"
        cellspacing="0"
        cellpadding="0"
        border="0">
        <colgroup>
          {isIndex&&<col name={ `el-table_1_column_0` }  width="50" />}
          {
            tableHeader.map((column,index) => !column.hidden && <col name={ `el-table_1_column_${index+1}` } align="center" key={index} />)
          }
          
        </colgroup>
        <thead class={ ['is-group'] }>
          {
            <tr>
              {
                isIndex && <th class={['el-table__cell']}>序号</th>
              }
              {
                tableHeader.map((column, cellIndex) => (
                  !column.hidden && <th
                  colspan={ column.colSpan }
                  rowspan={ column.rowSpan }
                  key={ column.id }
                  class={ this.getHeaderCellClass() }
                  >
                    
                  <div class={ ['cell', column.filteredValue && column.filteredValue.length > 0 ? 'highlight' : '', column.labelClassName] }>
                    {
                      column.label
                    }
                  </div>
                </th>))
              }
            </tr>
          }
        </thead>
      </table>
    )
  },

  props: {
    store: {
      required: true
    },
  },

  computed: {
    table() {
      return this.$parent;
    },

    hasGutter() {
      return true
    },

  },
  created() {
  },
  methods: {
    

    getHeaderCellClass(rowIndex, columnIndex, row, column) {
      const classes = [];

      classes.push('el-table__cell');

      return classes.join(' ');
    },
    
  },

  data() {
    return {
      draggingColumn: null,
      dragging: false,
      dragState: {}
    };
  }
}