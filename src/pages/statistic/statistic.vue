<template>
  <demo-page title="Statistic 统计数值">
    <demo-block title="基础">
      <lh-statistic
        title="年访问量"
        :value="2384712"
      />
    </demo-block>

    <demo-block title="精度与分隔符">
      <view class="statistic-row">
        <lh-statistic
          title="评分"
          :value="4.8471"
          :precision="2"
        />
        <lh-statistic
          title="编号"
          :value="8899001"
          separator=""
        />
      </view>
    </demo-block>

    <demo-block title="前缀与后缀">
      <view class="statistic-row">
        <lh-statistic
          title="成交额"
          :value="128600"
          prefix="¥"
          suffix="元"
        />
        <lh-statistic
          title="增长率"
          :value="12.6"
          :precision="1"
          suffix="%"
        />
      </view>
    </demo-block>

    <demo-block title="超大数与非数值文本">
      <lh-statistic
        title="星辰"
        value="不可计数"
      />
      <lh-statistic
        title="星际距离"
        value="9007199254740993"
      />
    </demo-block>

    <demo-block title="插槽">
      <lh-statistic :value="1024">
        <template #title>
          <text class="demo-text">自定义标题</text>
        </template>
        <template #prefix>
          <text class="demo-text">¥</text>
        </template>
        <template #suffix>
          <text class="demo-text">元</text>
        </template>
      </lh-statistic>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'
</script>

<style>
.statistic-row {
  display: flex;
  gap: 24px;
}
.demo-text {
  font-size: 13px;
  color: #5a5a5a;
}
</style>
