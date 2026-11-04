<template>
  <view
    class="lh-segmented"
    :class="[segmentedModifiers, customClass]"
    :style="sxStyle"
    role="radiogroup"
    :aria-disabled="rootAriaDisabled"
    @keydown="handleKeydown"
  >
    <view
      v-for="(option, index) in normalized"
      :key="String(option.value)"
      class="lh-segmented__option"
      :class="{
        'lh-segmented__option--checked': option.value === props.modelValue,
        'lh-segmented__option--disabled': itemDisabled[index],
      }"
      role="radio"
      :aria-checked="itemAriaList[index].checked"
      :aria-disabled="itemAriaList[index].disabled"
      :tabindex="tabStops[index]"
      @click="select(option)"
    >{{ option.label }}</view>
  </view>
</template>

<script lang="ts" setup>
import { useLhSegmented } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhSegmentedProps } from './types'

defineOptions({
  name: 'LhSegmented',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhSegmentedProps>(), {
  modelValue: undefined,
  disabled: false,
  block: false,
  customClass: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: LhSegmentedProps['modelValue']]
  change: [value: LhSegmentedProps['modelValue']]
}>()

const {
  normalized,
  segmentedModifiers,
  sxStyle,
  tabStops,
  rootAriaDisabled,
  itemAriaList,
  itemDisabled,
  select,
  onSegmentedKeydown,
} = useLhSegmented(props, emit as LhEmitFn<'update:modelValue' | 'change'>)

function handleKeydown(event: KeyboardEvent) {
  // 键盘方向键导航仅 H5：小程序无键盘事件，此处由条件编译守卫，MP 端不调用
  // #ifdef H5
  onSegmentedKeydown(event)
  // #endif
}
</script>

<style src="./style.css"></style>

<!-- view 无 :disabled 伪类（share 的 `&:disabled` 规则只匹配 button 元素），
     禁用项在两端都拿不到 share 的禁用外观，这里按同一令牌补一个类名兜底；
     不进 build-styles 产物，仅本组件内联生效（同 lh-spinner / lh-empty 先例）。 -->
<style>
.lh-segmented__option--disabled {
  color: var(--lh-disabled-text-color, #bfb8af);
}
</style>
