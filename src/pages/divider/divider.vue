<template>
  <demo-page title="Divider 分割线">
    <demo-block title="水平">
      <text class="demo-text">上文</text>
      <lh-divider />
      <text class="demo-text">下文</text>
    </demo-block>

    <demo-block title="带文案">
      <lh-divider>水墨</lh-divider>
      <lh-divider
        label-position="left"
      >
        左对齐
      </lh-divider>
      <lh-divider
        label-position="right"
      >
        右对齐
      </lh-divider>
    </demo-block>

    <demo-block title="虚线">
      <lh-divider dashed />
      <lh-divider dashed>
        虚线文案
      </lh-divider>
    </demo-block>

    <demo-block title="垂直">
      <view class="divider-vertical-row">
        <text class="demo-text">水墨</text>
        <lh-divider direction="vertical" />
        <text class="demo-text">留白</text>
        <lh-divider direction="vertical" />
        <text class="demo-text">国风</text>
      </view>
    </demo-block>

    <demo-block title="垂直带文案">
      <view class="divider-vertical-text-row">
        <text class="demo-text">上</text>
        <lh-divider direction="vertical">水墨</lh-divider>
        <text class="demo-text">下</text>
      </view>
      <view class="divider-vertical-text-row">
        <text class="demo-text">上</text>
        <lh-divider
          direction="vertical"
          dashed
        >
          虚线
        </lh-divider>
        <text class="demo-text">下</text>
      </view>
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
.divider-vertical-row {
  display: flex;
  align-items: center;
}
/* 竖向文案的高度由父级行的 align-self: stretch 提供，给固定高度让线段撑开可见 */
.divider-vertical-text-row {
  display: flex;
  align-items: center;
  height: 120px;
}
</style>
