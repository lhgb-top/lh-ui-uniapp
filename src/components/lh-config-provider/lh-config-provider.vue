<template>
  <view
    class="lh-config-provider"
    :class="darkClass"
    :style="cssVars"
  >
    <slot></slot>
  </view>
</template>

<script lang="ts" setup>
import { useLhConfigProvider } from '@/config-provider'
import type { LhConfigProviderProps } from '@/config-provider/types'

defineOptions({
  name: 'LhConfigProvider',
  options: {
    // 小程序组件配置：虚拟宿主节点 + 全局样式共享
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhConfigProviderProps>(), {
  size: undefined,
  locale: undefined,
  theme: 'light',
  themeVars: undefined,
  componentTheme: undefined,
})

const { cssVars, darkClass } = useLhConfigProvider(props)
</script>

<style src="./style.css"></style>
