<template>
  <demo-page title="Message / Loading 服务">
    <demo-block title="Message 类型">
      <lh-button @click="message.success('成功消息')">success</lh-button>
      <lh-button @click="message.info('信息消息')">info</lh-button>
      <lh-button @click="message.warning('警告消息')">warning</lh-button>
      <lh-button @click="message.danger('危险消息')">danger</lh-button>
      <lh-button @click="message.error('错误消息')">error</lh-button>
    </demo-block>

    <demo-block title="Message 定制">
      <lh-button @click="showDuration">停留 5 秒</lh-button>
      <lh-button @click="showManual">手动关闭</lh-button>
      <lh-button @click="message.closeAll()">全部关闭</lh-button>
    </demo-block>

    <demo-block title="Loading 遮罩">
      <lh-button
        type="primary"
        @click="showLoading"
      >
        显示加载
      </lh-button>
      <lh-button
        type="primary"
        @click="showLoadingText"
      >
        带文案加载
      </lh-button>
      <lh-button @click="loading.closeAll()">关闭全部</lh-button>
    </demo-block>

    <demo-block title="组合用法">
      <lh-button
        type="primary"
        block
        @click="simulate"
      >
        模拟提交（加载 → 成功提示）
      </lh-button>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { onUnmounted } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'
import { useLhMessage } from '@/message'
import { useLhLoading } from '@/loading'

const message = useLhMessage()
const loading = useLhLoading()

let manualHandle: { close: () => void } | null = null

function showDuration() {
  message.success('我会在 5 秒后消失', { duration: 5000 })
}

function showManual() {
  manualHandle = message.loading('手动关闭中…')
}

function showLoading() {
  const handle = loading.show()
  setTimeout(() => handle.close(), 2000)
}

function showLoadingText() {
  const handle = loading.show({ text: '加载中…' })
  setTimeout(() => handle.close(), 2000)
}

function simulate() {
  const handle = loading.show({ text: '提交中…' })
  setTimeout(() => {
    handle.close()
    message.success('提交成功')
  }, 1500)
}

onUnmounted(() => {
  manualHandle?.close()
})
</script>
