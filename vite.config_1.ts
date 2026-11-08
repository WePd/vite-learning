import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import myVirtualPlugin from './plugins/my-virtual-plus.ts'

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
    // enforce: 'pre',
    /*
    pre: 在 Vite 核心插件之前调用该插件
      默认是在vite核心插件之后调用的
    post：在 Vite 构建插件之后调用该插件
    */
    // enforce: "pre",
    configResolved(config) {
      console.log("config:", config.root)
    },

    load(id) {
      // if (id.endsWith('/Button.tsx')) {
      //   console.log("[plus-a]-执行", id);

      //   return null
      // }
      if (id.endsWith('/Button.tsx')) {
        console.log("[plus-a]-执行", id);

        return `
          export default function Button() {
            return 'Hello from my plugin'
        }`
      }
      return null
    }

    // 不是执行一次
    // transform(code, id) {
    //   if (id.endsWith('.tsx')) {
    //     console.log('[plugin-a] 执行')
    //     console.log('正在处理 TSX:', id)

    //     // return {
    //     //   code: `${code}\nconsole.log('[my-plugin] module loaded:', ${JSON.stringify(id)})`,
    //     //   map: null,
    //     // }
    //     // 验证代码是否在插件之间传递
    //     return `${code}\nconst fromPluginA = 'hello from A'`
    //   }
    // },
  }
}

function pluginB(): Plugin {
  return {
    name: 'plugin-b',

    enforce: 'pre',

    // transform(code, id) {
    //   if (id.endsWith('.tsx')) {
    //     console.log('[plugin-b] 执行')
    //     // 验证
    //     console.log(
    //       '[plugin-b] 是否接收到 A 的代码:',
    //       code.includes('fromPluginA'),
    //     )

    //     return `${code}\nconsole.log('plugin-b')`
    //   }
    // },

    load(id) {
      // if (id.endsWith('/Button.tsx')) {
      //   console.log("[plus-b]-执行", id);

      //   return `
      //     export default function Button() {
      //       return 'Hello from my plugin'
      //   }`
      // }
      return null
    }
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

    // 加载模块内容 源码
    load(id) {
      // console.log('[my-plugin] load:', id)
      // if (id.endsWith('/Button.tsx')) {
      //   return `
      //     export default function Button() {
      //       return 'Hello from my plugin'
      //   }`
      // }

      if (id.endsWith('/Button.tsx')) {
        console.log('[my-plugin] 接管 Button 模块')
        return `
          export default function Button() {
            return <button>这是插件提供的 Button</button>
          }
        `
      }
      return null
    },

    // 转换模块内容  修改
    transform(code, id) {
      count++
      if (id.endsWith('.tsx')) {
        console.log('[my-plugin] transform:', id, count)
      }
      if (id.endsWith('/Button.tsx')) {
        // 返回字符串
        // return code.replace('这是插件提供的 Button', '这是被transform修改的 Button')

        // 返回对象
        const newCode = code.replace('这是插件提供的 Button', '这是被transform修改的 Button')
        return {
          code: newCode,
          map: null
        }

      }
      return null
    },
  }
}


// 测试顺序
// function createOrderPlugin(
//   name: string,
//   enforce?: 'pre' | 'post',
// ): Plugin {
//   return {
//     name,
//     enforce,
//     // 函数写法
//     // transform(code, id) {
//     //   if (id.endsWith('/App.tsx')) {
//     //     console.log(`[${name}] transform`)
//     //   }

//     //   return null
//     // },
//     transform:
//       name === 'plugin-A'
//         ? {
//           order: 'pre',
//           handler(code, id) {
//             if (id.endsWith('/App.tsx')) {
//               console.log(`[${name}] transform`)
//             }
//             return null
//           },
//         }
//         : function (code, id) {
//           if (id.endsWith('/App.tsx')) {
//             console.log(`[${name}] transform`)
//           }
//           return null
//         }
//   }
// }

function createTransformPlugin(
  name: string,
  from: string,
  to: string,
): Plugin {
  return {
    name,

    transform(code, id) {
      if (!id.endsWith('/App.tsx')) {
        return null
      }

      console.log(`[${name}] 收到代码：`, code.includes(from))

      const newCode = code.replace(from, to)

      return {
        code: newCode,
        map: null,
      }
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
  // plugins: [react(), pluginA(), pluginB(), myPlugin({
  //   prefix: '[my-plugin]'
  // })],
  // plugins: [react(), myPlugin({
  //   prefix: '[my-plugin]'
  // })],
  // plugins: [react(), pluginA(), pluginB()],
  // plugins: [createOrderPlugin('plugin-A', 'post'),
  // createOrderPlugin('plugin-B', 'pre'),
  // createOrderPlugin('plugin-C')],
  // plugins: [
  //   createTransformPlugin(
  //     'plugin-A',
  //     'Hello',
  //     'Hello A',
  //   ),

  //   createTransformPlugin(
  //     'plugin-B',
  //     'Hello A',
  //     'Hello B',
  //   ),

  //   createTransformPlugin(
  //     'plugin-C',
  //     'Hello B',
  //     'Hello C',
  //   ),
  // ],
  plugins: [react(), myVirtualPlugin()],

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
