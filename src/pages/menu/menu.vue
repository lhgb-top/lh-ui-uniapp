<template>
  <demo-page title="Menu 导航菜单">
    <demo-block title="基础用法（竖向）">
      <lh-menu v-model="activeBasic">
        <lh-menu-item index="1">首页</lh-menu-item>
        <lh-menu-item index="2">作品</lh-menu-item>
        <lh-menu-item index="3">关于</lh-menu-item>
      </lh-menu>
      <text class="menu-demo-note">当前激活：{{ activeBasic || '（未选择）' }}</text>
    </demo-block>

    <demo-block title="子菜单 + 默认展开">
      <lh-menu
        v-model="activeNested"
        :default-openeds="['2']"
        @select="onSelect"
      >
        <lh-menu-item index="1">首页</lh-menu-item>
        <lh-sub-menu
          index="2"
          title="我的创作"
        >
          <lh-menu-item index="2-1">水墨画</lh-menu-item>
          <lh-menu-item index="2-2">工笔画</lh-menu-item>
          <lh-menu-item index="2-3">书法</lh-menu-item>
        </lh-sub-menu>
        <lh-menu-item index="3">关于</lh-menu-item>
      </lh-menu>
      <text class="menu-demo-note">select 事件：{{ lastSelect || '（未触发）' }}</text>
    </demo-block>

    <demo-block title="手风琴（unique-opened）">
      <lh-menu
        v-model="activeAccordion"
        unique-opened
      >
        <lh-menu-item index="1">首页</lh-menu-item>
        <lh-sub-menu
          index="2"
          title="第一组"
        >
          <lh-menu-item index="2-1">选项 2-1</lh-menu-item>
          <lh-menu-item index="2-2">选项 2-2</lh-menu-item>
        </lh-sub-menu>
        <lh-sub-menu
          index="3"
          title="第二组"
        >
          <lh-menu-item index="3-1">选项 3-1</lh-menu-item>
          <lh-menu-item index="3-2">选项 3-2</lh-menu-item>
        </lh-sub-menu>
      </lh-menu>
      <text class="menu-demo-note">同时最多展开一个子菜单（再次点击收起）。</text>
    </demo-block>

    <demo-block title="嵌套子菜单 + 禁用项">
      <lh-menu
        v-model="activeDeep"
        :default-openeds="['2', '2-1']"
      >
        <lh-menu-item index="1">首页</lh-menu-item>
        <lh-sub-menu
          index="2"
          title="设置"
        >
          <lh-sub-menu
            index="2-1"
            title="外观"
          >
            <lh-menu-item index="2-1-1">主题</lh-menu-item>
            <lh-menu-item index="2-1-2">字体</lh-menu-item>
          </lh-sub-menu>
          <lh-menu-item
            index="2-2"
            disabled
          >隐藏项（禁用）</lh-menu-item>
        </lh-sub-menu>
      </lh-menu>
      <text class="menu-demo-note">禁用项带 aria-disabled，点击不触发 select。</text>
    </demo-block>

    <demo-block title="分组（lh-menu-item-group）">
      <lh-menu v-model="activeGroup">
        <lh-menu-item-group title="基础内容">
          <lh-menu-item index="1">文章</lh-menu-item>
          <lh-menu-item index="2">图片</lh-menu-item>
        </lh-menu-item-group>
        <lh-menu-item-group title="高级功能">
          <lh-menu-item index="3">数据分析</lh-menu-item>
          <lh-menu-item index="4">权限管理</lh-menu-item>
        </lh-menu-item-group>
      </lh-menu>
    </demo-block>

    <demo-block title="横向模式（mode='horizontal'）">
      <lh-menu
        v-model="activeHorizontal"
        mode="horizontal"
      >
        <lh-menu-item index="1">首页</lh-menu-item>
        <lh-sub-menu
          index="2"
          title="作品集"
        >
          <lh-menu-item index="2-1">水墨画</lh-menu-item>
          <lh-menu-item index="2-2">工笔画</lh-menu-item>
        </lh-sub-menu>
        <lh-menu-item index="3">关于</lh-menu-item>
      </lh-menu>
      <text class="menu-demo-note">
        横向模式子菜单从下方飞出（root-portal 承载）；项目过多时容器可横向滚动。
      </text>
    </demo-block>

    <demo-block title="折叠模式（collapse）">
      <lh-menu
        v-model="activeCollapse"
        collapse
        :default-openeds="['1']"
      >
        <lh-sub-menu
          index="1"
          title="收发"
        >
          <lh-menu-item index="1-1">收件箱</lh-menu-item>
          <lh-menu-item index="1-2">已发送</lh-menu-item>
        </lh-sub-menu>
        <lh-menu-item index="2">草稿</lh-menu-item>
      </lh-menu>
      <text class="menu-demo-note">
        折叠模式下子菜单改为右侧飞出面板（标题点击展开，MP 端点击遮罩收起）。
      </text>
    </demo-block>

    <demo-block title="title 插槽">
      <lh-menu v-model="activeSlot">
        <lh-sub-menu index="1">
          <template #title>
            <text class="menu-demo-title">自定义标题</text>
          </template>
          <lh-menu-item index="1-1">插槽子项</lh-menu-item>
        </lh-sub-menu>
      </lh-menu>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const activeBasic = ref('1')
const activeNested = ref('')
const activeAccordion = ref('')
const activeDeep = ref('')
const activeGroup = ref('')
const activeHorizontal = ref('1')
const activeCollapse = ref('')
const activeSlot = ref('')

const lastSelect = ref('')
function onSelect(index: string, indexPath: string[]) {
  lastSelect.value = `${index}（路径：${indexPath.join(' / ')}）`
}
</script>

<style>
.menu-demo-note {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #8a867d;
}
.demo-page--dark .menu-demo-note {
  color: #b5b1a8;
}
.menu-demo-title {
  color: var(--lh-primary-color, #2b4c7c);
  font-weight: 600;
}
</style>
