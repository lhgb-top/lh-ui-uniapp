<template>
  <demo-page title="DatePicker 日期选择器">
    <demo-block title="基础用法">
      <view class="demo-row">
        <lh-date-picker v-model="baseDate" />
      </view>
      <text class="demo-value">当前值：{{ format(baseDate) }}（面板内点日期为暂存，点「确定」提交）</text>
    </demo-block>

    <demo-block title="月份与年份模式">
      <view class="demo-row">
        <lh-date-picker
          v-model="monthDate"
          mode="month"
        />
      </view>
      <view class="demo-row">
        <lh-date-picker
          v-model="yearDate"
          mode="year"
        />
      </view>
      <text class="demo-value">月份 / 年份模式打开面板即落在对应网格，点击直接选中并关闭（无底部按钮）；日期模式下面板标题可逐级下钻：日期 → 月份 → 年份</text>
    </demo-block>

    <demo-block title="日期格式化">
      <view class="demo-row">
        <lh-date-picker
          v-model="formatDate"
          format="MM/dd/yyyy"
        />
      </view>
      <view class="demo-row">
        <lh-date-picker
          v-model="formatDate2"
          format="yyyy年MM月dd日"
        />
      </view>
      <text class="demo-value">format 为定宽 token（yyyy / MM / dd / HH / mm / ss），只影响显示，不改变绑定值（绑定值始终是 Date）</text>
    </demo-block>

    <demo-block title="尺寸">
      <view class="demo-row">
        <lh-date-picker
          v-model="smallDate"
          size="small"
        />
      </view>
      <view class="demo-row">
        <lh-date-picker
          v-model="mediumDate"
          size="medium"
        />
      </view>
      <view class="demo-row">
        <lh-date-picker
          v-model="largeDate"
          size="large"
        />
      </view>
    </demo-block>

    <demo-block title="禁用与只读">
      <view class="demo-row">
        <lh-date-picker
          v-model="disabledDate"
          disabled
        />
      </view>
      <view class="demo-row">
        <lh-date-picker
          :model-value="readonlyDate"
          readonly
        />
      </view>
      <text class="demo-value">disabled 禁用整个选择器（不弹层）；readonly 只读（点击不弹层，可程序化赋值）</text>
    </demo-block>

    <demo-block title="占位与清除">
      <view class="demo-row">
        <lh-date-picker
          v-model="placeholderDate"
          placeholder="请选择入住日期"
        />
      </view>
      <view class="demo-row">
        <lh-date-picker
          v-model="clearDate"
          :clearable="false"
          placeholder="不可清除"
        />
      </view>
      <text class="demo-value">占位文本未传时按 format 生成（取语言包 datepicker.year/month）；clearable 默认开</text>
    </demo-block>

    <demo-block title="区间值回显">
      <view class="demo-row">
        <lh-date-picker
          v-model="rangeDate"
          range-separator=" 至 "
        />
      </view>
      <text class="demo-value">当前值：{{ format(rangeDate[0]) }} 至 {{ format(rangeDate[1]) }}</text>
      <text class="demo-value">区间值的触发器回显与分隔符受支持；与 plus 一致，面板内的区间选择 UI 尚未实现（家族台账 P-08），点「确定」不会覆盖已传入的区间值</text>
    </demo-block>

    <demo-block title="单元格自定义类">
      <view class="demo-row">
        <lh-date-picker
          v-model="cellDate"
          :cell-class-name="cellClassName"
        />
      </view>
      <text class="demo-value">cellClassName 按日期返回类名：本周六 / 周日被标记为 my-weekend（demo 页内联样式染红）</text>
    </demo-block>

    <demo-block title="更多属性">
      <view class="demo-row">
        <lh-date-picker
          v-model="sxDate"
          popper-class="my-date-popper"
          :sx="{ mt: 2 }"
        />
      </view>
      <text class="demo-value">sx 作用于根元素（上边距）；popperClass 透传到弹层根节点，供使用方写面板级定制样式</text>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const baseDate = ref<Date | null>(new Date(2026, 10, 3))
const monthDate = ref<Date | null>(new Date(2026, 5, 1))
const yearDate = ref<Date | null>(new Date(2024, 0, 1))
const formatDate = ref<Date | null>(new Date(2026, 10, 3))
const formatDate2 = ref<Date | null>(new Date(2026, 10, 3))
const smallDate = ref<Date | null>(new Date(2026, 10, 3))
const mediumDate = ref<Date | null>(new Date(2026, 10, 3))
const largeDate = ref<Date | null>(new Date(2026, 10, 3))
const disabledDate = ref<Date | null>(new Date(2026, 10, 3))
const readonlyDate = ref<Date | null>(new Date(2026, 10, 3))
const placeholderDate = ref<Date | null>(null)
const clearDate = ref<Date | null>(new Date(2026, 10, 3))
const rangeDate = ref<[Date, Date]>([new Date(2026, 10, 1), new Date(2026, 10, 7)])
const cellDate = ref<Date | null>(new Date(2026, 10, 3))
const sxDate = ref<Date | null>(new Date(2026, 10, 3))

/** demo 回显工具：绑定值始终是 Date（组件不接收 ISO 字符串） */
function format(value: Date | null): string {
  if (!value) return '（未选择）'
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${value.getFullYear()}-${month}-${day}`
}

/** 周末标记（cellClassName 示例） */
function cellClassName(date: Date): string {
  const day = date.getDay()
  return day === 0 || day === 6 ? 'my-weekend' : ''
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
.my-weekend {
  color: var(--lh-danger-color, #c0392b);
}
</style>
