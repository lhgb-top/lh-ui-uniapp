<template>
  <!-- 只读分支：纯星级文本展示（role=img，屏读走 aria-label） -->
  <view
    v-if="props.readonly"
    class="lh-rate"
    :class="[rateModifiers, customClass]"
    :style="sxStyle"
    role="img"
    :aria-label="ariaText"
  >
    <text
      v-for="i in props.max"
      :key="i"
      class="lh-rate__star lh-rate__star--static"
      :class="`lh-rate__star--${fills[i - 1]}`"
      aria-hidden="true"
    >{{ props.character ?? '★' }}</text>
    <text v-if="props.showScore" class="lh-rate__score">{{ scoreText }}</text>
  </view>

  <!-- 交互分支：星星是 view + role=radio（MP 的 button 无法 reset 默认样式），
       禁用由点击守卫 + --disabled 修饰类表达，键盘步进仅 H5 触发 -->
  <view
    v-else
    class="lh-rate"
    :class="[rateModifiers, customClass]"
    :style="sxStyle"
    role="radiogroup"
    :aria-label="ariaText"
    :aria-disabled="props.disabled ? 'true' : undefined"
    @keydown="onKeydown"
  >
    <view
      v-for="i in props.max"
      :key="i"
      class="lh-rate__star"
      :class="`lh-rate__star--${fills[i - 1]}`"
      role="radio"
      :aria-checked="ariaCheckedList[i - 1]"
      :aria-label="starAriaList[i - 1]"
      :tabindex="tabStops[i - 1]"
      @click="select(i, $event)"
    >{{ props.character ?? '★' }}</view>
    <text v-if="props.showScore" class="lh-rate__score">{{ scoreText }}</text>
  </view>
</template>

<script lang="ts" setup>
import { useLhRate } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhRateProps } from './types'

defineOptions({
  name: 'LhRate',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhRateProps>(), {
  modelValue: 0,
  max: 5,
  allowHalf: false,
  readonly: false,
  disabled: false,
  character: undefined,
  showScore: false,
  scoreTemplate: undefined,
  customClass: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [value: number]
}>()

const {
  ariaText,
  starAriaList,
  scoreText,
  fills,
  rateModifiers,
  sxStyle,
  tabStops,
  ariaCheckedList,
  select,
  onKeydown,
} = useLhRate(props, emit as LhEmitFn<'update:modelValue' | 'change'>)
</script>

<style src="./style.css"></style>
