<template>
  <demo-page title="Empty 空状态">
    <demo-block title="默认插画">
      <lh-empty />
    </demo-block>

    <demo-block title="自定义描述">
      <lh-empty description="墨还未干，内容稍后就来" />
    </demo-block>

    <demo-block title="自定义图片">
      <lh-empty
        image="https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f4d8.png"
        description="一张自定义图片"
      />
    </demo-block>

    <demo-block title="插槽">
      <lh-empty>
        <view class="empty-custom">
          <text class="empty-custom__text">☘</text>
        </view>
      </lh-empty>
      <lh-empty description="描述插槽被覆盖">
        <template #description>
          <text class="demo-text">这是 description 插槽</text>
        </template>
        <template #actions>
          <lh-button
            type="primary"
            size="small"
          >
            刷新
          </lh-button>
        </template>
      </lh-empty>
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
.empty-custom {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 72px;
}
.empty-custom__text {
  font-size: 40px;
}
</style>
