import type { Plugin } from 'vite'

export default function myVirtualPlugin(): Plugin {

  const publicId = 'virtual:my-config'
  const resolvedId = '\0' + publicId

  return {
    name: 'my-virtual-plugin',
    resolveId(source) {
      if (source === publicId) {
        console.log('[virtual-plugin] resolveId:', source)

        return resolvedId
      }
      return null
    },

    load(id) {
      if (id === resolvedId) {
        console.log('[virtual-plugin] load:', id)
        return `
          const config = {
            name: 'Vite Learning',
            version: '8.3.6',
            author: 'My Plugin'
          }

          export default config
        `
      }
      return null
    }
  }
}