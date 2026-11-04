<template>
  <demo-page title="Spinner 加载圈">
    <demo-block title="基础">
      <view class="spinner-row">
        <lh-spinner />
        <lh-spinner size="mini" />
        <lh-spinner size="small" />
        <lh-spinner size="medium" />
        <lh-spinner size="large" />
        <lh-spinner size="x-large" />
      </view>
    </demo-block>

    <demo-block title="自定义颜色">
      <view class="spinner-row">
        <lh-spinner color="#C4A35A" />
        <lh-spinner color="#5B8C5A" />
        <lh-spinner color="#B5462F" />
      </view>
    </demo-block>

    <demo-block title="继承文本色">
      <view class="spinner-inherit">
        <text class="spinner-inherit__text">加载中…</text>
        <lh-spinner size="small" />
      </view>
    </demo-block>

    <demo-block title="与按钮混排">
      <view class="spinner-row">
        <lh-button
          type="primary"
          loading
        >
          提交中
        </lh-button>
        <lh-spinner
          size="small"
          color="#2B4C7C"
        />
      </view>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'
</script>

<style>
.spinner-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.spinner-inherit {
  display: flex;
  align-items: center;
  gap: 8px;
}
.spinner-inherit__text {
  font-size: 14px;
  color: #5a5a5a;
}
</style>
