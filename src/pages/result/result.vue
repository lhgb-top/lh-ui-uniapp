<template>
  <demo-page title="Result 结果页">
    <demo-block title="四态">
      <lh-result
        status="success"
        title="提交成功"
        sub-title="墨迹已干，工单进入下一环节"
      />
      <lh-result
        status="warning"
        title="暂存提醒"
        sub-title="草稿将在 7 天后清理"
      />
      <lh-result
        status="error"
        title="提交失败"
        sub-title="网络波动，请重试"
      />
      <lh-result
        status="info"
        title="等待审核"
        sub-title="管理员会在 1 个工作日内处理"
      />
    </demo-block>

    <demo-block title="自定义图标与尺寸">
      <lh-result
        icon="like"
        :icon-size="48"
        title="点赞收藏"
      />
    </demo-block>

    <demo-block title="插槽">
      <lh-result status="success">
        <template #title>
          <text class="demo-text">自定义标题</text>
        </template>
        <template #subTitle>
          <text class="demo-text">自定义副标题插槽</text>
        </template>
        <template #extra>
          <lh-button
            type="primary"
            size="small"
          >
            返回首页
          </lh-button>
        </template>
      </lh-result>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'
</script>

<style>
.demo-text {
  font-size: 14px;
  color: #5a5a5a;
}
</style>
