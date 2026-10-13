<template>
  <view
    class="lh-divider"
    :class="[dividerClass, customClass]"
    :style="dividerStyle"
    :role="role"
    :aria-orientation="ariaOrientation"
  >
    <text
      v-if="hasContent"
      class="lh-divider__label"
    >
      <slot />
    </text>
  </view>
</template>

<script lang="ts" setup>
import { useLhDivider } from './logic'
import type { LhDividerProps } from './types'

defineOptions({
  name: 'LhDivider',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhDividerProps>(), {
  direction: 'horizontal',
  dashed: false,
  labelPosition: 'center',
  borderStyle: undefined,
  customClass: undefined,
  sx: undefined,
})

const { hasContent, dividerClass, role, ariaOrientation, dividerStyle } = useLhDivider(props)
</script>

<style src="./style.css"></style>
