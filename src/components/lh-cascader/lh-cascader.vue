<template>
  <view
    :id="triggerId"
    class="lh-cascader"
    :class="cascaderClass"
    :style="cascaderStyle"
    :aria-expanded="ariaExpanded"
    :aria-haspopup="ariaHaspopup"
    :aria-controls="ariaControls"
    @click="toggleOpen"
    @keydown="onTriggerKeydown"
  >
    <!-- 已选标签（多选） -->
    <view
      v-if="showTags"
      class="lh-cascader__tags"
    >
      <view
        v-for="(tag, idx) in visibleTags"
        :key="idx"
        class="lh-cascader__tag"
      >
        <text>{{ tag }}</text>
      </view>
      <text
        v-if="showTagMore"
        class="lh-cascader__tag-more"
      >+{{ multiSelectedCount - visibleTags.length }}</text>
    </view>

    <!-- 触发器正文 -->
    <view class="lh-cascader__input">
      <text
        class="lh-cascader__input-inner"
        :class="{ 'lh-cascader__input-inner--placeholder': !displayValue }"
      >{{ displayValue || placeholderText }}</text>
    </view>

    <!-- 清除按钮 -->
    <view
      v-if="showClear"
      class="lh-cascader__clear"
      @click.stop="handleClear"
    >
      <lh-icon
        name="close"
        :size="12"
      />
    </view>

    <!-- 箭头图标 -->
    <lh-icon
      name="arrow-down"
      :size="12"
      class="lh-cascader__arrow"
      :class="{ 'lh-cascader__arrow--up': visible }"
    />

    <lh-root-portal v-if="visible">
      <!-- .stop 阻止冒泡到根节点的 toggleOpen（遮罩点击会先 close 再被冒泡重新打开） -->
      <view
        class="lh-cascader__mask"
        @click.stop="handleMaskClick"
      />
      <view
        :id="popperId"
        class="lh-cascader-panel"
        :style="popperStyle"
        role="dialog"
        aria-modal="false"
        :aria-label="panelLabel"
        @click.stop
      >
        <!-- 过滤输入框（MP 无触发器内 input 聚焦语义，过滤框放弹层内，与 select 同款） -->
        <lh-input
          v-if="props.filterable"
          v-model="filterText"
          class="lh-cascader__filter"
          :placeholder="filterPlaceholder"
          size="small"
        />

        <template v-if="isFiltering">
          <!-- 搜索结果 -->
          <scroll-view
            scroll-y
            :show-scrollbar="false"
            class="lh-cascader-panel__search"
          >
            <view
              v-for="result in searchResults"
              :key="result.path.join('-')"
              class="lh-cascader-panel__search-item"
              :class="{
                'lh-cascader-panel__search-item--active': isSelected(result.path),
              }"
              @click="selectSearchResult(result)"
            >
              <text
                v-for="(label, i) in result.pathLabels"
                :key="i"
                class="lh-cascader-panel__item-label"
              >{{ label }}<text v-if="i < result.pathLabels.length - 1">{{ props.separator }}</text></text>
            </view>
            <view
              v-if="searchResults.length === 0"
              class="lh-cascader-panel__empty"
            >
              <slot name="no-match">{{ noMatchText }}</slot>
            </view>
          </scroll-view>
        </template>

        <template v-else>
          <!-- 级联面板列：每列一个 scroll-view 纵向滚动（MP 的 view 无可靠溢出滚动） -->
          <scroll-view
            v-for="(panel, pIndex) in panels"
            :key="pIndex"
            scroll-y
            :show-scrollbar="false"
            class="lh-cascader-panel__column"
            role="listbox"
            :aria-label="columnLabel(pIndex)"
            :aria-level="pIndex + 1"
          >
            <view
              v-for="(item, index) in panel.items"
              :key="item.value"
              class="lh-cascader-panel__item"
              :class="{
                'lh-cascader-panel__item--active': isPanelActive(pIndex, item.value),
                'lh-cascader-panel__item--disabled': item.isDisabled,
              }"
              role="option"
              :tabindex="itemTabIndex(pIndex, index)"
              :aria-selected="isPanelActive(pIndex, item.value)"
              :aria-disabled="item.isDisabled"
              :aria-expanded="item.hasChildren ? item.isExpanded : undefined"
              @click="onItemClick(pIndex, item)"
              @mouseenter="onItemHover(pIndex, item)"
              @keydown="onItemKeydown($event, pIndex, index)"
            >
              <text class="lh-cascader-panel__item-label">{{ item.label }}</text>
              <lh-icon
                v-if="item.isExpanded"
                name="arrow-right"
                :size="12"
              />
              <lh-icon
                v-else-if="item.hasChildren"
                name="arrow-down"
                :size="12"
              />
            </view>
          </scroll-view>
        </template>
      </view>
    </lh-root-portal>
  </view>
</template>

<script lang="ts" setup>
import { useLhCascader } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhCascaderNode } from '@lh-ui/share/core/cascader'
import type { LhCascaderProps } from './types'

defineOptions({
  name: 'LhCascader',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhCascaderProps>(), {
  modelValue: () => [],
  options: () => [],
  size: undefined,
  disabled: false,
  clearable: true,
  placeholder: undefined,
  readonly: false,
  showAllLevels: true,
  checkStrictly: false,
  emitPath: true,
  multiple: false,
  cascading: true,
  separator: '/',
  collapseTags: false,
  filterable: false,
  itemConfig: () => ({}),
  customClass: undefined,
  themeVars: undefined,
  sx: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: (string | number)[]]
  change: [value: (string | number)[], path: LhCascaderNode[] | null]
}>()

const {
  triggerId,
  popperId,
  visible,
  popperStyle,
  filterText,
  panels,
  searchResults,
  isFiltering,
  placeholderText,
  filterPlaceholder,
  noMatchText,
  panelLabel,
  columnLabel,
  displayValue,
  showTags,
  visibleTags,
  showTagMore,
  multiSelectedCount,
  showClear,
  cascaderClass,
  cascaderStyle,
  ariaExpanded,
  ariaHaspopup,
  ariaControls,
  isPanelActive,
  isSelected,
  itemTabIndex,
  toggleOpen,
  onItemClick,
  onItemHover,
  onItemKeydown,
  onTriggerKeydown,
  selectSearchResult,
  handleClear,
  handleMaskClick,
} = useLhCascader(props, emit as LhEmitFn<'update:modelValue' | 'change'>)
</script>

<style src="./style.css"></style>

<!-- uni-app 独有适配样式：share 无对应产物（plus 的弹层挂 body Teleport 下，
     uni-app 走 lh-root-portal 承载 + 页内透明遮罩）。
     lh-root-portal 容器是 pointer-events:none，弹层与遮罩需各自恢复 -->
<style>
.lh-cascader-panel {
  pointer-events: auto;
}

.lh-cascader__mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  background-color: transparent;
  z-index: -1;
}

/* share 的占位符色只写在 ::placeholder（MP 不支持），text 节点占位用修饰类补色 */
.lh-cascader__input-inner--placeholder {
  color: var(--lh-text-placeholder, #B0B0B0);
}

.lh-cascader__arrow--up {
  transform: rotate(180deg);
}
</style>
