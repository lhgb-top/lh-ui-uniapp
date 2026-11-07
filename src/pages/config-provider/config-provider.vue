<template>
  <demo-page title="ConfigProvider 全局配置">
    <demo-block title="主题变量定制">
      <lh-config-provider
        :theme-vars="{
          'primary-color': '#8a5a2b',
          'border-radius-base': '12px',
        }"
      >
        <view class="demo-cp-box">
          <lh-button type="primary">定制主色按钮</lh-button>
          <lh-tag type="primary">定制主色标签</lh-tag>
          <text class="demo-cp-note">primary-color 改为棕色、圆角加大</text>
        </view>
      </lh-config-provider>
    </demo-block>

    <demo-block title="暗色模式">
      <lh-config-provider theme="dark">
        <view class="demo-cp-box demo-cp-box--dark">
          <lh-button type="primary">暗色模式按钮</lh-button>
          <lh-tag>暗色模式标签</lh-tag>
          <text class="demo-cp-note">uni-app 端通过 page.dark 类切换（plus 靠 document.documentElement）</text>
        </view>
      </lh-config-provider>
    </demo-block>

    <demo-block title="组件级主题（componentTheme）">
      <lh-config-provider
        :component-theme="{
          button: { 'primary-color': '#4c8b5b' },
        }"
      >
        <view class="demo-cp-box">
          <lh-button type="primary">仅按钮定制主色</lh-button>
          <lh-tag type="primary">标签保持全局主色</lh-tag>
        </view>
      </lh-config-provider>
    </demo-block>

    <demo-block title="全局尺寸">
      <lh-config-provider size="small">
        <view class="demo-cp-box">
          <lh-button size="small">small 尺寸</lh-button>
          <lh-input
            placeholder="small 尺寸输入框"
            style="margin-top: 8px"
          />
        </view>
      </lh-config-provider>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'
</script>

<style>
.demo-cp-box {
  padding: 16px;
  border: 1px solid var(--lh-border-color-lighter, #eee9e2);
  border-radius: 6px;
}

.demo-cp-box--dark {
  background-color: var(--lh-bg-color-dark, #242018);
}

.demo-cp-note {
  display: block;
  margin-top: 8px;
  color: var(--lh-text-secondary, #8a8a8a);
  font-size: 12px;
}
</style>
