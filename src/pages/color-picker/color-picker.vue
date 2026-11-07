<template>
  <demo-page title="ColorPicker 颜色选择器">
    <demo-block title="基础用法">
      <lh-color-picker v-model="value" />
      <text class="demo-text">当前值：{{ value || '（空）' }}</text>
    </demo-block>

    <demo-block title="rgb 格式">
      <lh-color-picker
        v-model="rgbValue"
        format="rgb"
      />
    </demo-block>

    <demo-block title="透明度通道">
      <lh-color-picker
        v-model="alphaValue"
        show-alpha
      />
    </demo-block>

    <demo-block title="预设色板">
      <lh-color-picker
        v-model="preValue"
        :predefine="predefine"
      />
    </demo-block>

    <demo-block title="可清除 / 禁用">
      <lh-color-picker
        v-model="clearValue"
        clearable
      />
      <lh-color-picker
        :model-value="'#2B4C7C'"
        disabled
      />
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const value = ref('#2B4C7C')
const rgbValue = ref('#2B4C7C')
const alphaValue = ref('#2B4C7C80')
const preValue = ref('')
const clearValue = ref('#C4A35A')

const predefine = ['#2B4C7C', '#C4A35A', '#5B8C5A', '#B23A3A', '#7A7A7A']
</script>

<style>
.demo-text {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #8a8a8a;
}
</style>
