<template>
  <demo-page title="Popover 弹出框">
    <demo-block title="基础用法">
      <view class="demo-row">
        <lh-popover
          title="水墨提示"
          placement="top"
        >
          <lh-button>点击弹出</lh-button>
          <template #content>
            <text>这是一段富内容，可以放置任意节点。</text>
          </template>
        </lh-popover>
      </view>
    </demo-block>

    <demo-block title="触发方式">
      <view class="demo-row">
        <!-- hover 仅 H5 有悬停语义；小程序端自动降级为点击切换 -->
        <lh-popover
          trigger="hover"
          title="悬停触发"
        >
          <lh-button>悬停我</lh-button>
          <template #content>
            <text>指针移进弹出层不会触发关闭。</text>
          </template>
        </lh-popover>
      </view>
      <view class="demo-row">
        <!-- #ifdef H5 -->
        <lh-popover
          trigger="focus"
          title="聚焦触发"
        >
          <lh-input placeholder="聚焦输入框" />
          <template #content>
            <text>输入框获得焦点时展示。</text>
          </template>
        </lh-popover>
        <!-- #endif -->
        <!-- #ifndef H5 -->
        <text class="demo-value">小程序端无 focus 语义，请用 click 触发</text>
        <!-- #endif -->
      </view>
      <view class="demo-row">
        <lh-popover
          v-model:visible="manualVisible"
          trigger="manual"
          title="手动控制"
        >
          <lh-button @click="manualVisible = !manualVisible">
            {{ manualVisible ? '收起' : '外部开关' }}
          </lh-button>
          <template #content>
            <text>显隐完全由外部 v-model 控制。</text>
          </template>
        </lh-popover>
      </view>
      <text class="demo-value">hover / focus 仅 H5 生效（小程序端点击展开）</text>
    </demo-block>

    <demo-block title="方位">
      <view class="demo-grid">
        <lh-popover
          v-for="p in placements"
          :key="p"
          :placement="p"
          :title="p"
          trigger="click"
        >
          <lh-button size="small">
            {{ p }}
          </lh-button>
          <template #content>
            <text>方位：{{ p }}</text>
          </template>
        </lh-popover>
      </view>
      <text class="demo-value">视口空间不足时自动翻转方向（flip）并夹回交叉轴（shift）</text>
    </demo-block>

    <demo-block title="富内容（交互节点）">
      <lh-popover
        placement="right"
        title="快速备注"
      >
        <lh-button>添加备注</lh-button>
        <template #content>
          <view class="demo-form">
            <lh-input
              v-model="note"
              placeholder="填写备注内容"
            />
            <lh-button
              type="primary"
              @click="saveNote"
            >
              保存
            </lh-button>
          </view>
        </template>
      </lh-popover>
      <text
        v-if="saved"
        class="demo-value"
      >已保存：{{ saved }}</text>
    </demo-block>

    <demo-block title="更多属性">
      <view class="demo-row">
        <lh-popover
          disabled
          title="已禁用"
        >
          <lh-button disabled>
            禁用触发器
          </lh-button>
          <template #content>
            <text>disabled 时触发器与弹出层均不响应。</text>
          </template>
        </lh-popover>
      </view>
      <view class="demo-row">
        <lh-popover
          title="无箭头"
          :arrow="false"
        >
          <lh-button>无箭头</lh-button>
          <template #content>
            <text>arrow 为 false 时不渲染指向箭头。</text>
          </template>
        </lh-popover>
      </view>
      <view class="demo-row">
        <lh-popover
          title="固定宽度"
          width="240"
        >
          <lh-button>固定宽度</lh-button>
          <template #content>
            <text>通过 width 指定弹出层宽度，这里为 240px。</text>
          </template>
        </lh-popover>
      </view>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

// 12 种方位
const placements = [
  'top',
  'top-start',
  'top-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
  'right',
  'right-start',
  'right-end',
] as const

const manualVisible = ref(false)

const note = ref('')
const saved = ref('')
function saveNote() {
  if (!note.value) return
  saved.value = note.value
  note.value = ''
}
</script>

<style>
.demo-row {
  width: 100%;
}
.demo-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
}
.demo-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
}
.demo-value {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #8a867d;
}
</style>
