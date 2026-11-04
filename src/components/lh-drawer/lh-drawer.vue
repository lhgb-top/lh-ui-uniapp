<template>
  <lh-root-portal v-if="visible">
    <!--
      根节点即 share 的 .lh-drawer（fixed 全屏）：遮罩与面板都在其内，层级靠 DOM 顺序；
      过渡态类挂根节点（share 的 lh-drawer-fade-* 过渡类选择器以根节点为目标，
      面板位移在其后代上），进出动画由 logic 手工复刻 Vue Transition 类名时序
    -->
    <view
      :id="drawerId"
      :class="drawerClass"
      :role="drawerRole"
      :aria-modal="ariaModal"
      :aria-labelledby="ariaLabelledby"
      :aria-label="ariaLabel"
    >
      <!-- 装饰性遮罩：点击按 maskClosable 语义关闭 -->
      <view
        class="lh-drawer__mask"
        aria-hidden="true"
        @click="handleMaskClick"
      />
      <view
        class="lh-drawer__panel"
        :class="panelClass"
        :style="panelStyle"
      >
        <view
          v-if="hasHeader"
          class="lh-drawer__header"
        >
          <view
            :id="titleId"
            class="lh-drawer__title"
          >
            <slot name="header">{{ props.title }}</slot>
          </view>
          <!-- MP 的 button 无法 reset 默认样式，关闭按钮用 view + role 表达（照 lh-alert 先例） -->
          <view
            v-if="props.showClose"
            class="lh-drawer__close"
            role="button"
            :aria-label="closeLabel"
            @click="close()"
          >
            <lh-icon name="close" />
          </view>
        </view>

        <view class="lh-drawer__body">
          <slot />
        </view>

        <view
          v-if="$slots.footer"
          class="lh-drawer__footer"
        >
          <slot name="footer" />
        </view>
      </view>
    </view>
  </lh-root-portal>
</template>

<script lang="ts" setup>
import { useLhDrawer } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhDrawerProps } from './types'

defineOptions({
  name: 'LhDrawer',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhDrawerProps>(), {
  modelValue: false,
  title: undefined,
  direction: 'right',
  size: '30%',
  maskClosable: true,
  showClose: true,
  lockScroll: true,
  closeOnEsc: true,
  customClass: undefined,
  themeVars: undefined,
  bgPattern: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  open: []
  close: []
}>()

const {
  drawerId,
  titleId,
  visible,
  hasHeader,
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
} = useLhDrawer(props, emit as LhEmitFn<'update:modelValue' | 'open' | 'close'>)

defineExpose({
  /** 是否处于显示中（含关闭动画期间） */
  isVisible: visible,
  open,
  close,
})
</script>

<style src="./style.css"></style>

<!--
  uni-app 独有适配样式：
  1) lh-root-portal 容器是 pointer-events:none，抽屉根节点需恢复 auto 承接遮罩点击
     （照 lh-select / lh-dropdown 先例，share 无此端特化）
  2) 底部抽屉全面屏安全区（照 lh-dialog--bottom-safe 先例）
-->
<style>
.lh-drawer {
  pointer-events: auto;
}

.lh-drawer__panel--bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
