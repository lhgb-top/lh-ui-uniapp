<template>
  <demo-page title="Space 间距">
    <demo-block title="方向">
      <lh-space>
        <lh-tag>水墨</lh-tag>
        <lh-tag>留白</lh-tag>
        <lh-tag>国风</lh-tag>
      </lh-space>
      <lh-space direction="vertical">
        <lh-tag>水墨</lh-tag>
        <lh-tag>留白</lh-tag>
        <lh-tag>国风</lh-tag>
      </lh-space>
    </demo-block>

    <demo-block title="间距档位">
      <lh-space size="small">
        <lh-tag>小</lh-tag>
        <lh-tag>小</lh-tag>
      </lh-space>
      <lh-space size="medium">
        <lh-tag>中</lh-tag>
        <lh-tag>中</lh-tag>
      </lh-space>
      <lh-space size="large">
        <lh-tag>大</lh-tag>
        <lh-tag>大</lh-tag>
      </lh-space>
      <lh-space :size="24">
        <lh-tag>24px</lh-tag>
        <lh-tag>24px</lh-tag>
      </lh-space>
      <lh-space :size="[8, 16]">
        <lh-tag>水平8</lh-tag>
        <lh-tag>垂直16</lh-tag>
      </lh-space>
    </demo-block>

    <demo-block title="对齐与换行">
      <lh-space alignment="center">
        <lh-tag>居中</lh-tag>
        <lh-button
          type="primary"
          size="small"
        >
          按钮
        </lh-button>
      </lh-space>
      <lh-space :wrap="true">
        <lh-tag
          v-for="i in 8"
          :key="i"
          type="primary"
        >
          标签{{ i }}
        </lh-tag>
      </lh-space>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'
</script>
