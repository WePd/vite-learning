import type { Plugin } from 'vite'

export function pluginA(): Plugin {
  return {
    name: 'plugin-a',

    config() {
      console.log('[plugin-a] config')

      return {
        build: {
          sourcemap: true,
        },
      }
    },

    configResolved(config) {
      console.log('[plugin-a] configResolved')
      console.log('[plugin-a] sourcemap:', config.build.sourcemap)
      console.log('[plugin-a] minify:', config.build.minify)
    },
  }
}

export function pluginB(): Plugin {
  return {
    name: 'plugin-b',

    config() {
      console.log('[plugin-b] config')

      return {
        build: {
          minify: false,
        },
      }
    },

    configResolved(config) {
      console.log('[plugin-b] configResolved')
      console.log('[plugin-b] sourcemap:', config.build.sourcemap)
      console.log('[plugin-b] minify:', config.build.minify)
    },
  }
}