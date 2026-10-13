<template>
  <button
    class="lh-button"
    :class="[buttonClass, customClass]"
    :style="buttonStyle"
    :disabled="props.disabled || props.loading"
    :hover-class="props.disabled || props.loading ? '' : 'lh-button--hover'"
    hover-stay-time="100"
    @click="handleClick"
  >
    <lh-icon
      v-if="props.loading"
      name="loading"
      class="lh-button__icon"
    />
    <lh-icon
      v-else-if="props.icon"
      :name="props.icon"
      class="lh-button__icon"
    />
    <text
      v-if="$slots.default"
      class="lh-button__text"
    >
      <slot />
    </text>
  </button>
</template>

<script lang="ts" setup>
import { useLhButton } from './logic'
import type { LhButtonProps } from './types'

defineOptions({
  name: 'LhButton',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhButtonProps>(), {
  type: 'default',
  size: undefined,
  loading: false,
  disabled: false,
  plain: false,
  block: false,
  round: false,
  circle: false,
  icon: undefined,
  customClass: undefined,
  themeVars: undefined,
  bgPattern: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  click: [e: Event]
}>()

const { buttonClass, buttonStyle, handleClick } = useLhButton(props, emit)
</script>

<style src="./style.css"></style>
