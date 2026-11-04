<template>
  <demo-page title="Tabs 标签页">
    <demo-block title="基础用法（line 线条）">
      <lh-tabs v-model="active">
        <lh-tab-pane
          name="ink"
          label="水墨"
        >
          <text class="tabs-demo-text">水墨：焦、浓、重、淡、清。</text>
        </lh-tab-pane>
        <lh-tab-pane
          name="danqing"
          label="丹青"
        >
          <text class="tabs-demo-text">丹青：丹砂与青雘，指代绘画。</text>
        </lh-tab-pane>
        <lh-tab-pane
          name="liubai"
          label="留白"
        >
          <text class="tabs-demo-text">留白：计白当黑，气韵生动。</text>
        </lh-tab-pane>
      </lh-tabs>
    </demo-block>

    <demo-block title="卡片式（type='card'）">
      <lh-tabs
        v-model="activeCard"
        type="card"
      >
        <lh-tab-pane
          name="spring"
          label="春"
        >
          <text class="tabs-demo-text">春：草木萌动。</text>
        </lh-tab-pane>
        <lh-tab-pane
          name="summer"
          label="夏"
        >
          <text class="tabs-demo-text">夏：万物华实。</text>
        </lh-tab-pane>
        <lh-tab-pane
          name="autumn"
          label="秋"
        >
          <text class="tabs-demo-text">秋：白露为霜。</text>
        </lh-tab-pane>
      </lh-tabs>
    </demo-block>

    <demo-block title="页签位置（tab-position='bottom'）">
      <lh-tabs
        v-model="activeBottom"
        tab-position="bottom"
      >
        <lh-tab-pane
          name="poem"
          label="诗"
        >
          <text class="tabs-demo-text">诗：言志。</text>
        </lh-tab-pane>
        <lh-tab-pane
          name="painting"
          label="画"
        >
          <text class="tabs-demo-text">画：写意。</text>
        </lh-tab-pane>
      </lh-tabs>
    </demo-block>

    <demo-block title="禁用页签">
      <lh-tabs v-model="activeDisabled">
        <lh-tab-pane
          name="first"
          label="可用"
        >
          <text class="tabs-demo-text">第一个页签可用。</text>
        </lh-tab-pane>
        <lh-tab-pane
          name="second"
          label="禁用"
          disabled
        >
          <text class="tabs-demo-text">该页签被禁用，不可激活。</text>
        </lh-tab-pane>
        <lh-tab-pane
          name="third"
          label="可用"
        >
          <text class="tabs-demo-text">第三个页签可用。</text>
        </lh-tab-pane>
      </lh-tabs>
    </demo-block>

    <demo-block title="可关闭 + 新增按钮（closable / addable）">
      <lh-tabs
        v-model="activeEditable"
        closable
        addable
        @tab-remove="handleRemove"
        @tab-add="handleAdd"
      >
        <lh-tab-pane
          v-for="pane in panes"
          :key="pane.name"
          :name="pane.name"
          :label="pane.label"
        >
          <text class="tabs-demo-text">{{ pane.label }}：页签内容。</text>
        </lh-tab-pane>
      </lh-tabs>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const active = ref('ink')
const activeCard = ref('spring')
const activeBottom = ref('poem')
const activeDisabled = ref('first')

// closable / addable 只是触发事件：页签的增删由业务层自行维护，
// 组件本身不改变子节点（与 plus 仓一致）
const activeEditable = ref('one')
const panes = ref([
  { name: 'one', label: '标签一' },
  { name: 'two', label: '标签二' },
  { name: 'three', label: '标签三' },
])

function handleRemove(name: string) {
  panes.value = panes.value.filter((pane) => pane.name !== name)
}

let seq = 3
function handleAdd() {
  seq += 1
  const name = `new-${seq}`
  panes.value.push({ name, label: `标签${seq}` })
  activeEditable.value = name
}
</script>

<style>
.tabs-demo-text {
  display: block;
  padding: 4px 0;
  font-size: 14px;
  color: #5a5a5a;
}
</style>
