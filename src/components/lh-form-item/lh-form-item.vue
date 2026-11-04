<template>
  <view
    class="lh-form-item"
    :class="[
      // 四档 label 位置类，与 plus/react 及 share 样式源（styles/form 的
      // --top/--left/--right/--bottom 修饰类）对齐；旧 --label-* 类名与 CSS 断链，已废弃
      `lh-form-item--${labelPosition}`,
      { 'lh-form-item--error': !!errorMessage },
      customClass,
    ]"
  >
    <view
      v-if="props.label || props.required"
      class="lh-form-item__label"
      :style="labelStyle"
    >
      <text
        v-if="props.required"
        class="lh-form-item__required"
      >*</text>
      <text>{{ props.label }}</text>
    </view>
    <view class="lh-form-item__content">
      <slot />
      <text
        v-if="errorMessage"
        class="lh-form-item__error"
      >
        {{ errorMessage }}
      </text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { inject } from 'vue'
import { useLhFormItem } from '../lh-form/logic'
import { LH_FORM_CONTEXT_KEY } from '../lh-form/types'
import type { LhFormItemProps } from '../lh-form/types'

defineOptions({
  name: 'LhFormItem',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhFormItemProps>(), {
  prop: undefined,
  label: undefined,
  required: false,
  rules: undefined,
  customClass: undefined,
})

const { errorMessage } = useLhFormItem(props)

const formContext = inject(LH_FORM_CONTEXT_KEY, null)

const labelPosition = computed(() => formContext?.labelPosition ?? 'right')

const labelStyle = computed(() => {
  const width = formContext?.labelWidth
  if (!width) return {}
  return { width: typeof width === 'number' ? `${width}px` : width }
})
</script>

<style src="../lh-form/style.css"></style>
