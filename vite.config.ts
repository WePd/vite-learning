import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'

// 我自己的插件

function pluginA(): Plugin {
  return {
    name: 'my-first-plugin',

    // resolveId 钩子参与模块解析
    /*
    source: 当前要解析的模块标识符
    importer：发起这次导入的模块 ID；某些特殊场景下可能是入口 HTML 对应的路径
    */
    resolveId(source, importer) {
      console.log('source:', source)
      console.log('importer:', importer)

    },
    enforce: 'pre',
    /*
    pre: 在 Vite 核心插件之前调用该插件
      默认是在vite核心插件之后调用的
    post：在 Vite 构建插件之后调用该插件
    */
    // enforce: "pre",
    configResolved(config) {
      console.log("config:", config.root)
    },
    // 不是执行一次
    transform(code, id) {
      if (id.endsWith('.tsx')) {
        console.log('[plugin-a] 执行')
        console.log('正在处理 TSX:', id)

        // return {
        //   code: `${code}\nconsole.log('[my-plugin] module loaded:', ${JSON.stringify(id)})`,
        //   map: null,
        // }
        // 验证代码是否在插件之间传递
        return `${code}\nconst fromPluginA = 'hello from A'`
      }
    },

  }
}

function pluginB(): Plugin {
  return {
    name: 'plugin-b',

    enforce: 'pre',

    transform(code, id) {
      if (id.endsWith('.tsx')) {
        console.log('[plugin-b] 执行')
        // 验证
        console.log(
          '[plugin-b] 是否接收到 A 的代码:',
          code.includes('fromPluginA'),
        )

        return `${code}\nconsole.log('plugin-b')`
      }
    },
  }
}


function myPlugin(options: { prefix: string }): Plugin {
  let count = 0
  console.log('[my-plugin] 工厂函数执行')

  return {
    name: 'my-plugin',
    // build 在构建模式下使用  serve则是在开发服务器模式下使用
    apply: 'serve',
    enforce: 'pre',
    // 开发服务器启动时执行
    buildStart() {
      console.log('[my-plugin] buildStart')
    },

    // 解析模块 ID 这个 import 到底指向谁？
    resolveId(source, importer) {
      // if (source === 'F:/frend-end/vite8-learning/src/component/Button.tsx') {
      //   console.log(source, importer);
      // }
      console.log('[my-plugin] resolveId:', source, importer)
      return null
    },
    // 转换模块内容  修改
    transform(code: string, id: string) {
      count++
      if (id.endsWith('.tsx')) {
        console.log('[my-plugin] transform:', id, count)
      }
      return null
    },
    // 加载模块内容 源码
    load() {

    },
  }
}

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
  // 插件
  plugins: [react(), pluginA(), pluginB(), myPlugin({
    prefix: '[my-plugin]'
  })],
  // plugins: [react(), myPlugin({
  //   prefix: '[my-plugin]'
  // })],

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
