<template>
  <demo-page title="Grid 栅格">
    <demo-block title="基础布局（24 栅格制）">
      <lh-row>
        <lh-col :span="12"><view class="grid-cell">12</view></lh-col>
        <lh-col :span="12"><view class="grid-cell">12</view></lh-col>
      </lh-row>
      <lh-row>
        <lh-col :span="8"><view class="grid-cell">8</view></lh-col>
        <lh-col :span="8"><view class="grid-cell">8</view></lh-col>
        <lh-col :span="8"><view class="grid-cell">8</view></lh-col>
      </lh-row>
    </demo-block>

    <demo-block title="列间距 gutter">
      <lh-row :gutter="16">
        <lh-col :span="8"><view class="grid-cell">8</view></lh-col>
        <lh-col :span="8"><view class="grid-cell">8</view></lh-col>
        <lh-col :span="8"><view class="grid-cell">8</view></lh-col>
      </lh-row>
      <lh-row :gutter="[16, 24]">
        <lh-col :span="12"><view class="grid-cell">12</view></lh-col>
        <lh-col :span="12"><view class="grid-cell">12</view></lh-col>
      </lh-row>
    </demo-block>

    <demo-block title="主轴排列 justify">
      <lh-row justify="center">
        <lh-col :span="6"><view class="grid-cell">6</view></lh-col>
        <lh-col :span="6"><view class="grid-cell">6</view></lh-col>
      </lh-row>
      <lh-row justify="end">
        <lh-col :span="6"><view class="grid-cell">6</view></lh-col>
        <lh-col :span="6"><view class="grid-cell">6</view></lh-col>
      </lh-row>
      <lh-row justify="space-between">
        <lh-col :span="6"><view class="grid-cell">6</view></lh-col>
        <lh-col :span="6"><view class="grid-cell">6</view></lh-col>
      </lh-row>
    </demo-block>

    <demo-block title="交叉轴对齐 align">
      <lh-row align="middle">
        <lh-col :span="8"><view class="grid-cell tall">高</view></lh-col>
        <lh-col :span="8"><view class="grid-cell">中</view></lh-col>
      </lh-row>
      <lh-row align="bottom">
        <lh-col :span="8"><view class="grid-cell tall">高</view></lh-col>
        <lh-col :span="8"><view class="grid-cell">底</view></lh-col>
      </lh-row>
    </demo-block>

    <demo-block title="偏移 offset">
      <lh-row>
        <lh-col :span="6" :offset="6"><view class="grid-cell">6 / offset 6</view></lh-col>
        <lh-col :span="6" :offset="6"><view class="grid-cell">6 / offset 6</view></lh-col>
      </lh-row>
    </demo-block>

    <demo-block title="平移 push / pull">
      <lh-row>
        <lh-col :span="9" :push="6"><view class="grid-cell">9 / push 6</view></lh-col>
        <lh-col :span="9" :pull="6"><view class="grid-cell">9 / pull 6</view></lh-col>
      </lh-row>
    </demo-block>

    <demo-block title="响应式断点（H5 生效，小程序固定降级）">
      <lh-row>
        <lh-col :xs="24" :sm="12" :md="8" :lg="6">
          <view class="grid-cell">xs=24 sm=12 md=8 lg=6</view>
        </lh-col>
        <lh-col :xs="24" :sm="12" :md="8" :lg="6">
          <view class="grid-cell">xs=24 sm=12 md=8 lg=6</view>
        </lh-col>
        <lh-col :xs="24" :sm="24" :md="8" :lg="6">
          <view class="grid-cell">xs=24 sm=24 md=8 lg=6</view>
        </lh-col>
      </lh-row>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'
</script>

<style scoped>
.grid-cell {
  padding: 12px 0;
  margin-bottom: 8px;
  background-color: var(--lh-color-primary, #2f6b5e);
  color: #fff;
  text-align: center;
  border-radius: 4px;
}

.grid-cell.tall {
  height: 64px;
}
</style>
