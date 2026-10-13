import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { canClose, getDialogStyle, getDialogPopperClass } from '@lh-ui/share/core/dialog'
import { useLhComponent } from '@/composables'
import { useLhZIndex, useLhOverlayStack } from '@/composables'
import { lockLhBodyScroll } from '@/adapter/lock-scroll'
import { LH_IS_H5 } from '@/adapter/platform'
import { lhlocale } from '@/adapter/locale'
import type { LhEmitFn } from '@/types/emit'
import type { LhDialogProps } from './types'

/**
 * Dialog 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - 焦点圈：MP 端无键盘焦点语义，share 的 focus-trap / getFocusableElements 直接不调用
 *   （share.shouldTrapFocus 仍用于判定，但由 LH_IS_H5 守卫后在 MP 恒为 false）
 * - 锁定滚动：MP 无 body 滚动锁定能力，仅 H5 端执行 document.body.style.overflow
 * - 滚动条宽度：MP 端 getScrollbarWidth 返回 0（share 已有 typeof window 守卫，双保险）
 * - 关闭动画：transitionend 在 MP 不可靠，用 setTimeout 对齐 SCSS transition 时长
 */
export function useLhDialog(
  props: LhDialogProps,
  emit: LhEmitFn<'update:modelValue' | 'open' | 'close'>,
) {
  const { componentStyle } = useLhComponent('dialog', props)
  const { nextZIndex } = useLhZIndex()
  const { register, unregister, isTopmost } = useLhOverlayStack()

  // 初值跟随 modelValue：挂载时 modelValue=true 不会触发 watch，需自行 open
  const visible = ref(props.modelValue ?? false)
  const closing = ref(false)
  const zIndex = ref(props.zIndex ?? nextZIndex())

  /** 进入/离开动画时长（与 share 的 SCSS transition 对齐，MP 端用 setTimeout 替代 transitionend） */
  const TRANSITION_MS = 300

  const dialogClass = computed(() =>
    getDialogPopperClass({
      visible: visible.value,
      position: props.position,
      fullscreen: props.fullscreen,
    } as never),
  )

  const dialogStyle = computed(() => {
    const style: Record<string, string> = {
      ...componentStyle.value,
      ...getDialogStyle({
        top: props.top,
        zIndex: zIndex.value,
        position: props.position,
      } as never),
    }
    return style
  })

  /** 卡片样式：宽度只作用于对话框本体，不污染定位容器 */
  const dialogContentStyle = computed(() => {
    if (props.width === undefined || props.fullscreen) return {}
    return { width: typeof props.width === 'number' ? `${props.width}px` : props.width }
  })

  /** 默认按钮文案国际化（lhlocale.t 内部已订阅版本号，切换语言自动重算） */
  const confirmText = computed(() => lhlocale.t('dialog.confirm', '确定'))
  const cancelText = computed(() => lhlocale.t('dialog.cancel', '取消'))

  let restoreOverflow: (() => void) | undefined

  function open() {
    if (visible.value) return
    zIndex.value = props.zIndex ?? nextZIndex()
    register()
    visible.value = true
    closing.value = false

    // #ifdef H5
    if (props.lockScroll) {
      restoreOverflow = lockLhBodyScroll()
    }
    // #endif

    emit('update:modelValue', true)
    emit('open')
  }

  /**
   * 关闭弹层。
   *
   * 【isTopmost 的适用范围】「只关栈顶」是遮罩点击 / Esc 的交互语义（防止越层关闭），
   * 外部 v-model 主动置 false 时不应被拦截——否则多弹层叠加时，非栈顶弹层的
   * footer 取消按钮会失效（visible 已改但被 isTopmost 吞掉，形成死锁）。
   */
  function close(options?: { interactive?: boolean }) {
    if (!visible.value || closing.value) return
    if (options?.interactive && !isTopmost()) return
    closing.value = true

    // 动画结束后真正隐藏（MP 端 transitionend 不可靠，用 setTimeout 对齐）
    setTimeout(() => {
      visible.value = false
      closing.value = false
      unregister()
      emit('update:modelValue', false)
      emit('close')
    }, TRANSITION_MS)

    // #ifdef H5
    restoreOverflow?.()
    restoreOverflow = undefined
    // #endif
  }

  function handleMaskClick() {
    if (canClose({ closeOnClickModal: props.closeOnClickModal }, 'modalClick')) {
      close({ interactive: true })
    }
  }

  // #ifdef H5
  function handleEsc() {
    if (!LH_IS_H5 || !visible.value || !isTopmost()) return
    if (canClose({ closeOnPressEscape: props.closeOnPressEscape }, 'escape')) {
      close({ interactive: true })
    }
  }
  // #endif

  // modelValue 双向同步（外部 v-model 控制打开/关闭）
  watch(
    () => props.modelValue,
    (value) => {
      if (value && !visible.value) open()
      else if (!value && visible.value) close()
    },
  )

  onMounted(() => {
    // 初始 modelValue=true：watch 不会触发，补上弹层栈注册与 H5 滚动锁（对齐 plus 仓）
    if (!visible.value) return
    register()
    // #ifdef H5
    if (props.lockScroll) {
      restoreOverflow = lockLhBodyScroll()
    }
    // #endif
  })

  onBeforeUnmount(() => {
    // #ifdef H5
    restoreOverflow?.()
    // #endif
    unregister()
  })

  return {
    visible,
    closing,
    zIndex,
    dialogClass,
    dialogStyle,
    dialogContentStyle,
    confirmText,
    cancelText,
    open,
    close,
    handleMaskClick,
    handleEsc,
  }
}
