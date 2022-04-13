import vueTableScroll from './table.vue'

vueTableScroll.install = (Vue, options = {}) => {
  Vue.component(options.componentName || vueTableScroll.name, vueTableScroll)
}

if (typeof window !== 'undefined' && window.Vue) {
  // eslint-disable-next-line
  Vue.component(vueTableScroll.name, vueTableScroll)
}

export default vueTableScroll
