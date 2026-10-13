<template>
  <demo-page title="Skeleton 骨架屏">
    <demo-block title="基础">
      <lh-skeleton :loading="loading">
        <text class="demo-text">真实内容：水墨留白，气韵生动。</text>
      </lh-skeleton>
      <lh-button
        size="small"
        @click="loading = !loading"
      >
        切换 {{ loading ? '显示内容' : '显示骨架' }}
      </lh-button>
    </demo-block>

    <demo-block title="带头像">
      <lh-skeleton
        :loading="loading"
        avatar
        :rows="4"
      />
    </demo-block>

    <demo-block title="关闭动画">
      <lh-skeleton
        :loading="loading"
        :animated="false"
        :rows="3"
      />
    </demo-block>

    <demo-block title="独立占位块">
      <view class="skeleton-items">
        <lh-skeleton-item variant="text" />
        <lh-skeleton-item variant="rect" />
        <lh-skeleton-item variant="circle" />
      </view>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const loading = ref(true)
</script>

<style>
.demo-text {
  font-size: 14px;
  color: #5a5a5a;
}
.skeleton-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
