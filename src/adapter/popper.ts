/**
 * 弹层定位适配 —— 把 getLhRect 结果喂给 share 的 computePosition
 *
 * share 的 computePosition(trigger, popper, viewport, opts) 是纯函数，
 * 入参全是 LhDOMRectLike 纯数据，本模块只负责「异步量两个矩形 → 喂纯函数 → 写响应式 style」。
 *
 * 【时序】measure → 定位 → 显示（防闪烁，wot 验证过的模式）：
 *   1. 气泡先以 visibility:hidden 渲染（不占文档流可见性，但能被 SelectorQuery 量到尺寸）
 *   2. getLhRect 量 trigger + 气泡两个矩形；getLhWindowInfo 取 viewport
 *   3. computePosition 算出 { top, left, placement, arrowOffset }
 *   4. 写入响应式 popperStyle，下一帧（nextTick + setTimeout 双保险）切 visible
 *
 * 【为什么必须两帧】气泡不先渲染一次，SelectorQuery 量到的 width/height 是 0，
 * computePosition 的 shift（交叉轴居中）和 flip（翻转）会全部失效。
 */
import { ref, nextTick } from 'vue'
import type { Ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { computePosition } from '@lh-ui/share/core/shared/popper'
import type { LhComputePositionOptions, LhPopperPosition } from '@lh-ui/share/core/shared/popper'
import { getSingleLhRect, type LhDOMRectLike } from './getRect'
import { getLhWindowInfo } from './platform'

export interface UseLhPopperOptions extends LhComputePositionOptions {
  /** 定位计算前的钩子（如记录 placement 供动画类名用） */
  onPositioned?: (position: LhPopperPosition) => void
  /**
   * 弹层宽度跟随触发器（select 下拉框语义）。
   * teleport 后弹层脱离了触发器的 relative 容器，left/right 拉伸失效，
   * 宽度会塌缩到内容宽；tooltip 这类内容宽弹层不要开。
   */
  matchTriggerWidth?: boolean
}

export interface UseLhPopperReturn {
  /** 气泡定位样式，直接绑定到弹层根节点 :style */
  popperStyle: Ref<Record<string, string>>
  /** 气泡是否已定位完成（控制 visibility，防初始闪烁） */
  visible: Ref<boolean>
  /** 最近一次定位结果（含 placement 与 arrowOffset） */
  position: Ref<LhPopperPosition | null>
  /** 触发一次重新定位（mounted 后调用） */
  update: () => Promise<void>
}

/**
 * @param triggerSelector 触发节点选择器（组件内 id，如 '#trigger'）
 * @param popperSelector 气泡节点选择器
 * @param scope 组件实例 proxy（组件内必须传）
 */
export function useLhPopper(
  triggerSelector: string,
  popperSelector: string,
  scope: ComponentPublicInstance | null,
  options: UseLhPopperOptions = {},
): UseLhPopperReturn {
  const popperStyle = ref<Record<string, string>>({})
  const visible = ref(false)
  const position = ref<LhPopperPosition | null>(null)

  const { onPositioned, ...computeOpts } = options

  async function update() {
    // 先让气泡以隐藏态渲染，才能量到真实尺寸（两帧度量）
    visible.value = false
    popperStyle.value = { visibility: 'hidden' }

    await nextTick()
    // 再等一帧，确保隐藏态的 DOM 已提交（MP 渲染同步性弱于 H5）
    await new Promise((resolve) => setTimeout(resolve, 0))

    let trigger: LhDOMRectLike
    let popper: LhDOMRectLike
    try {
      trigger = await getSingleLhRect(triggerSelector, scope)

      // 宽度跟随触发器时，必须先把 width 写进弹层再量弹层：
      // 否则 computePosition 拿到的是内容宽（远小于触发器宽），
      // 居中算出的 left 与最终实际宽度错位（实测左偏约 (triggerW - contentW)/2）
      if (options.matchTriggerWidth) {
        popperStyle.value = { visibility: 'hidden', width: `${trigger.width}px` }
        await nextTick()
        await new Promise((resolve) => setTimeout(resolve, 0))
      }

      popper = await getSingleLhRect(popperSelector, scope)
    } catch (e) {
      // 节点不存在（组件已卸载等），保持隐藏态。度量失败不静默：
      // 弹层会停在 visibility:hidden，不告警的话使用者完全排查不到为什么没反应
      console.error('[lh-ui] 弹层定位失败，节点度量异常：', triggerSelector, popperSelector, e)
      return
    }

    const viewport = getLhWindowInfo()
    const result = computePosition(trigger, popper, viewport, computeOpts)
    position.value = result
    onPositioned?.(result)

    popperStyle.value = {
      position: 'fixed',
      top: `${result.top}px`,
      left: `${result.left}px`,
      visibility: 'visible',
      // teleport 弹层脱离 relative 容器，需显式同步触发器宽度（下拉框语义）
      ...(options.matchTriggerWidth ? { width: `${trigger.width}px` } : {}),
    }

    // 下一帧再切可见，避免与样式写入同帧造成闪现
    nextTick(() => {
      visible.value = true
    })
  }

  return {
    popperStyle,
    visible,
    position,
    update,
  }
}
