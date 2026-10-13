<template>
  <lh-config-provider :theme="dark ? 'dark' : 'light'">
    <view
      class="demo-page"
      :class="{ 'demo-page--dark': dark }"
    >
      <view class="demo-page__header">
        <text class="demo-page__title">{{ title }}</text>
        <view
          class="demo-page__theme"
          @click="toggle"
        >
          <text class="demo-page__theme-text">{{ dark ? '🌙 暗色' : '☀️ 亮色' }}</text>
        </view>
      </view>
      <view class="demo-page__body">
        <slot />
      </view>
      <!-- 命令式服务挂载点：message / loading（easycom 直接用标签） -->
      <lh-message />
      <lh-loading />
    </view>
  </lh-config-provider>
</template>

<script lang="ts" setup>
import { useLhDarkTheme } from './dark'

defineOptions({
  name: 'DemoPage',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

defineProps<{
  title?: string
}>()

const { dark, toggle } = useLhDarkTheme()
</script>

<style>
.demo-page {
  min-height: 100vh;
  padding: 16px;
  background-color: #f5f3ee;
}
.demo-page--dark {
  background-color: #1a1a1a;
}
.demo-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.demo-page__title {
  font-size: 18px;
  font-weight: 600;
  color: #2c2c2c;
}
.demo-page--dark .demo-page__title {
  color: #e8e6e1;
}
.demo-page__theme {
  padding: 4px 10px;
  border: 1px solid #d8d4cc;
  border-radius: 999px;
}
.demo-page__theme-text {
  font-size: 12px;
  color: #5a5a5a;
}
.demo-page--dark .demo-page__theme {
  border-color: #3a3a3a;
}
.demo-page--dark .demo-page__theme-text {
  color: #b0aca3;
}
.demo-page__body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
