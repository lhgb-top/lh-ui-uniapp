<template>
  <view
    :class="treeClasses"
    :style="treeStyle"
    role="tree"
    :aria-multiselectable="ariaMultiselectable"
    @keydown="onKeydown"
  >
    <!-- 虚拟化模式：scroll-view 承载 + 固定行高开窗渲染（uni-app 独有，大数据量场景） -->
    <scroll-view
      v-if="props.virtual"
      scroll-y
      :show-scrollbar="false"
      class="lh-tree__scroll"
      :style="{ height: scrollHeight }"
      :scroll-top="anchorScrollTop"
      @scroll="onScroll"
    >
      <view :style="phantomStyle">
        <view
          v-for="item in renderNodes"
          :key="item.key"
          :class="nodeClasses(item)"
          :style="{ paddingLeft: `${item.level * 18 + 8}px` }"
          role="treeitem"
          :aria-level="item.level + 1"
          :aria-expanded="item.isLeaf ? undefined : expanded.includes(item.key)"
          :aria-selected="selected.includes(item.key)"
          :aria-disabled="item.node.disabled || undefined"
          :tabindex="nodeTabIndex(item.key, !!item.node.disabled)"
          :data-tree-key="item.key"
          @click="handleNodeClick(item)"
        >
          <!-- 展开箭头（懒加载中显示 loading 态） -->
          <view
            v-if="!item.isLeaf"
            class="lh-tree-node__arrow"
            :class="{
              'lh-tree-node__arrow--expanded': expanded.includes(item.key),
              'lh-tree-node__arrow--loading': loadingKeys.includes(item.key),
            }"
            aria-hidden="true"
            @click.stop="toggleExpand(item.key)"
          >
            <text>▸</text>
          </view>
          <view
            v-else
            class="lh-tree-node__placeholder"
            aria-hidden="true"
          />

          <!-- 勾选框 -->
          <view
            v-if="props.showCheckbox"
            class="lh-tree-node__checkbox"
            :class="`lh-tree-node__checkbox--${item.checkState}`"
            role="checkbox"
            :aria-checked="checkedAria(item.checkState)"
            :aria-disabled="item.node.disabled || undefined"
            aria-label="选择节点"
            @click.stop="toggleCheck(item.key)"
          />

          <!-- 标签 -->
          <slot
            name="node"
            :node="item.node"
            :level="item.level"
            :expanded="expanded.includes(item.key)"
            :selected="selected.includes(item.key)"
          >
            <text class="lh-tree-node__label">{{ item.node.label }}</text>
          </slot>
        </view>
      </view>
    </scroll-view>

    <!-- 普通模式：节点直接渲染在根容器（与 plus 同构） -->
    <template v-else>
      <view
        v-for="item in renderNodes"
        :key="item.key"
        :class="nodeClasses(item)"
        :style="{ paddingLeft: `${item.level * 18 + 8}px` }"
        role="treeitem"
        :aria-level="item.level + 1"
        :aria-expanded="item.isLeaf ? undefined : expanded.includes(item.key)"
        :aria-selected="selected.includes(item.key)"
        :aria-disabled="item.node.disabled || undefined"
        :tabindex="nodeTabIndex(item.key, !!item.node.disabled)"
        :data-tree-key="item.key"
        @click="handleNodeClick(item)"
      >
        <!-- 展开箭头（懒加载中显示 loading 态） -->
        <view
          v-if="!item.isLeaf"
          class="lh-tree-node__arrow"
          :class="{
            'lh-tree-node__arrow--expanded': expanded.includes(item.key),
            'lh-tree-node__arrow--loading': loadingKeys.includes(item.key),
          }"
          aria-hidden="true"
          @click.stop="toggleExpand(item.key)"
        >
          <text>▸</text>
        </view>
        <view
          v-else
          class="lh-tree-node__placeholder"
          aria-hidden="true"
        />

        <!-- 勾选框 -->
        <view
          v-if="props.showCheckbox"
          class="lh-tree-node__checkbox"
          :class="`lh-tree-node__checkbox--${item.checkState}`"
          role="checkbox"
          :aria-checked="checkedAria(item.checkState)"
          :aria-disabled="item.node.disabled || undefined"
          aria-label="选择节点"
          @click.stop="toggleCheck(item.key)"
        />

        <!-- 标签 -->
        <slot
          name="node"
          :node="item.node"
          :level="item.level"
          :expanded="expanded.includes(item.key)"
          :selected="selected.includes(item.key)"
        >
          <text class="lh-tree-node__label">{{ item.node.label }}</text>
        </slot>
      </view>
    </template>

    <view
      v-if="flatNodes.length === 0"
      class="lh-tree__empty"
    >
      <slot name="empty">{{ emptyText }}</slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useLhTree } from './logic'
import type { LhEmitFn } from '@/types/emit'
import type { LhTreeNode } from '@lh-ui/share/core/tree'
import type { LhTreeProps } from './types'

defineOptions({
  name: 'LhTree',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<LhTreeProps>(), {
  showCheckbox: false,
  multiple: false,
  // Vue 会把缺省的 Boolean prop 归一化为 false，「默认启用」语义必须在此显式声明
  expandOnClickNode: true,
  defaultExpandedKeys: () => [],
  expandedKeys: undefined,
  defaultSelectedKeys: () => [],
  selectedKeys: undefined,
  defaultCheckedKeys: () => [],
  checkedKeys: undefined,
  checkStrictly: false,
  lazy: false,
  load: undefined,
  disabled: false,
  virtual: false,
  virtualHeight: 300,
  sx: undefined,
})

const emit = defineEmits<{
  'update:expandedKeys': [keys: string[]]
  'update:selectedKeys': [keys: string[]]
  'update:checkedKeys': [keys: string[]]
  select: [key: string, node: LhTreeNode]
  check: [keys: string[], node: LhTreeNode]
  expand: [key: string, expanded: boolean]
  nodeLoad: [node: LhTreeNode, children: LhTreeNode[]]
}>()

const {
  flatNodes,
  loadingKeys,
  treeClasses,
  treeStyle,
  ariaMultiselectable,
  renderNodes,
  phantomStyle,
  scrollHeight,
  anchorScrollTop,
  emptyText,
  expanded,
  selected,
  nodeClasses,
  nodeTabIndex,
  checkedAria,
  toggleExpand,
  toggleCheck,
  handleNodeClick,
  onKeydown,
  onScroll,
} = useLhTree(
  props,
  emit as LhEmitFn<
    | 'update:expandedKeys'
    | 'update:selectedKeys'
    | 'update:checkedKeys'
    | 'select'
    | 'check'
    | 'expand'
    | 'nodeLoad'
  >,
)
</script>

<style src="./style.css"></style>
