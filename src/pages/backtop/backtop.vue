<template>
  <demo-page title="BackTop 返回顶部">
    <demo-block title="容器内返回顶部（双端通用写法）">
      <text class="demo-tip">MP：scroll-view 的 detail.scrollTop 经 scrollTop prop 注入；H5：原生可滚动容器 + target 选择器自动监听。点击回顶经 update:scrollTop 重置。</text>
      <!-- #ifdef H5 -->
      <view
        id="backtopScroll"
        class="demo-backtop-scroll"
        @scroll="onScroll"
      >
        <view
          v-for="i in 60"
          :key="i"
          class="demo-backtop-line"
        >占位行 {{ i }}，滚动超过 200px 后右下角出现回顶按钮</view>
        <lh-backtop
          target="#backtopScroll"
          :scroll-top="scrollTop"
          right="16"
          bottom="16"
          @update:scroll-top="onBackTop"
          @click="onClick"
          @scrollend="onScrollEnd"
        />
      </view>
      <!-- #endif -->
      <!-- #ifndef H5 -->
      <scroll-view
        class="demo-backtop-scroll"
        :scroll-y="true"
        :scroll-top="scrollTop"
        :scroll-with-animation="true"
        @scroll="onScroll"
      >
        <view
          v-for="i in 60"
          :key="i"
          class="demo-backtop-line"
        >占位行 {{ i }}，滚动超过 200px 后右下角出现回顶按钮</view>
        <lh-backtop
          :scroll-top="scrollTop"
          right="16"
          bottom="16"
          @update:scroll-top="onBackTop"
          @click="onClick"
          @scrollend="onScrollEnd"
        />
      </scroll-view>
      <!-- #endif -->
      <text class="demo-value">滚动停止时距顶：{{ lastScrollTop }} px</text>
    </demo-block>

    <demo-block title="自定义阈值与平滑关闭">
      <!-- #ifdef H5 -->
      <view
        id="backtopScroll2"
        class="demo-backtop-scroll"
        @scroll="onScroll2"
      >
        <view
          v-for="i in 60"
          :key="i"
          class="demo-backtop-line"
        >占位行 {{ i }}，阈值 400，关闭平滑滚动</view>
        <lh-backtop
          target="#backtopScroll2"
          :scroll-top="scrollTop2"
          :visibility-height="400"
          :smooth="false"
          right="16"
          bottom="16"
          @update:scroll-top="scrollTop2 = $event"
        />
      </view>
      <!-- #endif -->
      <!-- #ifndef H5 -->
      <scroll-view
        class="demo-backtop-scroll"
        :scroll-y="true"
        :scroll-top="scrollTop2"
        @scroll="onScroll2"
      >
        <view
          v-for="i in 60"
          :key="i"
          class="demo-backtop-line"
        >占位行 {{ i }}，阈值 400，关闭平滑滚动</view>
        <lh-backtop
          :scroll-top="scrollTop2"
          :visibility-height="400"
          :smooth="false"
          right="16"
          bottom="16"
          @update:scroll-top="scrollTop2 = $event"
        />
      </scroll-view>
      <!-- #endif -->
    </demo-block>

    <demo-block title="自定义内容">
      <!-- #ifdef H5 -->
      <view
        id="backtopScroll3"
        class="demo-backtop-scroll"
        @scroll="onScroll3"
      >
        <view
          v-for="i in 60"
          :key="i"
          class="demo-backtop-line"
        >占位行 {{ i }}</view>
        <lh-backtop
          target="#backtopScroll3"
          :scroll-top="scrollTop3"
          right="16"
          bottom="16"
          @update:scroll-top="scrollTop3 = $event"
        >
          <view class="demo-backtop-custom">顶部</view>
        </lh-backtop>
      </view>
      <!-- #endif -->
      <!-- #ifndef H5 -->
      <scroll-view
        class="demo-backtop-scroll"
        :scroll-y="true"
        :scroll-top="scrollTop3"
        @scroll="onScroll3"
      >
        <view
          v-for="i in 60"
          :key="i"
          class="demo-backtop-line"
        >占位行 {{ i }}</view>
        <lh-backtop
          :scroll-top="scrollTop3"
          right="16"
          bottom="16"
          @update:scroll-top="scrollTop3 = $event"
        >
          <view class="demo-backtop-custom">顶部</view>
        </lh-backtop>
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
const scrollTop3 = ref(0)
const lastScrollTop = ref(0)

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

function onScroll3(event: Event): void {
  scrollTop3.value = resolveScrollTop(event)
}

function onBackTop(value: number): void {
  scrollTop.value = value
}

function onClick(): void {
  // 点击事件与滚动命令相互独立，可在此埋点
}

function onScrollEnd(value: number): void {
  lastScrollTop.value = value
}
</script>

<style>
.demo-backtop-scroll {
  position: relative;
  height: 320px;
  overflow-y: auto;
  border: 1px solid var(--lh-border-color-lighter, #eee9e2);
  border-radius: 6px;
  padding: 12px;
}

.demo-backtop-line {
  padding: 8px 4px;
  color: var(--lh-text-secondary, #8a8a8a);
  font-size: 13px;
}

.demo-backtop-custom {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--lh-primary-color, #2b4c7c);
  color: var(--lh-color-on-primary, #fff);
  font-size: 12px;
}

.demo-tip {
  display: block;
  margin-bottom: 8px;
  color: var(--lh-text-secondary, #8a8a8a);
  font-size: 12px;
}
</style>
