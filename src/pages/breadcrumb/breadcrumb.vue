<template>
  <demo-page title="Breadcrumb 面包屑">
    <demo-block title="基础用法">
      <lh-breadcrumb separator="/">
        <lh-breadcrumb-item>首页</lh-breadcrumb-item>
        <lh-breadcrumb-item>组件</lh-breadcrumb-item>
        <lh-breadcrumb-item>面包屑</lh-breadcrumb-item>
      </lh-breadcrumb>
    </demo-block>

    <demo-block title="可点击的跳转项">
      <lh-breadcrumb>
        <lh-breadcrumb-item to="/pages/index/index">首页</lh-breadcrumb-item>
        <lh-breadcrumb-item to="/pages/index/index">组件</lh-breadcrumb-item>
        <lh-breadcrumb-item>面包屑（当前页）</lh-breadcrumb-item>
      </lh-breadcrumb>
    </demo-block>

    <demo-block title="自定义分隔符">
      <lh-breadcrumb separator=">">
        <lh-breadcrumb-item>首页</lh-breadcrumb-item>
        <lh-breadcrumb-item>活动</lh-breadcrumb-item>
        <lh-breadcrumb-item>详情</lh-breadcrumb-item>
      </lh-breadcrumb>
    </demo-block>

    <demo-block title="折叠（max-items=3，点击省略号展开）">
      <lh-breadcrumb :max-items="3">
        <lh-breadcrumb-item>首页</lh-breadcrumb-item>
        <lh-breadcrumb-item>活动</lh-breadcrumb-item>
        <lh-breadcrumb-item>列表</lh-breadcrumb-item>
        <lh-breadcrumb-item>详情</lh-breadcrumb-item>
        <lh-breadcrumb-item>评价</lh-breadcrumb-item>
      </lh-breadcrumb>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'
</script>
