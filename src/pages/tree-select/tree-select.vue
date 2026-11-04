<template>
  <demo-page title="TreeSelect 树形选择器">
    <demo-block title="基础用法">
      <view class="demo-row">
        <lh-tree-select
          v-model="value1"
          :data="data"
          placeholder="请选择节点"
        />
      </view>
      <text class="demo-value">当前值：{{ value1 ?? '（未选择）' }}</text>
      <text class="demo-value">点击节点即选中（含非叶节点）并关闭面板；点箭头只展开不选中</text>
    </demo-block>

    <demo-block title="多选模式">
      <view class="demo-row">
        <lh-tree-select
          v-model="value2"
          :data="data"
          multiple
          placeholder="请选择多个节点"
        />
      </view>
      <text class="demo-value">已选：{{ value2.length }} 项（{{ value2.join('、') }}）</text>
      <text class="demo-value">勾选父子级联：勾父节点自动带上全部后代，全部后代勾选时父节点变全选</text>
    </demo-block>

    <demo-block title="预设值回显">
      <view class="demo-row">
        <!-- 单选预设值：触发器直接回显 label -->
        <lh-tree-select
          v-model="presetSingle"
          :data="data"
        />
      </view>
      <view class="demo-row">
        <!-- 多选预设值：勾选框与触发器回显都由 v-model 驱动 -->
        <lh-tree-select
          v-model="presetMulti"
          :data="data"
          multiple
        />
      </view>
      <text class="demo-value">单选预设：{{ presetSingle }}；多选预设：{{ presetMulti.join('、') }}</text>
    </demo-block>

    <demo-block title="禁用">
      <view class="demo-row">
        <lh-tree-select
          v-model="value3"
          :data="disabledData"
          placeholder="节点级与整体禁用"
        />
      </view>
      <view class="demo-row">
        <lh-tree-select
          v-model="value3"
          :data="data"
          disabled
          placeholder="整体禁用"
        />
      </view>
      <text class="demo-value">「设计指南」节点本身被禁用（数据级 disabled）；disabled 禁用整个选择器</text>
    </demo-block>

    <demo-block title="自定义占位符">
      <view class="demo-row">
        <lh-tree-select
          v-model="value4"
          :data="data"
          placeholder="自定义占位文案"
        />
      </view>
      <text class="demo-value">未传 placeholder 时取语言包 select.placeholder（中文「请选择」）</text>
    </demo-block>

    <demo-block title="空数据">
      <view class="demo-row">
        <lh-tree-select
          v-model="value5"
          :data="[]"
        />
      </view>
      <text class="demo-value">空树展示语言包 tree.empty（中文「暂无数据」）</text>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const value1 = ref<string | undefined>(undefined)
const value2 = ref<string[]>([])
const value3 = ref<string | undefined>(undefined)
const value4 = ref<string | undefined>(undefined)
const value5 = ref<string | undefined>(undefined)

const presetSingle = ref<string>('yuansze')
const presetMulti = ref<string[]>(['xihu', 'binjiang'])

const data = [
  {
    key: 'zhinan',
    label: '指南',
    children: [
      {
        key: 'sheji',
        label: '设计指南',
        children: [
          { key: 'yuansze', label: '颜色' },
          { key: 'fuziyuanze', label: '字体' },
        ],
      },
      { key: 'shejiguize', label: '设计规则' },
    ],
  },
  {
    key: 'zujian',
    label: '组件',
    children: [
      { key: 'jiben', label: '基础' },
      { key: 'fankui', label: '反馈' },
    ],
  },
]

const disabledData = [
  {
    key: 'zhinan',
    label: '指南',
    children: [
      {
        key: 'sheji',
        label: '设计指南',
        disabled: true,
        children: [{ key: 'yuansze', label: '颜色' }],
      },
      { key: 'shejiguize', label: '设计规则' },
    ],
  },
]
</script>

<style>
.demo-row {
  width: 100%;
  margin-bottom: 8px;
}
.demo-value {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #8a867d;
}
</style>
