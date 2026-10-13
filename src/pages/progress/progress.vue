<template>
  <demo-page title="Progress 进度条">
    <demo-block title="基础">
      <lh-progress :percentage="percentage" />
      <lh-button
        size="small"
        @click="bump"
      >
        +10
      </lh-button>
    </demo-block>

    <demo-block title="状态">
      <lh-progress
        :percentage="70"
        status="success"
      />
      <lh-progress
        :percentage="70"
        status="warning"
      />
      <lh-progress
        :percentage="70"
        status="exception"
      />
      <lh-progress :percentage="100" />
    </demo-block>

    <demo-block title="线宽与隐藏文字">
      <lh-progress
        :percentage="60"
        :stroke-width="12"
      />
      <lh-progress
        :percentage="60"
        :show-text="false"
      />
    </demo-block>

    <demo-block title="自定义颜色">
      <lh-progress
        :percentage="60"
        color="#C4A35A"
      />
      <lh-progress
        :percentage="percentage"
        :color="gradientColor"
      />
    </demo-block>

    <demo-block title="自定义格式化与文字插槽">
      <lh-progress
        :percentage="60"
        :format="format"
      />
      <lh-progress :percentage="60">
        <template #text="{ percentage: current }">
          <text class="demo-text">{{ current }} / 100</text>
        </template>
      </lh-progress>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const percentage = ref(30)

function bump() {
  percentage.value = (percentage.value + 10) % 110
}

function format(p: number) {
  return `进度 ${p}%`
}

/** 按百分比返回颜色的函数式 color */
function gradientColor(p: number) {
  return p < 50 ? '#7A7A7A' : '#5B8C5A'
}
</script>

<style>
.demo-text {
  font-size: 13px;
  color: #5a5a5a;
}
</style>
