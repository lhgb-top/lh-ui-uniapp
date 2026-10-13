<template>
  <lh-root-portal v-if="visible">
    <!-- 暗色遮罩（share 的 .lh-dialog__overlay 提供 fixed 全屏 + 背景色，层级比 wrapper 低一档） -->
    <view
      class="lh-dialog__overlay"
      :style="{ zIndex: String(zIndex - 1) }"
    />
    <!-- 定位容器（share 的 .lh-dialog__wrapper--top/center/bottom 提供 flex 对齐） -->
    <view
      class="lh-dialog__wrapper"
      :class="[`lh-dialog__wrapper--${props.position}`, dialogClass, customClass]"
      :style="dialogStyle"
      @click="handleMaskClick"
    >
      <view
        class="lh-dialog"
        :class="{
          'lh-dialog--bottom-safe': props.position === 'bottom',
          'lh-dialog--fullscreen': props.fullscreen,
        }"
        :style="dialogContentStyle"
        @click.stop
      >
        <view
          v-if="props.title || $slots.title"
          class="lh-dialog__header"
        >
          <slot name="title">
            <text class="lh-dialog__title">{{ props.title }}</text>
          </slot>
          <view
            v-if="$slots.headerRight"
            class="lh-dialog__header-right"
          >
            <slot name="headerRight" />
          </view>
        </view>

        <view class="lh-dialog__body">
          <slot />
        </view>

        <view
          v-if="$slots.footer"
          class="lh-dialog__footer"
        >
          <slot
            name="footer"
            :close="close"
          />
        </view>
      </view>
    </view>
  </lh-root-portal>
</template>

<script lang="ts" setup>
import { useLhDialog } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhDialogProps } from './types'

defineOptions({
  name: 'LhDialog',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhDialogProps>(), {
  modelValue: false,
  title: undefined,
  width: undefined,
  top: undefined,
  fullscreen: false,
  position: 'center',
  closeOnClickModal: true,
  closeOnPressEscape: true,
  lockScroll: true,
  customClass: undefined,
  zIndex: undefined,
  themeVars: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  open: []
  close: []
}>()

const {
  visible,
  zIndex,
  dialogClass,
  dialogStyle,
  dialogContentStyle,
  open,
  close,
  handleMaskClick,
  handleEsc,
} = useLhDialog(props, emit as LhEmitFn<'update:modelValue' | 'open' | 'close'>)

// Esc 关闭：仅 H5 端注册键盘监听（MP 端被条件编译整体剔除，无键盘事件语义）
// #ifdef H5
import { onMounted, onBeforeUnmount as onBeforeUnmountH5 } from 'vue'

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') handleEsc()
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})
onBeforeUnmountH5(() => {
  window.removeEventListener('keydown', onKeyDown)
})
// #endif

void open
</script>

<style src="./style.css"></style>

<!-- uni-app 独有适配样式：底部弹层全面屏安全区（share 无此端特化） -->
<style>
.lh-dialog--bottom-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
