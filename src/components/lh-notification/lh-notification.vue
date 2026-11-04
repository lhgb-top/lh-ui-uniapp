<template>
  <view
    v-for="(group, position) in groups"
    :key="position"
    class="lh-notification"
    :class="`lh-notification--${position}`"
    :style="getContainerStyle(position as LhNotificationPosition)"
    role="region"
    aria-live="polite"
    :aria-label="position"
  >
    <view
      v-for="record in group"
      :key="record.id"
      :class="getItemClasses(record)"
      :style="getItemStyle(record)"
      :role="record.onClick ? 'button' : undefined"
      @click="handleClick(record)"
    >
      <lh-icon
        :name="getIconName(record)"
        :size="16"
        class="lh-notification__icon"
      />
      <view class="lh-notification__body">
        <text class="lh-notification__title">{{ record.title }}</text>
        <text
          v-if="record.content"
          class="lh-notification__content"
        >
          {{ record.content }}
        </text>
      </view>
      <view
        v-if="record.showClose"
        class="lh-notification__close"
        :aria-label="closeLabel"
        @click.stop="closeLhNotification(record.id)"
      >
        <lh-icon
          name="close"
          :size="14"
        />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { closeLhNotification, closeAllLhNotifications } from '@/notification/store'
import { setLhNotificationMounted } from '@/notification/index'
import { useLhNotificationView } from './logic'
import type { LhNotificationPosition } from '@lh-ui/share/core/notification'

defineOptions({
  name: 'LhNotification',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const {
  groups,
  getContainerStyle,
  getItemClasses,
  getItemStyle,
  getIconName,
  closeLabel,
  handleClick,
} = useLhNotificationView()

onMounted(() => {
  setLhNotificationMounted(true)
})

onBeforeUnmount(() => {
  setLhNotificationMounted(false)
  // 挂载点没了，这些命令式实例本就不可见：清空队列并触发各条 onClose，
  // 避免记录（含自动关闭定时器）滞留模块级单例，切页后仍往新页面渲染
  closeAllLhNotifications()
})
</script>

<style src="./style.css"></style>
