<template>
  <demo-page title="Layout 布局容器">
    <demo-block title="上中下布局">
      <lh-layout direction="vertical" :sx="{ h: '240px' }">
        <lh-header>页头</lh-header>
        <lh-main>内容区</lh-main>
        <lh-footer>页脚</lh-footer>
      </lh-layout>
    </demo-block>

    <demo-block title="排列方向 direction">
      <lh-layout direction="horizontal" :sx="{ h: '80px' }">
        <lh-main>水平并排</lh-main>
        <lh-main>水平并排</lh-main>
      </lh-layout>
      <lh-layout direction="vertical" :sx="{ h: '140px', mt: '12px' }">
        <lh-main>垂直堆叠</lh-main>
        <lh-main>垂直堆叠</lh-main>
      </lh-layout>
    </demo-block>

    <demo-block title="带侧栏布局">
      <lh-layout direction="vertical" :sx="{ h: '240px' }">
        <lh-header>页头</lh-header>
        <lh-layout :sx="{ flex: '1', minHeight: '0px' }">
          <lh-aside :width="140" aria-label="侧边导航">侧栏</lh-aside>
          <lh-main>内容区</lh-main>
        </lh-layout>
        <lh-footer>页脚</lh-footer>
      </lh-layout>
    </demo-block>

    <demo-block title="自定义侧栏宽度">
      <lh-layout :sx="{ h: '120px' }">
        <lh-aside width="80px">窄侧栏</lh-aside>
        <lh-main>width 支持 number（按 px）与 string（带单位）</lh-main>
      </lh-layout>
    </demo-block>

    <demo-block title="sx 内联布局属性">
      <lh-layout :sx="{ h: '60px', p: 2 }">
        <lh-main :sx="{ display: 'flex', justifyContent: 'center', alignItems: 'center' }">
          sx 由 share 的 sxToStyle 求值（数值按 8px 间距倍率）
        </lh-main>
      </lh-layout>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'
</script>
