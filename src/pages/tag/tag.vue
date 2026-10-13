<template>
  <demo-page title="Tag 标签">
    <demo-block title="类型">
      <lh-tag>默认</lh-tag>
      <lh-tag type="primary">主要</lh-tag>
      <lh-tag type="success">成功</lh-tag>
      <lh-tag type="warning">警告</lh-tag>
      <lh-tag type="danger">危险</lh-tag>
    </demo-block>

    <demo-block title="尺寸">
      <lh-tag
        type="primary"
        size="small"
      >
        小
      </lh-tag>
      <lh-tag type="primary">中</lh-tag>
      <lh-tag
        type="primary"
        size="large"
      >
        大
      </lh-tag>
    </demo-block>

    <demo-block title="形状与样式">
      <lh-tag
        type="primary"
        round
      >
        圆角
      </lh-tag>
      <lh-tag
        type="primary"
        hit
      >
        描边
      </lh-tag>
      <lh-tag
        type="primary"
        disabled
      >
        禁用
      </lh-tag>
    </demo-block>

    <demo-block title="可关闭">
      <lh-tag
        v-for="item in tags"
        :key="item"
        type="primary"
        closable
        @close="onClose(item)"
      >
        {{ item }}
      </lh-tag>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const tags = ref(['水墨', '国风', '留白'])

function onClose(name: string) {
  tags.value = tags.value.filter((item) => item !== name)
}
</script>
