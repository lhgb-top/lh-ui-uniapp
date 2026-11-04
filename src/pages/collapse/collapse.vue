<template>
  <demo-page title="Collapse 折叠面板">
    <demo-block title="基础用法">
      <lh-collapse>
        <lh-collapse-item
          name="a"
          title="一致性和多样性"
        >
          <text class="collapse-demo-text">与页面整体保持一致的视觉与交互。</text>
        </lh-collapse-item>
        <lh-collapse-item
          name="b"
          title="反馈"
        >
          <text class="collapse-demo-text">操作后给予清晰及时的状态反馈。</text>
        </lh-collapse-item>
        <lh-collapse-item
          name="c"
          title="效率"
        >
          <text class="collapse-demo-text">简化操作流程，让用户直达目标。</text>
        </lh-collapse-item>
      </lh-collapse>
    </demo-block>

    <demo-block title="手风琴（accordion）">
      <lh-collapse
        v-model="activeAccordion"
        accordion
      >
        <lh-collapse-item
          name="a"
          title="只开一个"
        >
          <text class="collapse-demo-text">同时最多展开一项。</text>
        </lh-collapse-item>
        <lh-collapse-item
          name="b"
          title="再次点击收起"
        >
          <text class="collapse-demo-text">允许全部收起（accordion 下 change 抛单值）。</text>
        </lh-collapse-item>
        <lh-collapse-item
          name="c"
          title="第三项"
        >
          <text class="collapse-demo-text">展开此项时会自动收起其他项。</text>
        </lh-collapse-item>
      </lh-collapse>
    </demo-block>

    <demo-block title="受控 v-model + 禁用项">
      <lh-collapse v-model="activeNames">
        <lh-collapse-item
          name="a"
          title="面板 A"
        >
          <text class="collapse-demo-text">受控内容 A。</text>
        </lh-collapse-item>
        <lh-collapse-item
          name="b"
          title="面板 B（禁用）"
          disabled
        >
          <text class="collapse-demo-text">禁用内容：点击无反应。</text>
        </lh-collapse-item>
        <lh-collapse-item
          name="c"
          title="面板 C"
        >
          <text class="collapse-demo-text">受控内容 C。</text>
        </lh-collapse-item>
      </lh-collapse>
    </demo-block>

    <demo-block title="title 插槽">
      <lh-collapse v-model="activeSlot">
        <lh-collapse-item name="a">
          <template #title>
            <text class="collapse-demo-title">自定义标题</text>
          </template>
          <text class="collapse-demo-text">标题由 title 插槽渲染。</text>
        </lh-collapse-item>
      </lh-collapse>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

// 基础用法为非受控：不传 v-model，组件自管展开态（change 事件回调里拿最新值）
const activeNames = ref(['a'])
const activeSlot = ref(['a'])
// 手风琴模式下 v-model 常传单值（数组也兼容）
const activeAccordion = ref('a')
</script>

<style>
.collapse-demo-text {
  display: block;
  padding: 4px 0;
  font-size: 14px;
  color: #5a5a5a;
}
.collapse-demo-title {
  font-weight: 600;
  color: #2b4c7c;
}
</style>
