<template>
  <view
    :class="['lh-link', linkClass, customClass]"
    :style="sxStyle"
    role="link"
    :aria-disabled="ariaDisabled"
    :aria-current="ariaCurrent"
    @click="handleClick"
  >
    <slot name="prefix" />
    <view class="lh-link__text"><slot /></view>
    <slot name="suffix" />
  </view>
</template>

<script lang="ts" setup>
import { useLhLink } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhLinkProps } from './types'

defineOptions({
  name: 'LhLink',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhLinkProps>(), {
  href: undefined,
  target: undefined,
  type: undefined,
  underline: 'hover',
  disabled: false,
  current: undefined,
  customClass: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  /** 点击事件（H5 的 href 语义见 props 注释；MP 端导航由此事件交业务层） */
  click: [event: Event]
}>()

const { linkClass, sxStyle, ariaDisabled, ariaCurrent, handleClick } = useLhLink(
  props,
  emit as LhEmitFn<'click'>,
)
</script>

<style src="./style.css"></style>
