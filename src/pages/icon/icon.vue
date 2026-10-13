<template>
  <demo-page title="Icon 图标">
    <demo-block title="基础用法">
      <lh-icon name="search" />
      <lh-icon name="star" />
      <lh-icon name="check" />
      <lh-icon name="warning" />
      <lh-icon name="error" />
      <lh-icon name="info" />
    </demo-block>

    <demo-block title="尺寸">
      <lh-icon
        name="search"
        :size="16"
      />
      <lh-icon
        name="search"
        :size="24"
      />
      <lh-icon
        name="search"
        :size="32"
      />
      <lh-icon
        name="search"
        size="1.5em"
      />
    </demo-block>

    <demo-block title="颜色">
      <lh-icon
        name="star"
        color="#c8a45c"
      />
      <lh-icon
        name="check"
        color="#5a8f5a"
      />
      <lh-icon
        name="error"
        color="#b3473c"
      />
    </demo-block>

    <demo-block title="加载动画">
      <lh-icon
        name="loading"
        :size="24"
      />
      <lh-icon
        name="loading"
        :size="24"
        color="#c8a45c"
      />
    </demo-block>

    <demo-block title="全量图标（37 个）">
      <view class="icon-grid">
        <view
          v-for="name in iconNames"
          :key="name"
          class="icon-grid__item"
        >
          <lh-icon
            :name="name"
            :size="22"
          />
          <text class="icon-grid__name">{{ name }}</text>
        </view>
      </view>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'
import { LH_ICON_SVGS_CONST } from '@lh-ui/share/core/icon'

const iconNames = Object.keys(LH_ICON_SVGS_CONST)
</script>

<style>
.icon-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.icon-grid__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 72px;
  padding: 8px 4px;
  border: 1px solid #e8e4dc;
  border-radius: 6px;
}
.demo-page--dark .icon-grid__item {
  border-color: #3a3a3a;
}
.icon-grid__name {
  font-size: 10px;
  color: #8a867d;
  text-align: center;
}
</style>
