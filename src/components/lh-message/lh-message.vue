<template>
  <view class="lh-message-container">
    <view
      v-for="record in lhMessageRecords"
      :key="record.id"
      class="lh-message"
      :class="[`lh-message--${record.type}`, { 'lh-message--closing': closingIds.has(record.id) }]"
      :style="{ top: `${record.offset}px` }"
      @click="handleClick(record)"
    >
      <lh-icon
        v-if="getIconName(record.type)"
        :name="getIconName(record.type) as string"
        :size="16"
        class="lh-message__icon"
      />
      <text class="lh-message__content">{{ record.content }}</text>
      <view
        v-if="record.showClose"
        class="lh-message__close"
        @click.stop="closeLhMessage(record.id)"
      >
        <lh-icon
          name="close"
          :size="12"
        />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { getMessageIconName } from '@lh-ui/share/core/message'
import { lhMessageRecords, closeLhMessage, closeAllLhMessages } from '@/message/store'
import { setLhMessageMounted } from '@/message/index'
import type { LhMessageRecord, LhMessageType } from '@lh-ui/share/core/message'

defineOptions({
  name: 'LhMessage',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

/** 关闭中标记（驱动离开动画；MP 端 transitionend 不可靠，关闭直接由 store 移除） */
const closingIds = new Set<number>()

onMounted(() => {
  setLhMessageMounted(true)
})

onBeforeUnmount(() => {
  setLhMessageMounted(false)
  // 挂载点没了，这些命令式实例本就不可见：清空队列并触发各条 onClose，
  // 避免记录（含自动关闭定时器）滞留模块级单例，切页后仍往新页面渲染
  closeAllLhMessages()
})

function getIconName(type: LhMessageType) {
  return getMessageIconName(type)
}

function handleClick(record: LhMessageRecord) {
  // 点击消息体不关闭（与 plus 一致）；仅 showClose 的关闭按钮触发关闭
  void record
}
</script>

<style src="./style.css"></style>
