import type { Plugin, ResolvedConfig } from 'vite'

export default function myPlugin(): Plugin {
  let resolvedConfig: ResolvedConfig

  return {
    name: 'my-plugin',

    config(config, { command, mode }) {
      console.log('[config] 执行')
      console.log('command:', command)
      console.log('mode:', mode)

      return {
        resolve: {
          alias: {
            '@utils': '/src/utils',
          },
        },
        build: {
          sourcemap: true
        }
      }
    },

    //读取 Vite 最终解析完成的配置
    configResolved(config) {
      resolvedConfig = config

      console.log('[configResolved] 执行', config.resolve.alias)
      // console.log('root:', config.root)
      // console.log('command:', config.command)
      // console.log('mode:', config.mode)

    },
    // 获取开发服务器实例，以及注册中间件  生产构建不会调用
    configureServer(server) {
      console.log('[configureServer] 执行')
      // 前置中间件
      server.middlewares.use((req, res, next) => {
        if (req.url === '/my-api') {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            message: 'Hello from my plugin',
          }))
          return
        }

        next()
      })
      // 后置中间件
      return () => {
        server.middlewares.use((req, res, next) => {
          next()
        })
      }
    }
  }
}