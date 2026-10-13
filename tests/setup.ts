/**
 * 测试环境全局桩
 *
 * - uni：H5 目标下大部分 API 走 window，但 createSelectorQuery 等小程序 API
 *   在组件胶水里是无条件调用的（getLhRect），给一个返回零尺寸的桩，真实度量由
 *   各弹层测试按需 vi.mock('@/adapter/getRect') 覆盖
 * - teleport：root-portal 在 H5 分支用 teleport 脱离文档流，VTU 默认渲染到
 *   document.body 导致 wrapper.find 找不到弹层内容，统一 stub 到原位
 * - uni 内置组件（scroll-view 等）：不在这里桩，改由 vitest.config 的
 *   isCustomElement 声明为自定义元素，Vue 会原样渲染并保留子节点结构
 */
import { config } from '@vue/test-utils'

const uniStub = {
  createSelectorQuery: () => {
    const empty = { top: 0, left: 0, width: 0, height: 0, right: 0, bottom: 0 }
    const chain = {
      in: () => chain,
      select: () => chain,
      selectAll: () => chain,
      boundingClientRect: (cb: (rect: unknown) => void) => {
        cb(empty)
        return chain
      },
      exec: () => chain,
    }
    return chain
  },
  getWindowInfo: () => ({ windowWidth: 375, windowHeight: 667 }),
  getAppBaseInfo: () => ({ SDKVersion: '3.0.0' }),
  setStorageSync: () => {},
  getStorageSync: () => '',
}

;(globalThis as Record<string, unknown>).uni = uniStub

config.global.stubs = {
  teleport: true,
}
