import { createVuePlugin } from 'vite-plugin-vue2'
const { resolve } =  require('path')
import fs from 'fs/promises';

export default {
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'json', 'html']
    },
  },
  plugins: [
    createVuePlugin({
      jsx: true
    })
  ],
  resolve: {
    alias: [
      {find: '@', replacement: resolve(__dirname, 'src')}
    ]
  }
}
