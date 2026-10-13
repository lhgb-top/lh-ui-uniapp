import { openLhMessage, closeLhMessage, closeAllLhMessages, setLhMessageConfig } from './store'
import type {
  LhMessageHandle,
  LhMessageOptions,
  LhMessageType,
  LhMessageConfig,
} from './types'

/**
 * 挂载点组件是否已放置（页面/根里放了一个 <lh-message />）
 *
 * 【R7 对策】小程序无法 JS 创建 DOM，消息必须由挂载点组件渲染。
 * 若使用方未放挂载点，调用看似成功但界面无任何反馈，是隐蔽 bug。
 * 因此开发期明确 console.error 告警，绝不静默降级（与 uview-plus 的关键差异）。
 */
let mounted = false

export function setLhMessageMounted(value: boolean) {
  mounted = value
}

function ensureMounted() {
  if (!mounted) {
    // 开发期告警（生产环境 console.error 通常被移除或无害）
    console.error(
      '[lh-ui] useLhMessage 调用时页面未放置 <lh-message /> 挂载点组件，消息不会显示。\n' +
        '请在页面或根组件中放置 <lh-message />，且在 onReady 之后调用（onLoad 阶段组件尚未挂载完毕）。',
    )
  }
}

function open(options: LhMessageOptions): LhMessageHandle {
  ensureMounted()
  const id = openLhMessage(options)
  return {
    close: () => closeLhMessage(id),
  }
}

/**
 * Message 命令式服务（API 与 plus 仓同构）
 *
 * 【时序约束】所有调用须在页面 onReady 之后（onLoad 阶段挂载点组件尚未创建完毕）。
 *
 * @example
 * const message = useLhMessage()
 * message.success('保存成功')
 */
export function useLhMessage() {
  return Object.assign(
    (options: LhMessageOptions | string) =>
      open(typeof options === 'string' ? { content: options } : options),
    {
      success: (content: string, options?: Partial<LhMessageOptions>) =>
        open({ ...options, content, type: 'success' as LhMessageType }),
      info: (content: string, options?: Partial<LhMessageOptions>) =>
        open({ ...options, content, type: 'info' as LhMessageType }),
      warning: (content: string, options?: Partial<LhMessageOptions>) =>
        open({ ...options, content, type: 'warning' as LhMessageType }),
      danger: (content: string, options?: Partial<LhMessageOptions>) =>
        open({ ...options, content, type: 'danger' as LhMessageType }),
      error: (content: string, options?: Partial<LhMessageOptions>) =>
        open({ ...options, content, type: 'error' as LhMessageType }),
      loading: (content: string, options?: Partial<LhMessageOptions>) =>
        open({ ...options, content, type: 'loading' as LhMessageType, duration: 0 }),
      close: (id: number) => closeLhMessage(id),
      closeAll: () => closeAllLhMessages(),
      config: (config: LhMessageConfig) => setLhMessageConfig(config),
    },
  )
}

export type LhMessage = ReturnType<typeof useLhMessage>
