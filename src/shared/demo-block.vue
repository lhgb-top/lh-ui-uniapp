<template>
  <view class="demo-block">
    <text class="demo-block__title">{{ title }}</text>
    <view class="demo-block__content">
      <slot />
    </view>
  </view>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'DemoBlock',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

defineProps<{
  title?: string
}>()
</script>

<style>
.demo-block {
  padding: 12px;
  background-color: #ffffff;
  border-radius: 8px;
}
.demo-page--dark .demo-block {
  background-color: #262626;
}
.demo-block__title {
  display: block;
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #8a867d;
}
.demo-page--dark .demo-block__title {
  color: #8f8b82;
}
.demo-block__content {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}
</style>
