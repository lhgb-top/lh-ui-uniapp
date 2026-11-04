<template>
  <demo-page title="TimePicker 时间选择器">
    <demo-block title="基础用法（含秒）">
      <view class="demo-row">
        <lh-time-picker v-model="value1" />
      </view>
      <text class="demo-value">当前值：{{ formatValue(value1, 'HH:mm:ss') }}</text>
      <text class="demo-value">默认 format 为 HH:mm:ss，时/分/秒三列面板；点击列项落位，底部「确定」提交</text>
    </demo-block>

    <demo-block title="时分格式（无秒列）">
      <view class="demo-row">
        <lh-time-picker
          v-model="value2"
          format="HH:mm"
        />
      </view>
      <text class="demo-value">当前值：{{ formatValue(value2, 'HH:mm') }}</text>
      <text class="demo-value">format 不含 ss 时面板只渲染时/分两列，占位符也按 format 生成（「时:分」）</text>
    </demo-block>

    <demo-block title="时间范围">
      <view class="demo-row">
        <lh-time-picker
          v-model="value3"
          :start="8"
          :end="20"
        />
      </view>
      <text class="demo-value">当前值：{{ formatValue(value3, 'HH:mm:ss') }}</text>
      <text class="demo-value">start=8 / end=20：小时列仅保留 8~20，「此刻」也会收敛到范围内</text>
    </demo-block>

    <demo-block title="禁用">
      <view class="demo-row">
        <lh-time-picker
          v-model="value4"
          disabled
        />
      </view>
      <view class="demo-row">
        <lh-time-picker
          v-model="value7"
          :clearable="false"
          disabled
        />
      </view>
      <text class="demo-value">disabled 禁用整个选择器（不弹层，清除按钮也不显示）</text>
    </demo-block>

    <demo-block title="步进">
      <view class="demo-row">
        <lh-time-picker
          v-model="value5"
          :step-hour="2"
          :step-minute="5"
          :step-second="10"
        />
      </view>
      <text class="demo-value">step-hour=2 / step-minute=5 / step-second=10：各列按步进生成选项</text>
    </demo-block>

    <demo-block title="占位与清除">
      <view class="demo-row">
        <lh-time-picker
          v-model="value6"
          placeholder="选择提醒时间"
        />
      </view>
      <view class="demo-row">
        <!-- 有值时 clearable 默认 true，点击清除图标置空 -->
        <lh-time-picker v-model="value8" />
      </view>
      <text class="demo-value">占位符默认按 format 生成；有值后触发器右侧显示清除图标（clearable 默认 true）</text>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { formatTime, extractTime } from '@lh-ui/share/core/time-picker'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const base = new Date(2026, 10, 3, 9, 30, 0)

const value1 = ref<Date | null>(new Date(base))
const value2 = ref<Date | null>(new Date(base))
const value3 = ref<Date | null>(new Date(base))
const value4 = ref<Date | null>(new Date(base))
const value5 = ref<Date | null>(new Date(base))
const value6 = ref<Date | null>(null)
const value7 = ref<Date | null>(new Date(base))
const value8 = ref<Date | null>(new Date(base))

/** 回显演示值：消费 share 的 formatTime 纯函数（组件内部逻辑一致） */
function formatValue(value: Date | null, format: string): string {
  if (!value) return '（未选择）'
  const { hours, minutes, seconds } = extractTime(value)
  return formatTime(hours, minutes, seconds, format)
}
</script>

<style>
.demo-row {
  width: 100%;
  margin-bottom: 8px;
}
.demo-value {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #8a867d;
}
</style>
