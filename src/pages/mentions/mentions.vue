<template>
  <demo-page title="Mentions 提及">
    <demo-block title="基础用法">
      <lh-mentions
        v-model="value"
        :options="members"
      />
      <text class="demo-text">当前值：{{ value || '（空）' }}</text>
    </demo-block>

    <demo-block title="多行">
      <lh-mentions
        v-model="multilineValue"
        :options="members"
        multiline
        placeholder="多行输入，@ 提及成员"
      />
    </demo-block>

    <demo-block title="过滤与禁用成员">
      <lh-mentions
        v-model="filterValue"
        :options="members"
        placeholder="输入 @墨 过滤"
      />
    </demo-block>

    <demo-block title="禁用">
      <lh-mentions
        :model-value="'已锁定 @水墨'"
        :options="members"
        disabled
      />
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const value = ref('')
const multilineValue = ref('')
const filterValue = ref('')

const members = [
  { label: '水墨', value: 'ink' },
  { label: '留白', value: 'blank' },
  { label: '笔锋', value: 'brush' },
  { label: '飞白', disabled: true },
]
</script>

<style>
.demo-text {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #8a8a8a;
}
</style>
