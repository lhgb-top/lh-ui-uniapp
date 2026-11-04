<template>
  <demo-page title="Alert 警告">
    <demo-block title="基础用法">
      <lh-alert
        title="信息提示"
        :sx="{ w: '100%' }"
      >
        当前操作已保存，可随时继续编辑。
      </lh-alert>
    </demo-block>

    <demo-block title="语义类型">
      <lh-alert
        type="success"
        title="成功"
        :sx="{ w: '100%' }"
      >
        数据已同步完成。
      </lh-alert>
      <lh-alert
        type="warning"
        title="警告"
        :sx="{ w: '100%' }"
      >
        余额不足，请尽快充值。
      </lh-alert>
      <lh-alert
        type="danger"
        title="错误"
        :sx="{ w: '100%' }"
      >
        提交失败，请检查网络后重试。
      </lh-alert>
      <lh-alert
        type="info"
        title="信息"
        :sx="{ w: '100%' }"
      >
        新版本将于下周发布。
      </lh-alert>
    </demo-block>

    <demo-block title="语义图标（show-icon）">
      <lh-alert
        show-icon
        title="带图标的成功提示"
        :sx="{ w: '100%' }"
      >
        图标颜色跟随语义类型自动着色。
      </lh-alert>
    </demo-block>

    <demo-block title="可关闭（closable）">
      <lh-alert
        closable
        title="可关闭的警告"
        :sx="{ w: '100%' }"
      >
        点击右侧叉号后组件隐藏，并触发 close 事件。
      </lh-alert>
    </demo-block>

    <demo-block title="朴素样式（plain）">
      <lh-alert
        plain
        title="朴素样式"
        :sx="{ w: '100%' }"
      >
        白底 + 语义色描边，适合紧凑列表。
      </lh-alert>
    </demo-block>

    <demo-block title="仅描述（无标题）">
      <lh-alert :sx="{ w: '100%' }">
        没有标题时只渲染描述内容。
      </lh-alert>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'
</script>
