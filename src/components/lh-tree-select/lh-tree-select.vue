<template>
  <view
    :id="triggerId"
    class="lh-tree-select"
    :class="rootClass"
    :style="rootStyle"
    :aria-expanded="visible"
    aria-haspopup="tree"
    :aria-label="triggerLabel"
  >
    <view
      class="lh-tree-select__trigger"
      @click="toggleOpen"
    >
      <text
        v-if="displayText"
        class="lh-tree-select__value"
      >{{ displayText }}</text>
      <text
        v-else
        class="lh-tree-select__placeholder"
      >{{ placeholderText }}</text>
      <lh-icon
        name="arrow-down"
        :size="12"
        class="lh-tree-select__arrow"
        :class="{ 'lh-tree-select__arrow--open': visible }"
      />
    </view>

    <lh-root-portal v-if="visible">
      <view
        class="lh-tree-select__mask"
        @click="handleMaskClick"
      />
      <view
        :id="popperId"
        class="lh-tree-select__panel"
        :style="popperStyle"
        role="listbox"
        :aria-multiselectable="props.multiple || undefined"
        @click.stop
      >
        <!-- 树面板：scroll-view 承载纵向滚动（MP 的 view 无可靠溢出滚动），
             树形渲染 / 勾选级联全部由 lh-tree 消费 core/tree 纯函数 -->
        <scroll-view
          class="lh-tree-select__tree"
          scroll-y
          :show-scrollbar="false"
        >
          <lh-tree
            :data="props.data"
            :show-checkbox="props.multiple"
            :expanded-keys="expandedKeys"
            :selected-keys="selectedKeys"
            :checked-keys="props.multiple ? selectedKeys : undefined"
            @update:expanded-keys="onExpandedChange"
            @update:selected-keys="onSelectedChange"
            @update:checked-keys="onCheckedChange"
          />
        </scroll-view>
      </view>
    </lh-root-portal>
  </view>
</template>

<script lang="ts" setup>
import { useLhTreeSelect } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhTreeSelectProps } from './types'

defineOptions({
  name: 'LhTreeSelect',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhTreeSelectProps>(), {
  data: () => [],
  modelValue: undefined,
  multiple: false,
  disabled: false,
  placeholder: undefined,
  customClass: undefined,
  themeVars: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | undefined]
  change: [value: string | string[] | undefined]
}>()

const {
  triggerId,
  popperId,
  visible,
  popperStyle,
  expandedKeys,
  selectedKeys,
  rootClass,
  rootStyle,
  displayText,
  placeholderText,
  triggerLabel,
  toggleOpen,
  handleMaskClick,
  onExpandedChange,
  onSelectedChange,
  onCheckedChange,
} = useLhTreeSelect(props, emit as LhEmitFn<'update:modelValue' | 'change'>)
</script>

<style src="./style.css"></style>

<!-- uni-app 独有适配样式：share 无对应产物（plus 的弹层挂 body Teleport 下，
     uni-app 走 lh-root-portal 承载 + 页内透明遮罩）。
     lh-root-portal 容器是 pointer-events:none，弹层与遮罩需各自恢复 -->
<style>
.lh-tree-select__panel {
  pointer-events: auto;
}

.lh-tree-select__mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  background-color: transparent;
  z-index: -1;
}

/* 树面板纵向滚动：share 的 .lh-tree-select__panel 用 overflow: auto，
   MP 的 view 无可靠溢出滚动，改由 scroll-view 承载并同步最大高度 */
.lh-tree-select__tree {
  max-height: 320px;
}
</style>
