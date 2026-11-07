<template>
  <demo-page title="Autocomplete 自动补全">
    <demo-block title="基础用法">
      <lh-autocomplete
        v-model="value"
        :options="options"
        placeholder="输入或聚焦展开"
      />
      <text class="demo-text">当前值：{{ value || '（空）' }}</text>
    </demo-block>

    <demo-block title="选中回调">
      <lh-autocomplete
        v-model="selectValue"
        :options="options"
        placeholder="选中后看 toast"
        @select="onSelect"
      />
    </demo-block>

    <demo-block title="大小写敏感（H5 输入法场景）">
      <lh-autocomplete
        v-model="caseValue"
        :options="enOptions"
        case-sensitive
        placeholder="Ink（大写 I 才匹配）"
      />
    </demo-block>

    <demo-block title="禁用">
      <lh-autocomplete
        :model-value="'水墨'"
        :options="options"
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
const selectValue = ref('')
const caseValue = ref('')

const options = [
  { label: '水墨' },
  { label: '留白' },
  { label: '笔锋' },
  { label: '浓淡' },
  { label: '飞白', disabled: true },
  { label: '印章', value: 'seal' },
]

const enOptions = [{ label: 'Ink' }, { label: 'Wash' }, { label: 'Seal' }]

function onSelect(value: string | number) {
  uni.showToast({ title: `选中：${value}`, icon: 'none' })
}
</script>

<style>
.demo-text {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #8a8a8a;
}
</style>
