import { showLhLoading, closeLhLoading, closeAllLhLoading } from './store'
import type { LhLoadingHandle, LhLoadingOptions } from './types'

/**
 * 挂载点组件是否已放置（与 message 同款 R7 对策）
 */
let mounted = false

export function setLhLoadingMounted(value: boolean) {
  mounted = value
}

function ensureMounted() {
  if (!mounted) {
    console.error(
      '[lh-ui] useLhLoading 调用时页面未放置 <lh-loading /> 挂载点组件，加载遮罩不会显示。\n' +
        '请在页面或根组件中放置 <lh-loading />，且在 onReady 之后调用（onLoad 阶段组件尚未挂载完毕）。',
    )
  }
}

/**
 * Loading 命令式服务（API 与 plus 仓同构）
 *
 * 【时序约束】所有调用须在页面 onReady 之后。
 * 【MP 限制】仅支持全屏遮罩；target / lock 选项在小程序端被忽略（文档声明）。
 *
 * @example
 * const loading = useLhLoading()
 * const handle = loading.show('加载中')
 * handle.close()
 */
export function useLhLoading() {
  return {
    show: (options: LhLoadingOptions | string = {}) => {
      ensureMounted()
      const opts = typeof options === 'string' ? { text: options } : options
      return showLhLoading(opts)
    },
    close: (id: number) => {
      closeLhLoading(id)
    },
    closeAll: () => {
      closeAllLhLoading()
    },
  }
}

export type LhLoading = ReturnType<typeof useLhLoading>
export type { LhLoadingHandle }
