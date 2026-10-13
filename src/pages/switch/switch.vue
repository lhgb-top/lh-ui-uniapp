<template>
  <demo-page title="Switch 开关">
    <demo-block title="基础">
      <lh-switch v-model="base" />
      <text class="demo-value">{{ base ? '开' : '关' }}</text>
    </demo-block>

    <demo-block title="文案">
      <lh-switch
        v-model="withText"
        active-text="开启"
        inactive-text="关闭"
      />
    </demo-block>

    <demo-block title="尺寸">
      <lh-switch
        v-model="s1"
        size="small"
      />
      <lh-switch v-model="s2" />
      <lh-switch
        v-model="s3"
        size="large"
      />
    </demo-block>

    <demo-block title="状态">
      <lh-switch
        v-model="loading"
        loading
      />
      <lh-switch
        v-model="disabled"
        disabled
      />
    </demo-block>

    <demo-block title="change 事件">
      <lh-switch
        v-model="changeValue"
        @change="onChange"
      />
      <text class="demo-value">最近变化：{{ lastChange ?? '（无）' }}</text>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const base = ref(false)
const withText = ref(true)
const s1 = ref(true)
const s2 = ref(true)
const s3 = ref(true)
const loading = ref(true)
const disabled = ref(true)
const lastChange = ref<boolean | null>(null)
const changeValue = ref(false)

function onChange(value: boolean) {
  lastChange.value = value
}
</script>

<style>
.demo-value {
  font-size: 12px;
  color: #8a867d;
}
</style>
