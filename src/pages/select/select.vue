<template>
  <demo-page title="Select 选择器">
    <demo-block title="基础">
      <lh-select
        v-model="base"
        :options="options"
        placeholder="请选择画风"
        style="width: 100%"
      />
      <text class="demo-value">已选：{{ base || '（无）' }}</text>
    </demo-block>

    <demo-block title="可过滤">
      <lh-select
        v-model="filterable"
        :options="options"
        filterable
        placeholder="输入关键字过滤"
        style="width: 100%"
      />
    </demo-block>

    <demo-block title="可清除与禁用">
      <lh-select
        v-model="clearable"
        :options="options"
        clearable
        placeholder="可清除"
        style="width: 100%"
      />
      <lh-select
        v-model="disabled"
        :options="options"
        disabled
        placeholder="禁用"
        style="width: 100%"
      />
    </demo-block>

    <demo-block title="尺寸">
      <lh-select
        v-model="s1"
        :options="options"
        size="small"
        placeholder="small"
        style="width: 100%"
      />
      <lh-select
        v-model="s2"
        :options="options"
        placeholder="medium"
        style="width: 100%"
      />
      <lh-select
        v-model="s3"
        :options="options"
        size="large"
        placeholder="large"
        style="width: 100%"
      />
    </demo-block>

    <demo-block title="弹层方位">
      <view
        v-for="p in placements"
        :key="p"
        class="demo-row"
      >
        <lh-select
          v-model="placementValue[p]"
          :options="options"
          :placement="p"
          :placeholder="p"
          style="flex: 1"
        />
      </view>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const options = [
  { label: '水墨', value: 'ink' },
  { label: '丹青', value: 'danqing' },
  { label: '留白', value: 'liubai' },
  { label: '飞白', value: 'cursive' },
  { label: '青绿山水', value: 'qinglv' },
]

const base = ref('')
const filterable = ref('')
const clearable = ref('ink')
const disabled = ref('')
const s1 = ref('')
const s2 = ref('')
const s3 = ref('')

const placements = ['top', 'bottom', 'top-start', 'bottom-start']
const placementValue = ref<Record<string, string>>({})
</script>

<style>
.demo-value {
  font-size: 12px;
  color: #8a867d;
}
.demo-row {
  width: 100%;
}
</style>
