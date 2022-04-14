import { defineConfig, loadEnv } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
const { resolve } =  require('path');

export default ({ mode}) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig ({
    test: {
      globals: true,
      environment: 'jsdom',
      coverage: {
        reporter: ['text', 'json', 'html']
      }
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
    },
    server: {
      host: '127.0.0.1',
      open: true
    },
    build: {
      rollupOptions: {
        external: ['vue'],
        output: {
          globals: {
            vue: 'Vue',
          }
        }
      },
      outDir: process.env.VITE_APP_DIR,
      minify: process.env.NODE_ENV === 'production'? 'terser' : "esbuild",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log']
        },
        output: {
          comments: process.env.NODE_ENV !== 'production',
        },
      },
      lib: {
        entry: 'src/components/table/index.js',
        name: 'vue-table-scroll'
      }
    }
  })
};
