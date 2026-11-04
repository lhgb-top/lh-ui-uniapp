import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import {
  LH_DRAWER_DIRECTION_DEFAULT,
  canDrawerClose,
  getDrawerAria,
  getDrawerClass,
  getDrawerPanelStyle,
} from '@lh-ui/share/core/drawer'
import { isEscapeKey } from '@lh-ui/share/core/shared'
import { generateId } from '@lh-ui/share/utils'
import { useLhComponent, useLhOverlayStack } from '@/composables'
import { lockLhBodyScroll } from '@/adapter/lock-scroll'
import { lhlocale } from '@/adapter/locale'
import type { LhEmitFn } from '@/types/emit'
import type { LhDrawerResolvedProps } from './types'

/**
 * Drawer 组件胶水（逻辑对齐 plus 仓真源）
 *
 * 【uni-app 差异】
 * - 弹层承载走 lh-root-portal（H5 teleport / MP root-portal 或页内 fixed 降级）；
 *   层级由 root-portal 自身的自增 z-index 管理，不像 plus 那样在根节点写 zIndex
 * - 焦点圈（focus-trap）不接入：MP 无键盘焦点语义，对齐 dialog 先例不调 share 的 focus-trap
 * - 锁定滚动：MP 无 body 滚动锁定能力，仅 H5 端执行 document.body 样式锁
 * - 进出过渡：MP 端无 <Transition> 组件、transitionend 不可靠，手工复刻 Vue Transition
 *   的类名时序（起始态隔帧移除 → 动画态），用 setTimeout 对齐 SCSS transition 时长
 */
export function useLhDrawer(
  props: LhDrawerResolvedProps,
  emit: LhEmitFn<'update:modelValue' | 'open' | 'close'>,
) {
  const { componentStyle } = useLhComponent('drawer', props)
  const { register, unregister, isTopmost } = useLhOverlayStack()
  const slots = useSlots()

  // 初值跟随 modelValue：挂载时 modelValue=true 不会触发 watch，需自行登记弹层栈
  const visible = ref(props.modelValue ?? false)
  const closing = ref(false)

  const drawerId = generateId('lh-drawer')
  const titleId = generateId('lh-drawer-title')

  /** 进入/离开动画时长（与 share 的 SCSS transition 对齐，双端统一用 setTimeout 驱动） */
  const TRANSITION_MS = 300

  /**
   * 过渡阶段（手工复刻 Vue Transition 的类名时序）：
   * - enter-from：起始态（面板滑出视口 + 遮罩透明）与动画态类同时挂
   * - enter：隔帧移除起始态，CSS transition 从起始值过渡到最终值
   * - leave：离开动画态（面板滑回视口外 + 遮罩淡出）
   */
  const phase = ref<'idle' | 'enter-from' | 'enter' | 'leave'>('idle')

  let enterTimer: ReturnType<typeof setTimeout> | undefined
  let closeTimer: ReturnType<typeof setTimeout> | undefined

  function clearEnterTimer() {
    if (enterTimer) {
      clearTimeout(enterTimer)
      enterTimer = undefined
    }
  }

  const transitionClass = computed(() => {
    switch (phase.value) {
      case 'enter-from':
        return ['lh-drawer-fade-enter-active', 'lh-drawer-fade-enter-from']
      case 'enter':
        return ['lh-drawer-fade-enter-active']
      case 'leave':
        return ['lh-drawer-fade-leave-active', 'lh-drawer-fade-leave-to']
      default:
        return []
    }
  })

  const direction = computed(() => props.direction ?? LH_DRAWER_DIRECTION_DEFAULT)

  /** 根类名：lh-drawer + 方向修饰（share 纯函数产出）+ 过渡态类 + 自定义类名 */
  const drawerClass = computed(() => [
    ...getDrawerClass({ direction: direction.value }),
    ...transitionClass.value,
    ...(props.customClass ? [props.customClass] : []),
  ])

  const panelClass = computed(() => ['lh-drawer__panel', `lh-drawer__panel--${direction.value}`])

  /** 面板样式：主题变量 + sx 作用于面板，尺寸按方向落到 width / height（share 纯函数归一化） */
  const panelStyle = computed(() => ({
    ...componentStyle.value,
    ...getDrawerPanelStyle(direction.value, props.size),
  }))

  const hasHeader = computed(() => !!slots.header || !!props.title || props.showClose)
  const hasTitle = computed(() => !!slots.header || !!props.title)

  /** 无障碍属性包由 share 纯函数产出，按本仓约定逐键摊开绑定（MP 模板编译器不支持 v-bind 对象） */
  const drawerAria = computed(() =>
    getDrawerAria({ titleId: hasTitle.value ? titleId : undefined }),
  )
  const drawerRole = computed(() => String(drawerAria.value.role ?? 'dialog'))
  const ariaModal = computed(() => Boolean(drawerAria.value['aria-modal']))
  const ariaLabelledby = computed(() => {
    const value = drawerAria.value['aria-labelledby']
    return typeof value === 'string' ? value : undefined
  })

  /** 文案随语言切换重算（lhlocale.t 内部订阅版本号） */
  const closeLabel = computed(() => lhlocale.t('drawer.close', '关闭抽屉'))
  const defaultTitle = computed(() => lhlocale.t('drawer.title', '抽屉'))
  /** 有标题时由 aria-labelledby 关联，无标题时用语言包 drawer.title 作 aria-label 兜底 */
  const ariaLabel = computed(() => (hasTitle.value ? undefined : defaultTitle.value))

  let restoreOverflow: (() => void) | undefined

  function open() {
    if (visible.value) return
    clearEnterTimer()
    register()
    visible.value = true
    closing.value = false

    // 起始态先上屏（面板 translate 100% + 遮罩透明），隔帧切动画态驱动 CSS transition
    phase.value = 'enter-from'
    nextTick(() => {
      // 再等一帧确保「起始态」已提交渲染（MP 渲染同步性弱于 H5），与 adapter/popper 的两帧时序同理
      enterTimer = setTimeout(() => {
        enterTimer = undefined
        // 期间已转入离开流程（快速开关）则不再推进进入态
        if (phase.value !== 'enter-from') return
        phase.value = 'enter'
        enterTimer = setTimeout(() => {
          enterTimer = undefined
          if (phase.value === 'enter') phase.value = 'idle'
        }, TRANSITION_MS)
      }, 0)
    })

    // #ifdef H5
    if (props.lockScroll) {
      restoreOverflow = lockLhBodyScroll()
    }
    // #endif

    emit('update:modelValue', true)
    emit('open')
  }

  /**
   * 关闭抽屉。
   *
   * 【isTopmost 的适用范围】「只关栈顶」是遮罩点击 / Esc 的交互语义（防止越层关闭），
   * 外部 v-model 主动置 false 时不应被拦截——否则多弹层叠加时，非栈顶抽屉的
   * footer 关闭按钮会失效（visible 已改但被 isTopmost 吞掉，形成死锁）。
   */
  function close(options?: { interactive?: boolean }) {
    if (!visible.value || closing.value) return
    if (options?.interactive && !isTopmost()) return
    closing.value = true
    clearEnterTimer()

    // 离开态类名驱动面板滑出 + 遮罩淡出，动画结束后真正卸载
    // （MP 端 transitionend 不可靠，与 message / loading 一致用 setTimeout 对齐时长）
    phase.value = 'leave'
    closeTimer = setTimeout(() => {
      closeTimer = undefined
      visible.value = false
      closing.value = false
      phase.value = 'idle'
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
    // props 的字段名与 share 的 LhDrawerState 子集同名，结构化直传即可
    if (canDrawerClose(props, 'maskClick')) {
      close({ interactive: true })
    }
  }

  /**
   * Esc 关闭（仅 H5 有键盘语义）。
   * 函数体双端存在、MP 构建后为空函数——文档级监听与返回对象都引用它，
   * 函数声明不能被条件编译裁掉（否则 MP 端引用不到直接崩，照 dropdown 先例）。
   */
  function handleEsc(event: KeyboardEvent) {
    // #ifdef H5
    if (!visible.value || !isTopmost()) return
    if (isEscapeKey(event) && canDrawerClose(props, 'escape')) {
      close({ interactive: true })
    }
    // #endif
  }

  // #ifdef H5
  /**
   * Esc 走文档级监听（焦点不在抽屉内时抽屉自身收不到 keydown）；
   * 多弹层叠加时只有栈顶响应（与 Dialog / Tooltip / Dropdown 共用顺序栈）。
   */
  function onDocumentKeydown(event: KeyboardEvent) {
    handleEsc(event)
  }

  onMounted(() => {
    document.addEventListener('keydown', onDocumentKeydown)
  })
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
    // 初始 modelValue=true：watch 不会触发，补上弹层栈登记与 H5 滚动锁（对齐 plus 仓）
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
    clearEnterTimer()
    // 卸载时丢弃未完成的关闭定时器，避免向已卸载实例发事件
    if (closeTimer) {
      clearTimeout(closeTimer)
      closeTimer = undefined
    }
    unregister()
  })

  return {
    drawerId,
    titleId,
    visible,
    closing,
    direction,
    hasHeader,
    hasTitle,
    drawerClass,
    panelClass,
    panelStyle,
    drawerRole,
    ariaModal,
    ariaLabelledby,
    ariaLabel,
    closeLabel,
    open,
    close,
    handleMaskClick,
    handleEsc,
  }
}
