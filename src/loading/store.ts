import { reactive } from 'vue'
import { getLoadingClassNames } from '@lh-ui/share/core/loading'
import { useLhZIndex } from '@/composables'
import type { LhLoadingHandle, LhLoadingOptions } from './types'

/**
 * Loading 单例 store（模块级 reactive 队列）
 *
 * 【与 plus 的根本差异】plus 每次调用 createApp 新建遮罩实例 mount 到 target；
 * 小程序无法 JS 创建 DOM，改为「单例 store + 页面放 <lh-loading /> 挂载点组件」。
 * 多次 show 返回各自的 handle，close 只关自己那个实例。
 */
export interface LhLoadingInstance {
  id: number
  text?: string
  background?: string
  zIndex: number
  visible: boolean
}

export const lhLoadingInstances = reactive<LhLoadingInstance[]>([])

const { nextZIndex } = useLhZIndex()
let seq = 0

/**
 * 显示全屏加载遮罩。
 *
 * @returns handle，调 close() 关闭该实例
 */
export function showLhLoading(options: LhLoadingOptions = {}): LhLoadingHandle {
  seq += 1
  const instance: LhLoadingInstance = reactive({
    id: seq,
    text: options.text,
    background: options.background,
    zIndex: options.zIndex ?? nextZIndex(),
    visible: true,
  })

  lhLoadingInstances.push(instance)

  return {
    close: () => closeLhLoading(instance.id),
  }
}

/** 关闭指定实例 */
export function closeLhLoading(id: number) {
  const index = lhLoadingInstances.findIndex((item) => item.id === id)
  if (index === -1) return
  lhLoadingInstances.splice(index, 1)
}

/** 关闭全部 */
export function closeAllLhLoading() {
  lhLoadingInstances.splice(0, lhLoadingInstances.length)
}

/** 供挂载点组件计算类名（复用 share 纯函数） */
export function getLhLoadingClass(instance: LhLoadingInstance) {
  return getLoadingClassNames({
    fullscreen: true,
    withText: Boolean(instance.text),
  })
}
