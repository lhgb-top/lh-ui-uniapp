/**
 * easycom 等价的测试挂载 helper
 *
 * uni 的 easycom 在构建链里把 `<lh-xxx>` 自动解析到 src/components/lh-xxx/lh-xxx.vue；
 * vitest 用的是原生 @vitejs/plugin-vue，没有这一步，`<lh-icon>` 会被当成未知自定义元素。
 * 这里把全部 SFC 预注册为全局组件（与 pages.json 的 easycom 规则一一对应），
 * 并 stub 掉 root-portal 在 H5 分支用的 teleport，让弹层内容在原位可断言。
 */
import { mount as vtMount } from '@vue/test-utils'
import type { Component } from 'vue'

const modules = import.meta.glob('../src/components/lh-*/lh-*.vue', { eager: true })

/** kebab-case 标签名 → PascalCase 组件名，两种写法都注册（模板里两种风格都可能出现） */
function toPascal(name: string): string {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

const lhGlobals: Record<string, Component> = {}
for (const path of Object.keys(modules)) {
  const fileName = path.split('/').pop()!.replace(/\.vue$/, '')
  const component = (modules[path] as { default: Component }).default
  lhGlobals[fileName] = component
  lhGlobals[toPascal(fileName)] = component
}

export function mount(component: Component, options: Record<string, unknown> = {}) {
  return vtMount(component, {
    ...options,
    global: {
      stubs: { teleport: true },
      ...(options.global as Record<string, unknown> | undefined),
      components: {
        ...lhGlobals,
        ...((options.global as Record<string, unknown> | undefined)?.components as
          | Record<string, Component>
          | undefined),
      },
    },
  })
}

export { lhGlobals }
