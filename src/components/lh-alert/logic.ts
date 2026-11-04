import { computed, ref, useSlots } from 'vue'
import { getAlertClassNames, getAlertIconName, getAlertRole } from '@lh-ui/share/core/alert'
import { sxToStyle } from '@lh-ui/share/core/shared'
import { lhlocale } from '@/adapter/locale'
import type { LhEmitFn } from '@/types/emit'
import type { LhAlertResolvedProps } from './types'

/**
 * Alert 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】关闭行为与 plus 一致（内部 visible 控制 + emit close），
 * 无进出动画需求（plus 侧也只是 v-if 摘节点）；语言包 alert.close 九语言齐备，
 * 关闭按钮无障碍名称按响应式版本号取值，切语言自动更新。
 */
export function useLhAlert(props: LhAlertResolvedProps, emit: LhEmitFn<'close'>) {
  const slots = useSlots()

  const visible = ref(true)

  const hasTitle = computed(() => !!props.title || !!slots.title)

  /** 修饰类挂在根元素上，lh-alert 本身已在模板写死，这里滤掉避免重复 */
  const alertClass = computed(() =>
    getAlertClassNames({
      type: props.type,
      closable: props.closable,
      showIcon: props.showIcon,
      plain: props.plain,
      withTitle: hasTitle.value,
    }).filter((name) => name !== 'lh-alert'),
  )

  // warning/danger 立即播报（role=alert），info/success 温和播报（role=status）
  const alertRole = computed(() => getAlertRole(props.type))

  const iconName = computed(() => getAlertIconName(props.type))

  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  // 关闭按钮无障碍名称：closeLabel 优先，未传取语言包 alert.close
  // （computed 里 void version.value 建立依赖，setLocale 后自动重算）
  const closeAriaLabel = computed(() => {
    void lhlocale.version.value
    return props.closeLabel || lhlocale.t('alert.close', '关闭警告')
  })

  function handleClose() {
    visible.value = false
    emit('close')
  }

  return {
    visible,
    hasTitle,
    alertClass,
    alertRole,
    iconName,
    sxStyle,
    closeAriaLabel,
    handleClose,
  }
}
