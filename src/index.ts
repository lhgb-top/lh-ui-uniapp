/**
 * @lh-ui/uniapp 全量入口
 *
 * 【easycom 优先】uni-app 工程里推荐在 pages.json 配置 easycom 自动引入组件，
 * 此时不需要本入口；本入口服务「不使用 easycom、想 app.use 全量注册」的场景。
 *
 * 1. 全量引入
 * ```ts
 * import { createSSRApp } from 'vue'
 * import lhUiUniapp from '@lh-ui/uniapp'
 * import '@lh-ui/uniapp/src/theme/index.css'
 * import '@lh-ui/uniapp/src/icon/iconfont.css'
 *
 * export function createApp() {
 *   const app = createSSRApp(App)
 *   app.use(lhUiUniapp)
 *   return { app }
 * }
 * ```
 *
 * 2. 按需引入
 * ```ts
 * import { LhButton } from '@lh-ui/uniapp'
 * app.component('LhButton', LhButton)
 * ```
 *
 * 【样式】组件样式已内联到各 SFC（<style src="./style.css">），引入组件即引入样式；
 * 但全局令牌（src/theme/index.css）与图标字体（src/icon/iconfont.css）需使用者自行引入一次。
 *
 * 【命令式服务】Message / Loading 在小程序端不是「随用随 mount」，
 * 需要在页面或根组件放置 <lh-message /> / <lh-loading /> 挂载点组件（easycom 可直接用标签）。
 */
import type { App, Component, Plugin } from 'vue'

// 全局令牌与图标字体：全量入口顺带引入，app.use 时即生效
import './theme/index.css'
import './icon/iconfont.css'

import LhConfigProvider from './components/lh-config-provider/lh-config-provider.vue'
import LhIcon from './components/lh-icon/lh-icon.vue'
import LhButton from './components/lh-button/lh-button.vue'
import LhTag from './components/lh-tag/lh-tag.vue'
import LhInput from './components/lh-input/lh-input.vue'
import LhSwitch from './components/lh-switch/lh-switch.vue'
import LhCheckbox from './components/lh-checkbox/lh-checkbox.vue'
import LhCheckboxGroup from './components/lh-checkbox-group/lh-checkbox-group.vue'
import LhRadio from './components/lh-radio/lh-radio.vue'
import LhRadioGroup from './components/lh-radio-group/lh-radio-group.vue'
import LhForm from './components/lh-form/lh-form.vue'
import LhFormItem from './components/lh-form-item/lh-form-item.vue'
import LhSelect from './components/lh-select/lh-select.vue'
import LhTooltip from './components/lh-tooltip/lh-tooltip.vue'
import LhDialog from './components/lh-dialog/lh-dialog.vue'
import LhMessage from './components/lh-message/lh-message.vue'
import LhLoading from './components/lh-loading/lh-loading.vue'
import LhSpace from './components/lh-space/lh-space.vue'
import LhDivider from './components/lh-divider/lh-divider.vue'
import LhBadge from './components/lh-badge/lh-badge.vue'
import LhSkeleton from './components/lh-skeleton/lh-skeleton.vue'
import LhSkeletonItem from './components/lh-skeleton-item/lh-skeleton-item.vue'
import LhAvatar from './components/lh-avatar/lh-avatar.vue'
import LhEmpty from './components/lh-empty/lh-empty.vue'
import LhCard from './components/lh-card/lh-card.vue'
import LhProgress from './components/lh-progress/lh-progress.vue'
// root-portal 是弹层基建组件，不进注册表（easycom 直接用标签）
import LhRootPortal from './components/lh-root-portal/lh-root-portal.vue'

import { lhlocale, zhCN, enUS } from './adapter/locale'
import { useLhMessage } from './message'
import { useLhLoading } from './loading'
import { useLhZIndex, useLhOverlayStack, useLhComponentTheme, useLhComponent } from './composables'

import type {
  LhConfigProviderProps,
  LhConfigContext,
} from './config-provider/types'
import type { LhIconProps, LhIconSize } from './components/lh-icon/types'
import type { LhButtonProps, LhButtonType, LhButtonSize } from './components/lh-button/types'
import type { LhTagProps, LhTagSize } from './components/lh-tag/types'
import type {
  LhInputProps,
  LhInputType,
  LhInputSize,
  LhInputStateType,
} from './components/lh-input/types'
import type { LhSwitchProps, LhSwitchSize } from './components/lh-switch/types'
import type {
  LhCheckboxProps,
  LhCheckboxGroupProps,
  LhCheckboxSize,
} from './components/lh-checkbox/types'
import type {
  LhRadioProps,
  LhRadioGroupProps,
  LhRadioSize,
} from './components/lh-radio/types'
import type {
  LhFormProps,
  LhFormItemProps,
  LhFormLabelPosition,
  LhFormRule,
} from './components/lh-form/types'
import type { LhSelectOption, LhSelectProps, LhSelectSize } from './components/lh-select/types'
import type { LhTooltipProps } from './components/lh-tooltip/types'
import type { LhDialogProps } from './components/lh-dialog/types'
import type { LhSpaceProps } from './components/lh-space/types'
import type { LhDividerProps } from './components/lh-divider/types'
import type { LhBadgeProps, LhBadgeType, LhBadgeSize } from './components/lh-badge/types'
import type {
  LhSkeletonProps,
  LhSkeletonItemProps,
  LhSkeletonVariant,
} from './components/lh-skeleton/types'
import type { LhAvatarProps, LhAvatarSize, LhAvatarShape, LhAvatarFit } from './components/lh-avatar/types'
import type { LhEmptyProps } from './components/lh-empty/types'
import type { LhCardProps, LhCardShadow } from './components/lh-card/types'
import type {
  LhProgressProps,
  LhProgressType,
  LhProgressStatus,
} from './components/lh-progress/types'
import type { LhMessageConfig, LhMessageOptions, LhMessageHandle, LhMessageType } from './message/types'
import type { LhLoadingOptions, LhLoadingHandle } from './loading/types'
import type { LhLocaleType, LhLocaleMessages, LhLocalePath, LhTranslate } from './adapter/locale'
import type { LhIconName } from '@lh-ui/share/core/icon'

/**
 * 组件注册表（registry 测试反向扫描 components/lh-* 断言此清单；新增组件必须登记）
 *
 * root-portal 是弹层基建、message/loading 是挂载点组件，均不在此列：
 * 它们由使用方按需放标签，不需要 app.use 注册。
 */
export const lhComponents: (Component & { name?: string })[] = [
  LhConfigProvider,
  LhIcon,
  LhButton,
  LhTag,
  LhInput,
  LhSwitch,
  LhCheckbox,
  LhCheckboxGroup,
  LhRadio,
  LhRadioGroup,
  LhForm,
  LhFormItem,
  LhSelect,
  LhTooltip,
  LhDialog,
  LhSpace,
  LhDivider,
  LhBadge,
  LhSkeleton,
  LhSkeletonItem,
  LhAvatar,
  LhEmpty,
  LhCard,
  LhProgress,
]

/**
 * 全量安装所有组件
 */
function install(app: App): void {
  lhComponents.forEach((component) => {
    if (component.name) {
      app.component(component.name, component)
    }
  })
  // 挂载点组件也一并注册，方便不使用 easycom 的工程直接写标签
  app.component(LhMessage.name ?? 'LhMessage', LhMessage)
  app.component(LhLoading.name ?? 'LhLoading', LhLoading)
  app.component(LhRootPortal.name ?? 'LhRootPortal', LhRootPortal)
}

/**
 * @lh-ui/uniapp 组件库
 */
const lhUiUniapp: Plugin & { version: string } = {
  install,
  version: '0.1.0',
}

export default lhUiUniapp

// 组件命名导出（支持按需引入）
export {
  LhConfigProvider,
  LhIcon,
  LhButton,
  LhTag,
  LhInput,
  LhSwitch,
  LhCheckbox,
  LhCheckboxGroup,
  LhRadio,
  LhRadioGroup,
  LhForm,
  LhFormItem,
  LhSelect,
  LhTooltip,
  LhDialog,
  LhSpace,
  LhDivider,
  LhBadge,
  LhSkeleton,
  LhSkeletonItem,
  LhAvatar,
  LhEmpty,
  LhCard,
  LhProgress,
  // 挂载点组件（命令式服务依赖）
  LhMessage,
  LhLoading,
  // 弹层基建
  LhRootPortal,
  // Locale
  lhlocale,
  zhCN,
  enUS,
  // 命令式服务
  useLhMessage,
  useLhLoading,
  // Composables
  useLhZIndex,
  useLhOverlayStack,
  useLhComponentTheme,
  useLhComponent,
}

// 类型导出
export type {
  // ConfigProvider
  LhConfigProviderProps,
  LhConfigContext,
  // Icon
  LhIconProps,
  LhIconSize,
  LhIconName,
  // Button
  LhButtonProps,
  LhButtonType,
  LhButtonSize,
  // Tag
  LhTagProps,
  LhTagSize,
  // Input
  LhInputProps,
  LhInputType,
  LhInputSize,
  LhInputStateType,
  // Switch
  LhSwitchProps,
  LhSwitchSize,
  // Checkbox
  LhCheckboxProps,
  LhCheckboxGroupProps,
  LhCheckboxSize,
  // Radio
  LhRadioProps,
  LhRadioGroupProps,
  LhRadioSize,
  // Form
  LhFormProps,
  LhFormItemProps,
  LhFormLabelPosition,
  LhFormRule,
  // Select
  LhSelectOption,
  LhSelectProps,
  LhSelectSize,
  // Tooltip
  LhTooltipProps,
  // Dialog
  LhDialogProps,
  // Space
  LhSpaceProps,
  // Divider
  LhDividerProps,
  // Badge
  LhBadgeProps,
  LhBadgeType,
  LhBadgeSize,
  // Skeleton
  LhSkeletonProps,
  LhSkeletonItemProps,
  LhSkeletonVariant,
  // Avatar
  LhAvatarProps,
  LhAvatarSize,
  LhAvatarShape,
  LhAvatarFit,
  // Empty
  LhEmptyProps,
  // Card
  LhCardProps,
  LhCardShadow,
  // Progress
  LhProgressProps,
  LhProgressType,
  LhProgressStatus,
  // Message / Loading
  LhMessageConfig,
  LhMessageOptions,
  LhMessageHandle,
  LhMessageType,
  LhLoadingOptions,
  LhLoadingHandle,
  // Locale
  LhLocaleType,
  LhLocaleMessages,
  LhLocalePath,
  LhTranslate,
}
