import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'

import myPlugin from './plugins/my-plugin-config.ts'
import lifecyclePlugin from './plugins/lifecycle-plugin.ts'
import { pluginA, pluginB } from './plugins/lifecycle-plugin.ts'


// https://vite.dev/config/
export default defineConfig({
  build: {
    assetsInlineLimit: 4096
  },
  resolve: {
    // alias 别名解析
    alias: {
      '@': path.resolve(import.meta.dirname, 'src')
    }
  },

  plugins: [react(), pluginB(), pluginA()],

  // 依赖优化
  optimizeDeps: {
    // 强制将指定依赖加入预构建
    /*
    常见场景：
    - 插件动态注入了依赖。
    - 依赖没有被自动扫描发现。
    - 某个 CommonJS 依赖需要预构建。
    - 某个依赖内部模块很多，需要优化加载。
    */
    include: [],
    // 排除指定依赖，不让依赖优化器预构建它
    exclude: []
  }
})
