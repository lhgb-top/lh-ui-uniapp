<template>
  <view
    class="lh-form-item"
    :class="[
      `lh-form-item--label-${labelPosition}`,
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
