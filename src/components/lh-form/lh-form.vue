<template>
  <view
    class="lh-form"
    :class="[`lh-form--label-${labelPosition}`, customClass]"
  >
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance } from 'vue'
import { useLhForm } from './logic'
import type { LhFormProps } from './types'

defineOptions({
  name: 'LhForm',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhFormProps>(), {
  model: () => ({}),
  rules: undefined,
  labelPosition: 'right',
  labelWidth: undefined,
  inline: false,
  customClass: undefined,
  sx: undefined,
})

const { validate, validateField, resetField, resetFields } = useLhForm(props)

const labelPosition = computed(() => props.labelPosition)

// 通过 defineExpose 暴露命令式方法（供父组件 ref 调用）
// 【时序约束】父组件必须在 onReady 之后调用这些方法（onLoad 阶段组件未挂载完毕）
defineExpose({
  validate,
  validateField,
  resetField,
  resetFields,
})

// instance 保留供未来扩展（如原生表单提交场景）
void getCurrentInstance
</script>

<style src="./style.css"></style>
