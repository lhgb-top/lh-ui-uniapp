<template>
  <view class="lh-loading-container">
    <view
      v-for="instance in lhLoadingInstances"
      :key="instance.id"
      class="lh-loading"
      :class="getLhLoadingClass(instance)"
      :style="{ zIndex: String(instance.zIndex), backgroundColor: instance.background }"
    >
      <view class="lh-loading__spinner">
        <lh-icon
          name="loading"
          :size="28"
          class="lh-loading__icon"
        />
      </view>
      <text
        v-if="instance.text"
        class="lh-loading__text"
      >
        {{ instance.text }}
      </text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { lhLoadingInstances, getLhLoadingClass, closeAllLhLoading } from '@/loading/store'
import { setLhLoadingMounted } from '@/loading/index'

defineOptions({
  name: 'LhLoading',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

onMounted(() => {
  setLhLoadingMounted(true)
})

onBeforeUnmount(() => {
  setLhLoadingMounted(false)
  // 挂载点没了，残留遮罩本就不可见：清空实例，避免切页后仍往新页面渲染
  closeAllLhLoading()
})
</script>

<style src="./style.css"></style>
