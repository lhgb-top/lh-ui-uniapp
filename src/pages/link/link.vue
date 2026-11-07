<template>
  <demo-page title="Link 链接">
    <demo-block title="类型">
      <lh-link>默认</lh-link>
      <lh-link type="primary">主要</lh-link>
      <lh-link type="success">成功</lh-link>
      <lh-link type="warning">警示</lh-link>
      <lh-link type="danger">危险</lh-link>
      <lh-link type="info">信息</lh-link>
    </demo-block>

    <demo-block title="下划线">
      <lh-link underline="always">常驻</lh-link>
      <lh-link underline="hover">悬停（默认，仅 H5）</lh-link>
      <lh-link underline="none">无</lh-link>
    </demo-block>

    <demo-block title="禁用与前后缀">
      <lh-link disabled>禁用链接</lh-link>
      <lh-link>
        <template #prefix>
          <lh-icon name="left" />
        </template>
        上一页
      </lh-link>
      <lh-link>
        下一页
        <template #suffix>
          <lh-icon name="right" />
        </template>
      </lh-link>
    </demo-block>

    <demo-block title="点击事件">
      <lh-link
        type="primary"
        @click="onClick"
      >
        点我（导航由业务层处理）
      </lh-link>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

function onClick() {
  uni.showToast({ title: '链接被点击', icon: 'none' })
}
</script>
