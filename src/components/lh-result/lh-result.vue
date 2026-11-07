<template>
  <view
    class="lh-result"
    :class="[resultClass, customClass]"
    :style="sxStyle"
    role="status"
  >
    <view
      v-if="iconName"
      class="lh-result__icon"
    >
      <lh-icon
        :name="iconName"
        :size="props.iconSize"
      />
    </view>
    <view class="lh-result__title">
      <slot name="title">{{ props.title }}</slot>
    </view>
    <view
      v-if="props.subTitle || hasSubTitleSlot"
      class="lh-result__subtitle"
    >
      <slot name="subTitle">{{ props.subTitle }}</slot>
    </view>
    <view class="lh-result__extra">
      <slot name="extra" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useLhResult } from './logic'
import type { LhResultProps } from './types'

defineOptions({
  name: 'LhResult',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhResultProps>(), {
  status: 'info',
  icon: undefined,
  iconSize: 64,
  title: undefined,
  subTitle: undefined,
  customClass: undefined,
  sx: undefined,
})

const { iconName, resultClass, sxStyle, hasSubTitleSlot } = useLhResult(props)
</script>

<style src="./style.css"></style>
