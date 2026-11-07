## 插件

### 插件基础

### 关键机制
  resolveId 是 first-result-wins（第一个有效结果优先）的钩子。
  第一个返回非空解析结果的插件会结束这次 resolveId 插件链

```js
const pluginA = {
  name: 'plugin-A',

  resolveId(source) {
    console.log('A:', source)
    return null
  },
}

const pluginB = {
  name: 'plugin-B',

  resolveId(source) {
    console.log('B:', source)

    if (source === 'virtual:hello') {
      return '\0virtual:hello'
    }

    return null
  },
}

const pluginC = {
  name: 'plugin-C',

  resolveId(source) {
    console.log('C:', source)
    return null
  },
}
```
### 插件执行顺序
- Alias
- 带有 enforce: 'pre' 的用户插件
- Vite 核心插件
- 没有 enforce 值的用户插件
- Vite 构建用的插件
- 带有 enforce: 'post' 的用户插件
- Vite 后置构建插件（最小化、manifest、报告）

### 类型校验
`import type { Plugin } from 'vite'`

Cannot find module '@/component/Button' or its corresponding type declarations.
`"paths": {
      "@/*": ["./src/*"]
    },
`