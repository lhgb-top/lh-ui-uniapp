<template>
  <demo-page title="Notification 通知">
    <demo-block title="语义类型">
      <lh-button @click="notification.success({ title: '成功通知', content: '文档已写入云端' })">
        success
      </lh-button>
      <lh-button @click="notification.info({ title: '信息通知', content: '有新版本可用' })">
        info
      </lh-button>
      <lh-button @click="notification.warning({ title: '警告通知', content: '存储空间不足' })">
        warning
      </lh-button>
      <lh-button @click="notification.danger({ title: '危险通知', content: '同步失败，请重试' })">
        danger
      </lh-button>
    </demo-block>

    <demo-block title="弹出位置">
      <lh-button @click="openAt('top-right')">top-right</lh-button>
      <lh-button @click="openAt('top-left')">top-left</lh-button>
      <lh-button @click="openAt('bottom-right')">bottom-right</lh-button>
      <lh-button @click="openAt('bottom-left')">bottom-left</lh-button>
    </demo-block>

    <demo-block title="定制">
      <lh-button @click="showDuration">停留 8 秒</lh-button>
      <lh-button @click="showNoClose">不显示关闭按钮</lh-button>
      <lh-button @click="showClickable">点击有响应</lh-button>
      <lh-button @click="notification.closeAll()">全部关闭</lh-button>
    </demo-block>

    <!-- 命令式服务挂载点：notification（easycom 直接用标签；本页专用，就地放置） -->
    <lh-notification />
  </demo-page>
</template>

<script lang="ts" setup>
import { onUnmounted } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'
import { useLhNotification } from '@/notification'
import type { LhNotificationHandle, LhNotificationPosition } from '@/notification/types'

/**
 * Notification 命令式服务演示。
 *
 * 【挂载点】message / loading 的挂载点统一放在 shared/demo-page.vue；
 * notification 演示页只在本页使用，故挂载点就地放在本页模板末尾。
 * 使用方工程里同样需要在页面（或常驻根组件）里放一次 <lh-notification />。
 */
const notification = useLhNotification()

let clickableHandle: LhNotificationHandle | null = null

function openAt(position: LhNotificationPosition) {
  notification.info({
    title: `位置：${position}`,
    content: '四角独立容器，堆叠走 flex 间距',
    position,
  })
}

function showDuration() {
  notification.info({ title: '停留 8 秒', content: 'duration: 8000', duration: 8000 })
}

function showNoClose() {
  notification.info({ title: '只能等自动关闭', content: 'showClose: false', showClose: false })
}

function showClickable() {
  clickableHandle = notification.success({
    title: '点击有响应',
    content: '传入 onClick 后卡片以 button 语义呈现',
    duration: 0,
    onClick: () => {
      notification.info({ title: '卡片被点击了' })
    },
  })
}

onUnmounted(() => {
  // duration=0 的常驻通知手动收尾，避免切页后残留（挂载点卸载也会兜底清空）
  clickableHandle?.close()
})
</script>
