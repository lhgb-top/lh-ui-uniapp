<template>
  <view
    class="lh-breadcrumb"
    :class="customClass"
    :style="sxStyle"
    :aria-label="ariaLabel"
    role="navigation"
  >
    <view class="lh-breadcrumb__list">
      <slot />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useLhBreadcrumb } from './logic'
import { lhlocale } from '@/adapter/locale'
import type { LhBreadcrumbProps } from './types'

defineOptions({
  name: 'LhBreadcrumb',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhBreadcrumbProps>(), {
  separator: '/',
  maxItems: 0,
  customClass: undefined,
  sx: undefined,
})

const { sxStyle } = useLhBreadcrumb(props)

// 无障碍标注：读屏器以此识别导航区（语言包 breadcrumb.label；computed 订阅版本号，切换语言自动更新）
const ariaLabel = computed(() => lhlocale.t('breadcrumb.label', '面包屑导航'))
</script>

<style src="./style.css"></style>
