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
 * 【命令式服务】Message / Loading / Notification 在小程序端不是「随用随 mount」，
 * 需要在页面或根组件放置 <lh-message /> / <lh-loading /> / <lh-notification /> 挂载点组件
 * （easycom 可直接用标签）。
 */
import type { App, Component, Plugin } from 'vue'

// 全局令牌与图标字体：全量入口顺带引入，app.use 时即生效
import './theme/index.css'
import './icon/iconfont.css'

import LhConfigProvider from './components/lh-config-provider/lh-config-provider.vue'
import LhDescriptions from './components/lh-descriptions/lh-descriptions.vue'
import LhIcon from './components/lh-icon/lh-icon.vue'
import LhLayout from './components/lh-layout/lh-layout.vue'
import LhHeader from './components/lh-header/lh-header.vue'
import LhAside from './components/lh-aside/lh-aside.vue'
import LhMain from './components/lh-main/lh-main.vue'
import LhFooter from './components/lh-footer/lh-footer.vue'
import LhButton from './components/lh-button/lh-button.vue'
import LhTabPane from './components/lh-tab-pane/lh-tab-pane.vue'
import LhTabs from './components/lh-tabs/lh-tabs.vue'
import LhTag from './components/lh-tag/lh-tag.vue'
import LhInput from './components/lh-input/lh-input.vue'
import LhSwitch from './components/lh-switch/lh-switch.vue'
import LhInputNumber from './components/lh-input-number/lh-input-number.vue'
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
import LhNotification from './components/lh-notification/lh-notification.vue'
import LhSpace from './components/lh-space/lh-space.vue'
import LhDivider from './components/lh-divider/lh-divider.vue'
import LhBadge from './components/lh-badge/lh-badge.vue'
import LhBreadcrumb from './components/lh-breadcrumb/lh-breadcrumb.vue'
import LhBreadcrumbItem from './components/lh-breadcrumb-item/lh-breadcrumb-item.vue'
import LhSkeleton from './components/lh-skeleton/lh-skeleton.vue'
import LhSkeletonItem from './components/lh-skeleton-item/lh-skeleton-item.vue'
import LhAlert from './components/lh-alert/lh-alert.vue'
import LhAvatar from './components/lh-avatar/lh-avatar.vue'
import LhEmpty from './components/lh-empty/lh-empty.vue'
import LhCard from './components/lh-card/lh-card.vue'
import LhProgress from './components/lh-progress/lh-progress.vue'
import LhStatistic from './components/lh-statistic/lh-statistic.vue'
import LhSpinner from './components/lh-spinner/lh-spinner.vue'
import LhSegmented from './components/lh-segmented/lh-segmented.vue'
import LhRow from './components/lh-row/lh-row.vue'
import LhCol from './components/lh-col/lh-col.vue'
import LhCollapse from './components/lh-collapse/lh-collapse.vue'
import LhCollapseItem from './components/lh-collapse-item/lh-collapse-item.vue'
import LhTimeline from './components/lh-timeline/lh-timeline.vue'
import LhTimelineItem from './components/lh-timeline-item/lh-timeline-item.vue'
import LhSteps from './components/lh-steps/lh-steps.vue'
import LhStep from './components/lh-step/lh-step.vue'
import LhRate from './components/lh-rate/lh-rate.vue'
import LhPagination from './components/lh-pagination/lh-pagination.vue'
import LhImage from './components/lh-image/lh-image.vue'
import LhDropdown from './components/lh-dropdown/lh-dropdown.vue'
import LhDropdownItem from './components/lh-dropdown-item/lh-dropdown-item.vue'
import LhDrawer from './components/lh-drawer/lh-drawer.vue'
import LhPopover from './components/lh-popover/lh-popover.vue'
import LhPopconfirm from './components/lh-popconfirm/lh-popconfirm.vue'
import LhCalendar from './components/lh-calendar/lh-calendar.vue'
import LhMenu from './components/lh-menu/lh-menu.vue'
import LhMenuItem from './components/lh-menu-item/lh-menu-item.vue'
import LhSubMenu from './components/lh-sub-menu/lh-sub-menu.vue'
import LhMenuItemGroup from './components/lh-menu-item-group/lh-menu-item-group.vue'
import LhCascader from './components/lh-cascader/lh-cascader.vue'
import LhTimePicker from './components/lh-time-picker/lh-time-picker.vue'
import LhSlider from './components/lh-slider/lh-slider.vue'
import LhDatePicker from './components/lh-date-picker/lh-date-picker.vue'
import LhTree from './components/lh-tree/lh-tree.vue'
import LhTreeSelect from './components/lh-tree-select/lh-tree-select.vue'
import LhTransfer from './components/lh-transfer/lh-transfer.vue'
import LhUpload from './components/lh-upload/lh-upload.vue'
// root-portal 是弹层基建组件，不进注册表（easycom 直接用标签）
import LhRootPortal from './components/lh-root-portal/lh-root-portal.vue'

import { lhlocale, zhCN, enUS } from './adapter/locale'
import { useLhMessage } from './message'
import { useLhLoading } from './loading'
import { useLhNotification } from './notification'
import { useLhZIndex, useLhOverlayStack, useLhComponentTheme, useLhComponent } from './composables'

import type {
  LhConfigProviderProps,
  LhConfigContext,
} from './config-provider/types'
import type { LhDescriptionsProps, LhDescriptionsItem } from './components/lh-descriptions/types'
import type { LhIconProps, LhIconSize } from './components/lh-icon/types'
import type {
  LhLayoutProps,
  LhLayoutHeaderProps,
  LhLayoutAsideProps,
  LhLayoutMainProps,
  LhLayoutFooterProps,
  LhLayoutSectionProps,
  LhLayoutContext,
} from './components/lh-layout/types'
import type { LhButtonProps, LhButtonType, LhButtonSize } from './components/lh-button/types'
import type {
  LhTabsProps,
  LhTabPaneProps,
  LhTabsContext,
} from './components/lh-tabs/types'
import type { LhTagProps, LhTagSize } from './components/lh-tag/types'
import type {
  LhInputProps,
  LhInputType,
  LhInputSize,
  LhInputStateType,
} from './components/lh-input/types'
import type { LhSwitchProps, LhSwitchSize } from './components/lh-switch/types'
import type { LhInputNumberProps, LhInputNumberSize } from './components/lh-input-number/types'
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
  LhBreadcrumbProps,
  LhBreadcrumbItemProps,
  LhBreadcrumbContext,
} from './components/lh-breadcrumb/types'
import type {
  LhSkeletonProps,
  LhSkeletonItemProps,
  LhSkeletonVariant,
} from './components/lh-skeleton/types'
import type { LhAlertProps, LhAlertType } from './components/lh-alert/types'
import type { LhAvatarProps, LhAvatarSize, LhAvatarShape, LhAvatarFit } from './components/lh-avatar/types'
import type { LhEmptyProps } from './components/lh-empty/types'
import type { LhCardProps, LhCardShadow } from './components/lh-card/types'
import type {
  LhProgressProps,
  LhProgressType,
  LhProgressStatus,
} from './components/lh-progress/types'
import type { LhStatisticProps } from './components/lh-statistic/types'
import type { LhSpinnerProps } from './components/lh-spinner/types'
// 尺寸类型真源在 share core（组件 types 同名透传再导出）
import type { LhSpinnerSize } from '@lh-ui/share/core/spinner'
import type {
  LhSegmentedProps,
  LhSegmentedInput,
  LhSegmentedValue,
} from './components/lh-segmented/types'
import type { LhRowProps, LhRowJustify, LhRowAlign } from './components/lh-row/types'
import type { LhColProps } from './components/lh-col/types'
import type {
  LhCollapseProps,
  LhCollapseItemProps,
  LhCollapseContext,
} from './components/lh-collapse/types'
import type {
  LhTimelineProps,
  LhTimelineItemProps,
  LhTimelineContext,
} from './components/lh-timeline/types'
import type { LhTimelineMode, LhTimelineType } from '@lh-ui/share/core/timeline'
import type { LhStepsProps, LhStepProps, LhStepsContext } from './components/lh-steps/types'
import type { LhRateProps } from './components/lh-rate/types'
import type { LhPaginationProps } from './components/lh-pagination/types'
import type { LhImageProps } from './components/lh-image/types'
import type {
  LhDropdownProps,
  LhDropdownContext,
  LhDropdownItemRecord,
  LhDropdownTrigger,
  LhDropdownPlacement,
} from './components/lh-dropdown/types'
import type { LhDropdownItemProps } from './components/lh-dropdown-item/types'
import type { LhDrawerProps, LhDrawerDirection } from './components/lh-drawer/types'
import type {
  LhPopoverProps,
  LhPopoverPlacement,
  LhPopoverTrigger,
} from './components/lh-popover/types'
import type {
  LhPopconfirmProps,
  LhPopconfirmPlacement,
  LhPopconfirmTrigger,
  LhPopconfirmType,
} from './components/lh-popconfirm/types'
import type {
  LhCalendarProps,
  LhCalendarMode,
  LhCalendarValue,
  LhCalendarRange,
  LhCalendarSelection,
} from './components/lh-calendar/types'
import type {
  LhMenuProps,
  LhMenuItemProps,
  LhSubMenuProps,
  LhMenuItemGroupProps,
  LhMenuMode,
} from './components/lh-menu/types'
import type {
  LhCascaderProps,
  LhCascaderSize,
  LhCascaderNode,
  LhCascaderItemConfig,
} from './components/lh-cascader/types'
import type { LhTimePickerProps, LhTimePickerSize } from './components/lh-time-picker/types'
import type { LhSliderProps, LhSliderSize } from './components/lh-slider/types'
import type {
  LhDatePickerProps,
  LhDatePickerSize,
  LhDatePickerMode,
} from './components/lh-date-picker/types'
import type { LhTreeProps } from './components/lh-tree/types'
import type { LhTreeSelectProps } from './components/lh-tree-select/types'
import type { LhTreeNode, LhTreeCheckState, LhFlatTreeNode } from '@lh-ui/share/core/tree'
import type { LhTransferProps } from './components/lh-transfer/types'
import type { LhTransferItem, LhTransferSide } from '@lh-ui/share/core/transfer'
import type { LhUploadProps } from './components/lh-upload/types'
import type {
  LhUniFile,
  LhUniUploadRequest,
  LhUploadResult,
  LhUploadConfig,
} from './adapter/upload'
// 尺寸类型真源在 share core（与 LhIconName 同样的直接引入方式）
import type { LhColSize, LhBreakpointSizes } from '@lh-ui/share/core/grid'
import type { LhMessageConfig, LhMessageOptions, LhMessageHandle, LhMessageType } from './message/types'
import type { LhLoadingOptions, LhLoadingHandle } from './loading/types'
import type {
  LhNotificationConfig,
  LhNotificationOptions,
  LhNotificationHandle,
  LhNotificationPosition,
  LhNotificationType,
} from './notification/types'
import type { LhLocaleType, LhLocaleMessages, LhLocalePath, LhTranslate } from './adapter/locale'
import type { LhIconName } from '@lh-ui/share/core/icon'
// 裁切模式类型真源在 share core（与 LhIconName 同样的直接引入方式）
import type { LhImageFit } from '@lh-ui/share/core/image'

/**
 * 组件注册表（registry 测试反向扫描 components/lh-* 断言此清单；新增组件必须登记）
 *
 * root-portal 是弹层基建、message/loading/notification 是挂载点组件，均不在此列：
 * 它们由使用方按需放标签，不需要 app.use 注册。
 */
export const lhComponents: (Component & { name?: string })[] = [
  LhConfigProvider,
  LhDescriptions,
  LhIcon,
  LhLayout,
  LhHeader,
  LhAside,
  LhMain,
  LhFooter,
  LhButton,
  LhTabPane,
  LhTabs,
  LhTag,
  LhInput,
  LhSwitch,
  LhInputNumber,
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
  LhBreadcrumb,
  LhBreadcrumbItem,
  LhSkeleton,
  LhSkeletonItem,
  LhAlert,
  LhAvatar,
  LhEmpty,
  LhCard,
  LhProgress,
  LhStatistic,
  LhSpinner,
  LhSegmented,
  LhRow,
  LhCol,
  LhCollapse,
  LhCollapseItem,
  LhTimeline,
  LhTimelineItem,
  LhSteps,
  LhStep,
  LhRate,
  LhPagination,
  LhImage,
  LhDropdown,
  LhDropdownItem,
  LhDrawer,
  LhPopover,
  LhPopconfirm,
  LhCalendar,
  LhMenu,
  LhMenuItem,
  LhSubMenu,
  LhMenuItemGroup,
  LhCascader,
  LhTimePicker,
  LhSlider,
  LhDatePicker,
  LhTree,
  LhTreeSelect,
  LhTransfer,
  LhUpload,
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
  app.component(LhNotification.name ?? 'LhNotification', LhNotification)
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
  LhDescriptions,
  LhIcon,
  LhLayout,
  LhHeader,
  LhAside,
  LhMain,
  LhFooter,
  LhButton,
  LhTabPane,
  LhTabs,
  LhTag,
  LhInput,
  LhSwitch,
  LhInputNumber,
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
  LhBreadcrumb,
  LhBreadcrumbItem,
  LhSkeleton,
  LhSkeletonItem,
  LhAlert,
  LhAvatar,
  LhEmpty,
  LhCard,
  LhProgress,
  LhStatistic,
  LhSpinner,
  LhSegmented,
  LhRow,
  LhCol,
  LhCollapse,
  LhCollapseItem,
  LhTimeline,
  LhTimelineItem,
  LhSteps,
  LhStep,
  LhRate,
  LhPagination,
  LhImage,
  LhDropdown,
  LhDropdownItem,
  LhDrawer,
  LhPopover,
  LhPopconfirm,
  LhCalendar,
  LhMenu,
  LhMenuItem,
  LhSubMenu,
  LhMenuItemGroup,
  LhCascader,
  LhTimePicker,
  LhSlider,
  LhDatePicker,
  LhTree,
  LhTreeSelect,
  LhTransfer,
  LhUpload,
  // 挂载点组件（命令式服务依赖）
  LhMessage,
  LhLoading,
  LhNotification,
  // 弹层基建
  LhRootPortal,
  // Locale
  lhlocale,
  zhCN,
  enUS,
  // 命令式服务
  useLhMessage,
  useLhLoading,
  useLhNotification,
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
  // Descriptions
  LhDescriptionsProps,
  LhDescriptionsItem,
  // Icon
  LhIconProps,
  LhIconSize,
  LhIconName,
  // Layout
  LhLayoutProps,
  LhLayoutHeaderProps,
  LhLayoutAsideProps,
  LhLayoutMainProps,
  LhLayoutFooterProps,
  LhLayoutSectionProps,
  LhLayoutContext,
  // Button
  LhButtonProps,
  LhButtonType,
  LhButtonSize,
  // Tabs
  LhTabsProps,
  LhTabPaneProps,
  LhTabsContext,
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
  // InputNumber
  LhInputNumberProps,
  LhInputNumberSize,
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
  // Breadcrumb
  LhBreadcrumbProps,
  LhBreadcrumbItemProps,
  LhBreadcrumbContext,
  // Skeleton
  LhSkeletonProps,
  LhSkeletonItemProps,
  LhSkeletonVariant,
  // Alert
  LhAlertProps,
  LhAlertType,
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
  // Statistic
  LhStatisticProps,
  // Spinner
  LhSpinnerProps,
  LhSpinnerSize,
  // Segmented
  LhSegmentedProps,
  LhSegmentedInput,
  LhSegmentedValue,
  // Grid
  LhRowProps,
  LhRowJustify,
  LhRowAlign,
  LhColProps,
  LhColSize,
  LhBreakpointSizes,
  // Collapse
  LhCollapseProps,
  LhCollapseItemProps,
  LhCollapseContext,
  // Timeline
  LhTimelineProps,
  LhTimelineItemProps,
  LhTimelineContext,
  LhTimelineMode,
  LhTimelineType,
  // Steps
  LhStepsProps,
  LhStepProps,
  LhStepsContext,
  // Rate
  LhRateProps,
  // Pagination
  LhPaginationProps,
  // Image
  LhImageProps,
  LhImageFit,
  // Dropdown
  LhDropdownProps,
  LhDropdownItemProps,
  LhDropdownContext,
  LhDropdownItemRecord,
  LhDropdownTrigger,
  LhDropdownPlacement,
  // Drawer
  LhDrawerProps,
  LhDrawerDirection,
  // Popover
  LhPopoverProps,
  LhPopoverPlacement,
  LhPopoverTrigger,
  // Popconfirm
  LhPopconfirmProps,
  LhPopconfirmPlacement,
  LhPopconfirmTrigger,
  LhPopconfirmType,
  // Calendar
  LhCalendarProps,
  LhCalendarMode,
  LhCalendarValue,
  LhCalendarRange,
  LhCalendarSelection,
  // Menu
  LhMenuProps,
  LhMenuItemProps,
  LhSubMenuProps,
  LhMenuItemGroupProps,
  LhMenuMode,
  // Cascader
  LhCascaderProps,
  LhCascaderSize,
  LhCascaderNode,
  LhCascaderItemConfig,
  // TimePicker
  LhTimePickerProps,
  LhTimePickerSize,
  // Slider
  LhSliderProps,
  LhSliderSize,
  // DatePicker
  LhDatePickerProps,
  LhDatePickerSize,
  LhDatePickerMode,
  // Tree
  LhTreeProps,
  LhTreeNode,
  LhTreeCheckState,
  LhFlatTreeNode,
  // TreeSelect
  LhTreeSelectProps,
  // Transfer
  LhTransferProps,
  LhTransferItem,
  LhTransferSide,
  // Upload
  LhUploadProps,
  LhUniFile,
  LhUniUploadRequest,
  LhUploadResult,
  LhUploadConfig,
  // Message / Loading / Notification
  LhMessageConfig,
  LhMessageOptions,
  LhMessageHandle,
  LhMessageType,
  LhLoadingOptions,
  LhLoadingHandle,
  LhNotificationConfig,
  LhNotificationOptions,
  LhNotificationHandle,
  LhNotificationPosition,
  LhNotificationType,
  // Locale
  LhLocaleType,
  LhLocaleMessages,
  LhLocalePath,
  LhTranslate,
}
