<template>
  <view
    v-show="isActive"
    :id="panelId"
    class="lh-tab-pane"
    :class="customClass"
    role="tabpanel"
    :aria-labelledby="panelAriaLabelledby"
    tabindex="0"
  >
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { LH_TABS_KEY } from '../lh-tabs/types'
import type { LhTabPaneProps } from './types'

defineOptions({
  name: 'LhTabPane',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhTabPaneProps>(), {
  label: '',
  disabled: false,
  customClass: undefined,
})

const context = inject(LH_TABS_KEY, null)

const isActive = computed(() => (context ? context.activeName.value === props.name : false))
const panelId = computed(() =>
  context ? `${context.idPrefix}-panel-${props.name}` : undefined,
)
const panelAriaLabelledby = computed(() =>
  context ? `${context.idPrefix}-tab-${props.name}` : undefined,
)
</script>

<!-- 无独立样式源：share 的 tabs scss 同时含容器与面板规则，复用同款净化产物
     （照 lh-breadcrumb-item 复用 lh-breadcrumb 样式的先例） -->
<style src="../lh-tabs/style.css"></style>
