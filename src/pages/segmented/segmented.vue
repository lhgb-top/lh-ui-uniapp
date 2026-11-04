<template>
  <demo-page title="Segmented 分段器">
    <demo-block title="基础用法">
      <lh-segmented
        v-model="view"
        :options="['列表', '卡片', '表格']"
      />
      <text class="demo-value">已选：{{ view }}</text>
    </demo-block>

    <demo-block title="对象选项（label / value）">
      <lh-segmented
        v-model="mode"
        :options="[
          { label: '日', value: 'day' },
          { label: '周', value: 'week' },
          { label: '月', value: 'month' },
        ]"
      />
      <text class="demo-value">已选：{{ mode }}</text>
    </demo-block>

    <demo-block title="禁用项">
      <lh-segmented
        v-model="mixed"
        :options="[
          { label: '立春', value: 'lichun' },
          { label: '雨水', value: 'yushui' },
          { label: '惊蛰', value: 'jingzhe', disabled: true },
        ]"
      />
      <text class="demo-value">已选：{{ mixed }}</text>
    </demo-block>

    <demo-block title="整组禁用">
      <lh-segmented
        v-model="all"
        disabled
        :options="['甲', '乙', '丙']"
      />
    </demo-block>

    <demo-block title="块级宽度（block）">
      <lh-segmented
        v-model="block"
        block
        :options="['诗', '词', '曲', '赋']"
      />
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const view = ref('列表')
const mode = ref('day')
const mixed = ref('lichun')
const all = ref('甲')
const block = ref('诗')
</script>

<style>
.demo-value {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #8a867d;
}
</style>
