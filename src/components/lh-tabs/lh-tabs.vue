<template>
  <view
    :class="rootClasses"
    :style="sxStyle"
  >
    <scroll-view
      class="lh-tabs__header"
      scroll-x
      enable-flex
      :show-scrollbar="false"
      role="tablist"
      @keydown="onKeydown"
    >
      <view
        v-for="pane in records"
        :id="`${idPrefix}-tab-${pane.name}`"
        :key="pane.name"
        :ref="(el) => setTabRef(pane.name, el)"
        class="lh-tabs__tab"
        :class="{
          'lh-tabs__tab--active': pane.name === activeName,
          'lh-tabs__tab--disabled': pane.disabled,
        }"
        role="tab"
        :aria-selected="pane.name === activeName"
        :aria-controls="`${idPrefix}-panel-${pane.name}`"
        :aria-disabled="pane.disabled"
        :tabindex="pane.name === activeName ? 0 : -1"
        :data-name="pane.name"
        @click="setActive(pane.name)"
      >
        <text class="lh-tabs__tab-label">{{ pane.label }}</text>
        <text
          v-if="closable && !pane.disabled"
          class="lh-tabs__tab-close"
          aria-hidden="true"
          @click.stop="removePane(pane.name)"
        >✕</text>
      </view>
      <view
        v-if="addable"
        class="lh-tabs__add"
        role="button"
        :aria-label="addLabel"
        @click="handleAdd"
      >
        <text aria-hidden="true">+</text>
      </view>
    </scroll-view>

    <view class="lh-tabs__content">
      <slot />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useLhTabs } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhTabsProps } from './types'

defineOptions({
  name: 'LhTabs',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhTabsProps>(), {
  modelValue: undefined,
  type: 'line',
  closable: false,
  addable: false,
  tabPosition: 'top',
  customClass: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [name: string]
  'tab-change': [name: string]
  'tab-remove': [name: string]
  'tab-add': []
}>()

const {
  records,
  activeName,
  idPrefix,
  rootClasses,
  sxStyle,
  addLabel,
  setActive,
  removePane,
  handleAdd,
  onKeydown,
  setTabRef,
} = useLhTabs(
  props,
  emit as LhEmitFn<'update:modelValue' | 'tab-change' | 'tab-remove' | 'tab-add'>,
)
</script>

<style src="./style.css"></style>

<!-- uni-app 独有适配样式：share 无对应产物。页签头由 scroll-view 承载，
     横向溢出时页签保持不收缩、不换行，两端均可横向滚动（enable-flex 让 MP 端
     scroll-view 成为 flex 容器；H5 端由类名 display:flex 生效） -->
<style>
.lh-tabs__header {
  flex-wrap: nowrap;
}
.lh-tabs__tab {
  flex-shrink: 0;
}
</style>
