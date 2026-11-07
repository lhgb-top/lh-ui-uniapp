<template>
  <demo-page title="Affix 固定">
    <demo-block title="容器内吸顶（双端通用写法）">
      <text class="demo-tip">MP：scroll-view 的 detail.scrollTop 经 scrollTop prop 注入。H5：原生可滚动容器 + target 选择器自动监听（两端同一 props 契约）。</text>
      <!-- #ifdef H5 -->
      <view
        id="affixScroll"
        class="demo-affix-scroll"
      >
        <lh-affix
          target="#affixScroll"
          :scroll-top="scrollTop"
          :offset-top="16"
          @change="onAffixChange"
        >
          <view class="demo-affix-bar">吸顶栏（offset-top 16）</view>
        </lh-affix>
        <view
          v-for="i in 30"
          :key="i"
          class="demo-affix-line"
        >占位行 {{ i }}</view>
      </view>
      <!-- #endif -->
      <!-- #ifndef H5 -->
      <scroll-view
        id="affixScroll"
        class="demo-affix-scroll"
        :scroll-y="true"
        :scroll-top="scrollTop"
        :scroll-with-animation="true"
        @scroll="onScroll"
      >
        <lh-affix
          target="#affixScroll"
          :scroll-top="scrollTop"
          :offset-top="16"
          @change="onAffixChange"
        >
          <view class="demo-affix-bar">吸顶栏（offset-top 16）</view>
        </lh-affix>
        <view
          v-for="i in 30"
          :key="i"
          class="demo-affix-line"
        >占位行 {{ i }}</view>
      </scroll-view>
      <!-- #endif -->
      <text class="demo-value">固定态：{{ fixed ? '已固定' : '未固定' }}</text>
    </demo-block>

    <demo-block title="吸底模式">
      <!-- #ifdef H5 -->
      <view
        id="affixBottomScroll"
        class="demo-affix-scroll"
      >
        <lh-affix
          target="#affixBottomScroll"
          :scroll-top="scrollTop2"
          :offset-bottom="24"
        >
          <view class="demo-affix-bar demo-affix-bar--bottom">吸底栏（offset-bottom 24）</view>
        </lh-affix>
        <view
          v-for="i in 30"
          :key="i"
          class="demo-affix-line"
        >占位行 {{ i }}</view>
      </view>
      <!-- #endif -->
      <!-- #ifndef H5 -->
      <scroll-view
        id="affixBottomScroll"
        class="demo-affix-scroll"
        :scroll-y="true"
        :scroll-top="scrollTop2"
        @scroll="onScroll2"
      >
        <lh-affix
          target="#affixBottomScroll"
          :scroll-top="scrollTop2"
          :offset-bottom="24"
        >
          <view class="demo-affix-bar demo-affix-bar--bottom">吸底栏（offset-bottom 24）</view>
        </lh-affix>
        <view
          v-for="i in 30"
          :key="i"
          class="demo-affix-line"
        >占位行 {{ i }}</view>
      </scroll-view>
      <!-- #endif -->
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'

const scrollTop = ref(0)
const scrollTop2 = ref(0)
const fixed = ref(false)

/** 滚动位置：H5 取事件 target.scrollTop，MP 取事件 detail.scrollTop（scroll-view 契约） */
function resolveScrollTop(event: Event): number {
  const detail = (event as unknown as { detail?: { scrollTop?: number } }).detail
  if (typeof detail?.scrollTop === 'number') return detail.scrollTop
  const target = event.target as HTMLElement | null
  return target?.scrollTop ?? 0
}

function onScroll(event: Event): void {
  scrollTop.value = resolveScrollTop(event)
}

function onScroll2(event: Event): void {
  scrollTop2.value = resolveScrollTop(event)
}

function onAffixChange(value: boolean): void {
  fixed.value = value
}
</script>

<style>
.demo-affix-scroll {
  height: 300px;
  overflow-y: auto;
  border: 1px solid var(--lh-border-color-lighter, #eee9e2);
  border-radius: 6px;
  padding: 12px;
}

.demo-affix-bar {
  padding: 8px 16px;
  border-radius: 6px;
  background-color: var(--lh-primary-color, #2b4c7c);
  color: var(--lh-color-on-primary, #fff);
  font-size: 14px;
  text-align: center;
}

.demo-affix-bar--bottom {
  background-color: var(--lh-success-color, #4c8b5b);
}

.demo-affix-line {
  padding: 8px 4px;
  color: var(--lh-text-secondary, #8a8a8a);
  font-size: 13px;
}

.demo-tip {
  display: block;
  margin-bottom: 8px;
  color: var(--lh-text-secondary, #8a8a8a);
  font-size: 12px;
}
</style>
