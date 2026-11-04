<template>
  <demo-page title="Calendar 日历">
    <demo-block title="基础用法">
      <view class="demo-row">
        <lh-calendar v-model="single" />
      </view>
      <text class="demo-value">已选：{{ single ? formatD(single) : '未选择' }}</text>
    </demo-block>

    <demo-block title="一段时间选择">
      <view class="demo-row">
        <lh-calendar
          v-model="span"
          selection="range"
        />
      </view>
      <text class="demo-value">
        已选：{{ span.length === 2 ? `${formatD(span[0])} ~ ${formatD(span[1])}` : '点击两个日期' }}
      </text>
    </demo-block>

    <demo-block title="可选范围约束">
      <view class="demo-row">
        <lh-calendar
          v-model="limited"
          :range="[rangeStart, rangeEnd]"
        />
      </view>
      <text class="demo-value">仅 {{ formatD(rangeStart) }} ~ {{ formatD(rangeEnd) }} 可选，区间外禁用</text>
    </demo-block>

    <demo-block title="多选模式">
      <view class="demo-row">
        <lh-calendar
          v-model="multiple"
          selection="multiple"
        />
      </view>
      <text class="demo-value">
        已选 {{ multiple.length }} 个日期：{{ multiple.map(formatD).join('、') || '未选择' }}
      </text>
    </demo-block>

    <demo-block title="input 触发模式">
      <view class="demo-row">
        <lh-calendar
          v-model="inputValue"
          mode="input"
          selection="range"
          placeholder="请选择日期区间"
        />
      </view>
      <text class="demo-value">点击触发框展开面板，选完自动收起（closeOnSelect 默认开）</text>
    </demo-block>

    <demo-block title="多面板与自定义文案">
      <view class="demo-row">
        <lh-calendar
          v-model="panels2"
          :panels="2"
        >
          <template #header="{ year, month }">
            <view class="demo-calendar-title">自定义 {{ year }} / {{ month + 1 }}</view>
          </template>
        </lh-calendar>
      </view>
      <text class="demo-value">header 插槽可自定义面板标题；cell 插槽同理（具名插槽接收 date）</text>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const single = ref<Date>()
const span = ref<Date[]>([])
const limited = ref<Date>()
const multiple = ref<Date[]>([])
const inputValue = ref<Date | Date[]>([])
const panels2 = ref<Date>()

// 可选范围：今天起 30 天内
const rangeStart = new Date()
const rangeEnd = new Date(
  rangeStart.getFullYear(),
  rangeStart.getMonth(),
  rangeStart.getDate() + 30,
)

function formatD(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${m}-${d}`
}
</script>

<style>
.demo-row {
  width: 100%;
}
.demo-value {
  margin-top: 8px;
  font-size: 13px;
  color: #8a867d;
}
.demo-calendar-title {
  font-weight: 600;
  color: var(--lh-text-primary, #2c2c2c);
}
</style>
