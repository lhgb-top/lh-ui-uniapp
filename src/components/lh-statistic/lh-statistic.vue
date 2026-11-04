<template>
  <view
    class="lh-statistic"
    :class="customClass"
    :style="sxStyle"
  >
    <view
      v-if="props.title || $slots.title"
      class="lh-statistic__title"
    >
      <slot name="title">{{ props.title }}</slot>
    </view>
    <view class="lh-statistic__content">
      <view
        v-if="props.prefix || $slots.prefix"
        class="lh-statistic__prefix"
      >
        <slot name="prefix">{{ props.prefix }}</slot>
      </view>
      <view
        class="lh-statistic__value"
        aria-live="polite"
      >{{ displayValue }}</view>
      <view
        v-if="props.suffix || $slots.suffix"
        class="lh-statistic__suffix"
      >
        <slot name="suffix">{{ props.suffix }}</slot>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useLhStatistic } from './logic'
import type { LhStatisticProps } from './types'

defineOptions({
  name: 'LhStatistic',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhStatisticProps>(), {
  title: undefined,
  value: 0,
  precision: 0,
  separator: ',',
  prefix: undefined,
  suffix: undefined,
  customClass: undefined,
  sx: undefined,
})

const { displayValue, sxStyle } = useLhStatistic(props)
</script>

<style src="./style.css"></style>
