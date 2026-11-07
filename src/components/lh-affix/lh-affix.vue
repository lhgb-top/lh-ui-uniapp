<template>
  <view
    :id="placeholderId"
    class="lh-affix-placeholder"
    :style="placeholderStyle"
  >
    <view
      :class="affixClasses"
      :style="affixStyle"
    >
      <slot />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useLhAffix } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhAffixProps } from './types'

defineOptions({
  name: 'LhAffix',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhAffixProps>(), {
  offsetTop: 0,
  offsetBottom: 0,
  target: undefined,
  scrollTop: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  change: [fixed: boolean]
}>()

const {
  placeholderId,
  affixClasses,
  affixStyle,
  placeholderStyle,
} = useLhAffix(
  props,
  emit as LhEmitFn<'change'>,
)
</script>

<style src="./style.css"></style>
