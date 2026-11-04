<template>
  <demo-page title="Tree 树形控件">
    <demo-block title="基础用法">
      <lh-tree
        :data="basicData"
        :default-expanded-keys="['a']"
        @select="onSelect"
      />
      <text class="tree-demo-note">select 事件：{{ lastSelect || '（未触发）' }}</text>
    </demo-block>

    <demo-block title="可勾选（级联）">
      <lh-tree
        :data="basicData"
        show-checkbox
        :default-expanded-keys="['a', 'b']"
        @check="onCheck"
      />
      <text class="tree-demo-note">
        勾选父级会级联全部后代；子级全选时父级自动选中，部分选中显示半选态。
      </text>
      <text class="tree-demo-note">check 事件勾选键：{{ lastCheck.join(', ') || '（未触发）' }}</text>
    </demo-block>

    <demo-block title="父子不联动（check-strictly）">
      <lh-tree
        :data="basicData"
        show-checkbox
        check-strictly
        :default-expanded-keys="['a', 'b']"
      />
      <text class="tree-demo-note">勾选只作用于节点自身：不级联后代、不回溯祖先、无半选态。</text>
    </demo-block>

    <demo-block title="懒加载">
      <lh-tree
        :data="lazyData"
        lazy
        :load="loadNodes"
        @node-load="onNodeLoad"
      />
      <text class="tree-demo-note">
        可加载节点须显式声明 isLeaf: false；加载中箭头旋转，resolve 提交子节点并展开。
      </text>
    </demo-block>

    <demo-block title="受控选中与勾选">
      <lh-tree
        v-model:selected-keys="selKeys"
        v-model:checked-keys="chkKeys"
        :data="ctrlData"
        multiple
        :default-expanded-keys="['x']"
      />
      <text class="tree-demo-note">选中：{{ selKeys.join(', ') }} ｜ 勾选：{{ chkKeys.join(', ') }}</text>
    </demo-block>

    <demo-block title="禁用节点 / 禁用整棵树">
      <lh-tree :data="basicData" disabled />
      <text class="tree-demo-note">运维（disabled 节点）不参与选中与勾选；disabled 属性禁用整棵树。</text>
    </demo-block>

    <demo-block title="node 插槽">
      <lh-tree :data="basicData" :default-expanded-keys="['a']">
        <template #node="{ node, level }">
          <text :class="['tree-demo-node', { 'tree-demo-node--child': level > 0 }]">
            {{ level > 0 ? '· ' : '' }}{{ node.label }}
          </text>
        </template>
      </lh-tree>
    </demo-block>

    <demo-block title="虚拟化（大数据量）">
      <lh-tree
        :data="bigData"
        virtual
        :virtual-height="320"
        show-checkbox
        :default-expanded-keys="bigExpanded"
      />
      <text class="tree-demo-note">
        virtual（uni-app 独有）开启后节点列表由 scroll-view 承载并按固定行高 34px 开窗渲染，
        适合成百上千节点的场景；普通模式下节点直接渲染在根容器。
      </text>
    </demo-block>

    <demo-block title="空数据">
      <lh-tree :data="[]" />
      <text class="tree-demo-note">空态文案取语言包 tree.empty（empty 插槽可覆盖）。</text>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'
import type { LhTreeNode } from '@lh-ui/share/core/tree'

const basicData: LhTreeNode[] = [
  {
    key: 'a',
    label: '前端',
    children: [
      { key: 'a-1', label: 'Vue' },
      { key: 'a-2', label: 'React' },
    ],
  },
  { key: 'b', label: '后端', children: [{ key: 'b-1', label: 'Node' }] },
  { key: 'c', label: '运维', disabled: true },
]

const lazyData = ref<LhTreeNode[]>([{ key: 'lazy', label: '点我加载', isLeaf: false }])

function loadNodes(
  node: LhTreeNode,
  resolve: (children: LhTreeNode[]) => void,
  reject: (reason?: unknown) => void,
) {
  // 模拟异步请求
  setTimeout(() => {
    if (node.key === 'lazy') {
      resolve([
        { key: 'lazy-1', label: '子节点一', isLeaf: true },
        { key: 'lazy-2', label: '子节点二', isLeaf: true },
      ])
    } else {
      reject(new Error('nothing to load'))
    }
  }, 600)
}

function onNodeLoad(node: LhTreeNode, children: LhTreeNode[]) {
  lastSelect.value = `nodeLoad：${node.label} → ${children.length} 个子节点`
}

const ctrlData: LhTreeNode[] = [
  { key: 'x', label: '设计', children: [{ key: 'x-1', label: '色彩' }, { key: 'x-2', label: '字体' }] },
  { key: 'y', label: '工程' },
]

const selKeys = ref(['x'])
const chkKeys = ref(['x-1'])

const lastSelect = ref('')
const lastCheck = ref<string[]>([])
function onSelect(key: string, node: LhTreeNode) {
  lastSelect.value = `${key}（${node.label}）`
}
function onCheck(keys: string[], node: LhTreeNode) {
  lastCheck.value = keys
  void node
}

// 虚拟化演示：3 个根 × 60 个子节点 = 180 行
const bigData: LhTreeNode[] = Array.from({ length: 3 }, (_, i) => ({
  key: `big-${i}`,
  label: `分组 ${i + 1}`,
  children: Array.from({ length: 60 }, (_, j) => ({
    key: `big-${i}-${j}`,
    label: `节点 ${i + 1}-${j + 1}`,
  })),
}))
const bigExpanded = ['big-0', 'big-1', 'big-2']
</script>

<style>
.tree-demo-note {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #8a867d;
}
.demo-page--dark .tree-demo-note {
  color: #b5b1a8;
}
.tree-demo-node {
  color: var(--lh-text-primary, #2c2c2c);
}
.tree-demo-node--child {
  color: var(--lh-text-secondary, #8a8a8a);
}
</style>
