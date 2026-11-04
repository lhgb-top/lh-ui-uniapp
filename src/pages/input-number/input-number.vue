<template>
  <demo-page title="InputNumber 计数器">
    <demo-block title="基础用法">
      <lh-input-number v-model="basic" />
    </demo-block>

    <demo-block title="范围限制">
      <lh-input-number v-model="level" :min="1" :max="10" />
    </demo-block>

    <demo-block title="步长与精度">
      <lh-input-number v-model="stepValue" :step="2" />
      <lh-input-number v-model="precisionValue" :precision="2" placeholder="保留2位小数" :sx="{ mt: '8px' }" />
      <lh-input-number v-model="strictValue" :step="10" step-strictly placeholder="只能是10的倍数" :sx="{ mt: '8px' }" />
    </demo-block>

    <demo-block title="尺寸与控制按钮">
      <lh-input-number v-model="smallValue" size="small" />
      <lh-input-number v-model="mediumValue" size="medium" :sx="{ mt: '8px' }" />
      <lh-input-number v-model="largeValue" size="large" :sx="{ mt: '8px' }" />
      <lh-input-number v-model="noControlsValue" :controls="false" placeholder="无控制按钮" :sx="{ mt: '8px' }" />
    </demo-block>

    <demo-block title="禁用与表单名称">
      <lh-input-number :model-value="5" disabled />
      <lh-input-number v-model="namedValue" name="quantity" placeholder="name=quantity" :sx="{ mt: '8px' }" />
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const basic = ref(1)
const level = ref(5)
const stepValue = ref(2)
const precisionValue = ref(1)
const strictValue = ref(10)
const smallValue = ref(1)
const mediumValue = ref(1)
const largeValue = ref(1)
const noControlsValue = ref(1)
const namedValue = ref(1)
</script>
