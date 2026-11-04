<template>
  <demo-page title="Timeline 时间线">
    <demo-block title="基础用法">
      <lh-timeline>
        <lh-timeline-item timestamp="2026-09-01">
          立项评审
        </lh-timeline-item>
        <lh-timeline-item
          timestamp="2026-09-15"
          type="success"
        >
          一期交付
        </lh-timeline-item>
        <lh-timeline-item
          timestamp="2026-09-25"
          type="warning"
        >
          验收进行中
        </lh-timeline-item>
      </lh-timeline>
    </demo-block>

    <demo-block title="左右交替（mode='alternate'）">
      <lh-timeline mode="alternate">
        <lh-timeline-item timestamp="Q1">
          规划
        </lh-timeline-item>
        <lh-timeline-item timestamp="Q2">
          开发
        </lh-timeline-item>
        <lh-timeline-item
          timestamp="Q3"
          type="danger"
        >
          压测
        </lh-timeline-item>
        <lh-timeline-item
          timestamp="Q4"
          type="success"
        >
          上线
        </lh-timeline-item>
      </lh-timeline>
    </demo-block>

    <demo-block title="空心节点（hollow）">
      <lh-timeline>
        <lh-timeline-item
          timestamp="Q1"
          hollow
        >
          未开始
        </lh-timeline-item>
        <lh-timeline-item timestamp="Q2">
          进行中
        </lh-timeline-item>
        <lh-timeline-item
          timestamp="Q3"
          type="success"
        >
          已完成
        </lh-timeline-item>
      </lh-timeline>
    </demo-block>

    <demo-block title="语义类型（type）">
      <lh-timeline>
        <lh-timeline-item
          timestamp="主流程"
          type="primary"
        >
          primary 主色节点
        </lh-timeline-item>
        <lh-timeline-item
          timestamp="成功"
          type="success"
        >
          success 成功节点
        </lh-timeline-item>
        <lh-timeline-item
          timestamp="警告"
          type="warning"
        >
          warning 警告节点
        </lh-timeline-item>
        <lh-timeline-item
          timestamp="危险"
          type="danger"
        >
          danger 危险节点
        </lh-timeline-item>
      </lh-timeline>
    </demo-block>

    <demo-block title="自定义时间戳与圆点插槽">
      <lh-timeline>
        <lh-timeline-item type="primary">
          <template #timestamp>
            <text class="timeline-demo-stamp">2026 年 9 月</text>
          </template>
          自定义时间戳内容
        </lh-timeline-item>
        <lh-timeline-item type="success">
          <template #dot>
            <lh-icon
              name="check"
              :size="12"
              class="timeline-demo-dot"
            />
          </template>
          自定义圆点（lh-icon 图标）
        </lh-timeline-item>
      </lh-timeline>
    </demo-block>

    <demo-block title="无时间戳的纯内容流">
      <lh-timeline>
        <lh-timeline-item>水墨：焦、浓、重、淡、清。</lh-timeline-item>
        <lh-timeline-item>丹青：丹砂与青雘，指代绘画。</lh-timeline-item>
        <lh-timeline-item>留白：计白当黑，气韵生动。</lh-timeline-item>
      </lh-timeline>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'
</script>

<style>
.timeline-demo-stamp {
  font-weight: 600;
  color: #2b4c7c;
}
.timeline-demo-dot {
  color: #5b8c5a;
}
</style>
