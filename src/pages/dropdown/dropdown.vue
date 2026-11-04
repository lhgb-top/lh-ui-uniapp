<template>
  <demo-page title="Dropdown 下拉菜单">
    <demo-block title="基础用法">
      <view class="demo-row">
        <lh-dropdown @command="onCommand">
          <lh-button>{{ basicLabel || '更多操作' }} ▾</lh-button>
          <template #dropdown>
            <lh-dropdown-item command="new">新建</lh-dropdown-item>
            <lh-dropdown-item command="edit">编辑</lh-dropdown-item>
            <lh-dropdown-item command="delete">删除</lh-dropdown-item>
          </template>
        </lh-dropdown>
      </view>
      <text class="demo-value">最近指令：{{ lastCommand || '—' }}</text>
    </demo-block>

    <demo-block title="触发方式">
      <!-- hover 仅 H5 有悬停语义；小程序端自动降级为点击切换 -->
      <view class="demo-row">
        <lh-dropdown
          trigger="hover"
          @command="onHoverCommand"
        >
          <lh-button>{{ hoverLabel || '悬停触发' }} ▾</lh-button>
          <template #dropdown>
            <lh-dropdown-item command="ink">水墨</lh-dropdown-item>
            <lh-dropdown-item command="danqing">丹青</lh-dropdown-item>
          </template>
        </lh-dropdown>
      </view>
      <view class="demo-row">
        <!-- contextmenu 由长按（longpress）承载：小程序无右键语义，双端一致 -->
        <lh-dropdown
          trigger="contextmenu"
          @command="onContextCommand"
        >
          <lh-button>{{ contextLabel || '长按触发' }} ▾</lh-button>
          <template #dropdown>
            <lh-dropdown-item command="refresh">刷新</lh-dropdown-item>
            <lh-dropdown-item command="copy">复制</lh-dropdown-item>
          </template>
        </lh-dropdown>
      </view>
      <text class="demo-value">hover 触发仅 H5 生效（小程序端点击展开）；contextmenu 用长按触发</text>
    </demo-block>

    <demo-block title="禁用项与分割线">
      <lh-dropdown @command="onActionCommand">
        <lh-button>{{ actionLabel || '操作' }} ▾</lh-button>
        <template #dropdown>
          <lh-dropdown-item command="export">导出</lh-dropdown-item>
          <lh-dropdown-item command="import">导入</lh-dropdown-item>
          <lh-dropdown-item
            divided
            command="audit"
          >审计日志</lh-dropdown-item>
          <lh-dropdown-item
            disabled
            command="purge"
          >清空数据</lh-dropdown-item>
        </template>
      </lh-dropdown>
    </demo-block>

    <demo-block title="位置与最大高度">
      <lh-dropdown
        placement="bottom-end"
        :max-height="160"
        @command="onItemCommand"
      >
        <lh-button>{{ itemLabel || '底部右对齐' }} ▾</lh-button>
        <template #dropdown>
          <lh-dropdown-item
            v-for="i in 12"
            :key="i"
            :command="i"
          >第 {{ i }} 项</lh-dropdown-item>
        </template>
      </lh-dropdown>
    </demo-block>

    <demo-block title="受控显隐">
      <lh-dropdown
        v-model:visible="menuVisible"
        :hide-on-click="false"
      >
        <lh-button>{{ menuVisible ? '收起' : '展开' }} ▾</lh-button>
        <template #dropdown>
          <lh-dropdown-item command="copy">复制（选中后不收起）</lh-dropdown-item>
          <lh-dropdown-item command="paste">粘贴</lh-dropdown-item>
        </template>
      </lh-dropdown>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const lastCommand = ref('')
// 触发器文本由使用者维护：command 事件只抛出命令值，标签怎么显示交给外部决定
const basicLabelMap: Record<string, string> = { new: '新建', edit: '编辑', delete: '删除' }
const basicLabel = ref('')
function onCommand(command: string | number | undefined) {
  lastCommand.value = String(command)
  basicLabel.value = basicLabelMap[String(command)] ?? String(command)
}

const hoverLabelMap: Record<string, string> = { ink: '水墨', danqing: '丹青' }
const hoverLabel = ref('')
function onHoverCommand(command: string | number | undefined) {
  hoverLabel.value = hoverLabelMap[String(command)] ?? String(command)
}

const contextLabelMap: Record<string, string> = { refresh: '刷新', copy: '复制' }
const contextLabel = ref('')
function onContextCommand(command: string | number | undefined) {
  contextLabel.value = contextLabelMap[String(command)] ?? String(command)
}

const actionLabelMap: Record<string, string> = {
  export: '导出',
  import: '导入',
  audit: '审计日志',
  purge: '清空数据',
}
const actionLabel = ref('')
function onActionCommand(command: string | number | undefined) {
  actionLabel.value = actionLabelMap[String(command)] ?? String(command)
}

const itemLabel = ref('')
function onItemCommand(command: string | number | undefined) {
  itemLabel.value = `第 ${command} 项`
}

const menuVisible = ref(false)
</script>

<style>
.demo-row {
  width: 100%;
}
.demo-value {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #8a867d;
}
</style>
