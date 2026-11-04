<template>
  <demo-page title="Slider 滑块">
    <demo-block title="基础用法">
      <view class="demo-row">
        <lh-slider v-model="basic" />
      </view>
      <text class="demo-value">当前值：{{ basic }}</text>
    </demo-block>

    <demo-block title="范围选择">
      <view class="demo-row">
        <lh-slider
          v-model="range"
          range
        />
      </view>
      <text class="demo-value">当前值：[{{ range[0] }}, {{ range[1] }}]</text>
    </demo-block>

    <demo-block title="步长与刻度">
      <view class="demo-row">
        <lh-slider
          v-model="stepped"
          :min="0"
          :max="100"
          :step="10"
          :marks="marks"
        />
      </view>
      <text class="demo-value">step=10，触点自动吸附到 10 的倍数；marks 渲染刻度文案</text>
    </demo-block>

    <demo-block title="禁用">
      <view class="demo-row">
        <lh-slider
          v-model="basic"
          disabled
        />
      </view>
      <text class="demo-value">禁用时拖动与键盘步进均无响应</text>
    </demo-block>

    <demo-block title="显示数值">
      <view class="demo-row">
        <lh-slider
          v-model="basic"
          show-input
        />
      </view>
      <text class="demo-value">show-input 在轨道右侧回显当前值（范围模式为 [起, 止]）</text>
    </demo-block>

    <demo-block title="自定义范围与尺寸">
      <view class="demo-row">
        <lh-slider
          v-model="score"
          :min="-10"
          :max="10"
          :step="2"
          show-input
        />
      </view>
      <view class="demo-row">
        <lh-slider
          v-model="score"
          size="small"
          :min="-10"
          :max="10"
        />
      </view>
      <view class="demo-row">
        <lh-slider
          v-model="score"
          size="large"
          :min="-10"
          :max="10"
        />
      </view>
      <text class="demo-value">min/max 任意区间；size 控制轨道与触点尺寸（small / medium / large）</text>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const basic = ref(30)
const range = ref<[number, number]>([20, 60])
const stepped = ref(30)
const score = ref(0)

const marks: Record<number, string> = {
  0: '0',
  25: '25',
  50: '50',
  75: '75',
  100: '100',
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
</style>
