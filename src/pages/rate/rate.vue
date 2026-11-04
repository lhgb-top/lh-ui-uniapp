<template>
  <demo-page title="Rate 评分">
    <demo-block title="基础用法">
      <lh-rate v-model="basic" />
    </demo-block>

    <demo-block title="半星">
      <lh-rate v-model="half" allow-half />
    </demo-block>

    <demo-block title="只读与分数文本">
      <lh-rate :model-value="3.5" readonly allow-half show-score />
      <lh-rate :model-value="4" readonly show-score score-template="{n} 分" :sx="{ mt: '8px' }" />
    </demo-block>

    <demo-block title="自定义星数与字符">
      <lh-rate v-model="custom" :max="8" character="墨" />
    </demo-block>

    <demo-block title="禁用">
      <lh-rate :model-value="2" disabled />
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const basic = ref(3)
const half = ref(4.5)
const custom = ref(5)
</script>
