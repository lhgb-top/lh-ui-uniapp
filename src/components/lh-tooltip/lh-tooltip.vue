<template>
  <view
    :id="triggerId"
    class="lh-tooltip__trigger"
    :class="customClass"
    :style="tooltipStyle"
    @click="toggle"
    @touchstart="onTouchStart"
    @mouseenter="onTriggerMouseenter"
    @mouseleave="onTriggerMouseleave"
  >
    <!-- #ifdef H5 -->
    <slot
      :show="show"
      :hide="hide"
    />
    <!-- #endif -->
    <!-- #ifndef H5 -->
    <slot />
    <!-- #endif -->

    <lh-root-portal v-if="visible">
      <view
        :id="popperId"
        class="lh-tooltip__popper"
        :class="tooltipClass"
        :style="popperStyle"
        @click.stop
      >
        <text class="lh-tooltip__content">{{ props.content }}</text>
      </view>
      <view
        class="lh-tooltip__mask"
        @click.stop="hide"
      />
    </lh-root-portal>
  </view>
</template>

<script lang="ts" setup>
import { useLhTooltip } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhTooltipProps } from './types'

defineOptions({
  name: 'LhTooltip',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhTooltipProps>(), {
  content: '',
  placement: 'top',
  trigger: 'click',
  showDelay: undefined,
  hideDelay: undefined,
  maxWidth: undefined,
  disabled: false,
  customClass: undefined,
  themeVars: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  'visible-change': [visible: boolean]
}>()

const { visible, tooltipClass, tooltipStyle, popperStyle, triggerId, popperId, show, hide, toggle, onTriggerMouseenter, onTriggerMouseleave } = useLhTooltip(
  props,
  emit as LhEmitFn<'visible-change'>,
)

// MP 端无 hover 语义，touchstart 即展示（与 click 互补，覆盖长按场景）；
// 守卫逻辑与 onTriggerMouseenter 同款，直接复用
const onTouchStart = onTriggerMouseenter
</script>

<style src="./style.css"></style>

<!-- uni-app 独有适配样式：share 无对应产物（plus 用 hover 触发 + body 级事件，
     MP 用页内遮罩 + lh-root-portal 承载） -->
<style>
.lh-tooltip__trigger {
  /* 收缩到内容宽度：view 默认 block 会撑满整行，useLhPopper 以本元素为触发器度量，
     撑满时弹层会相对整行居中而非相对按钮，视觉上浮到按钮斜上方 */
  display: inline-block;
}

.lh-tooltip__popper {
  pointer-events: auto;
}

.lh-tooltip__mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  background-color: transparent;
  z-index: -1;
}
</style>
