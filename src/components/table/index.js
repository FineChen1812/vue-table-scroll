import vueTableScroll from './table.vue'

vueTableScroll.install = (Vue, options = {}) => {
  Vue.component(options.componentName || vueTableScroll.name, vueTableScroll)
}

export default vueTableScroll
