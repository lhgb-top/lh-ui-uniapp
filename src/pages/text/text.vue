<template>
  <demo-page title="Text 排版文本">
    <demo-block title="级别">
      <lh-text level="h1">一级标题 h1</lh-text>
      <lh-text level="h2">二级标题 h2</lh-text>
      <lh-text level="h3">三级标题 h3</lh-text>
      <lh-text level="p">正文段落 p</lh-text>
      <lh-text level="caption">辅助说明 caption</lh-text>
    </demo-block>

    <demo-block title="语义色">
      <lh-text type="secondary">次要文本</lh-text>
      <lh-text type="success">成功</lh-text>
      <lh-text type="warning">警示</lh-text>
      <lh-text type="danger">危险</lh-text>
    </demo-block>

    <demo-block title="修饰">
      <lh-text strong>加粗</lh-text>
      <lh-text italic>斜体</lh-text>
      <lh-text underline>下划线</lh-text>
      <lh-text mark>标记高亮</lh-text>
      <lh-text code>代码风格</lh-text>
      <lh-text disabled>禁用</lh-text>
    </demo-block>

    <demo-block title="省略">
      <lh-text :ellipsis="true">单行省略：水墨组件库致力于在多端提供一致的书写体验</lh-text>
      <lh-text :ellipsis="2">两行省略：水墨组件库致力于在多端提供一致的书写体验，这套设计语言从笔锋、留白与浓淡中取意，覆盖表单、反馈与数据展示全品类。</lh-text>
    </demo-block>

    <demo-block title="复制">
      <lh-text
        copyable
        copy-text="复制这段固定文本"
      >
        固定文本复制（MP 端读不到插槽文本，须传 copy-text）
      </lh-text>
      <lh-text copyable>H5 端可直接复制插槽文本</lh-text>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'
</script>
