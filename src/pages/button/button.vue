<template>
  <demo-page title="Button 按钮">
    <demo-block title="类型">
      <lh-button>默认</lh-button>
      <lh-button type="primary">主要</lh-button>
      <lh-button type="success">成功</lh-button>
      <lh-button type="warning">警告</lh-button>
      <lh-button type="danger">危险</lh-button>
    </demo-block>

    <demo-block title="尺寸">
      <lh-button
        type="primary"
        size="small"
      >
        小
      </lh-button>
      <lh-button type="primary">中</lh-button>
      <lh-button
        type="primary"
        size="large"
      >
        大
      </lh-button>
    </demo-block>

    <demo-block title="状态">
      <lh-button
        type="primary"
        loading
      >
        加载中
      </lh-button>
      <lh-button
        type="primary"
        disabled
      >
        禁用
      </lh-button>
      <lh-button
        type="primary"
        plain
      >
        镂空
      </lh-button>
    </demo-block>

    <demo-block title="形状与图标">
      <lh-button
        type="primary"
        round
      >
        圆角
      </lh-button>
      <lh-button
        type="primary"
        icon="search"
      >
        搜索
      </lh-button>
      <lh-button
        type="primary"
        icon="plus"
        circle
      />
    </demo-block>

    <demo-block title="块级宽度">
      <lh-button
        type="primary"
        block
        @click="onClick"
      >
        块级按钮（点击事件）
      </lh-button>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'
import { useLhMessage } from '@/message'

const message = useLhMessage()

function onClick() {
  message.success('按钮点击')
}
</script>
