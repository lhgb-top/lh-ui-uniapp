<template>
  <demo-page title="Anchor 锚点导航">
    <demo-block title="基础用法（双端通用写法）">
      <text class="demo-tip">MP：scroll-view 的 detail.scrollTop 经 scrollTop prop 注入，点击锚点经 update:scrollIntoView 驱动 scroll-into-view。H5：原生可滚动容器 + target 自动监听 + scrollIntoView。</text>
      <view class="demo-anchor-wrap">
        <!-- #ifdef H5 -->
        <view
          id="anchorScroll"
          class="demo-anchor-scroll"
        >
          <view
            v-for="section in sections"
            :id="section.id"
            :key="section.id"
            class="demo-anchor-section"
          >
            <text class="demo-anchor-section-title">{{ section.title }}</text>
            <text
              v-for="i in 8"
              :key="i"
              class="demo-anchor-line"
            >{{ section.title }} 内容 {{ i }}</text>
          </view>
        </view>
        <!-- #endif -->
        <!-- #ifndef H5 -->
        <scroll-view
          id="anchorScroll"
          class="demo-anchor-scroll"
          :scroll-y="true"
          :scroll-into-view="scrollIntoView"
          :scroll-with-animation="true"
          @scroll="onScroll"
        >
          <view
            v-for="section in sections"
            :id="section.id"
            :key="section.id"
            class="demo-anchor-section"
          >
            <text class="demo-anchor-section-title">{{ section.title }}</text>
            <text
              v-for="i in 8"
              :key="i"
              class="demo-anchor-line"
            >{{ section.title }} 内容 {{ i }}</text>
          </view>
        </scroll-view>
        <!-- #endif -->
        <lh-anchor
          class="demo-anchor-nav"
          :items="anchorItems"
          target="#anchorScroll"
          :scroll-top="scrollTop"
          @update:scroll-into-view="scrollIntoView = $event"
        />
      </view>
    </demo-block>

    <demo-block title="横向排列">
      <view class="demo-anchor-wrap">
        <!-- #ifdef H5 -->
        <view
          id="anchorScroll2"
          class="demo-anchor-scroll"
        >
          <view
            v-for="section in sections"
            :id="`h-${section.id}`"
            :key="section.id"
            class="demo-anchor-section"
          >
            <text class="demo-anchor-section-title">{{ section.title }}</text>
            <text
              v-for="i in 8"
              :key="i"
              class="demo-anchor-line"
            >{{ section.title }} 内容 {{ i }}</text>
          </view>
        </view>
        <!-- #endif -->
        <!-- #ifndef H5 -->
        <scroll-view
          id="anchorScroll2"
          class="demo-anchor-scroll"
          :scroll-y="true"
          :scroll-into-view="scrollIntoView2"
          @scroll="onScroll2"
        >
          <view
            v-for="section in sections"
            :id="`h-${section.id}`"
            :key="section.id"
            class="demo-anchor-section"
          >
            <text class="demo-anchor-section-title">{{ section.title }}</text>
            <text
              v-for="i in 8"
              :key="i"
              class="demo-anchor-line"
            >{{ section.title }} 内容 {{ i }}</text>
          </view>
        </scroll-view>
        <!-- #endif -->
        <lh-anchor
          class="demo-anchor-nav"
          direction="horizontal"
          :items="horizontalItems"
          target="#anchorScroll2"
          :scroll-top="scrollTop2"
          @update:scroll-into-view="scrollIntoView2 = $event"
        />
      </view>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'
import type { LhAnchorItem } from '@/components/lh-anchor/types'

const sections = [
  { id: 'section-a', title: '区块 A' },
  { id: 'section-b', title: '区块 B' },
  { id: 'section-c', title: '区块 C' },
  { id: 'section-d', title: '区块 D' },
]

const anchorItems: LhAnchorItem[] = [
  { id: 'section-a', title: '区块 A' },
  {
    id: 'group-b',
    title: 'B / C',
    children: [
      { id: 'section-b', title: '区块 B' },
      { id: 'section-c', title: '区块 C' },
    ],
  },
  { id: 'section-d', title: '区块 D' },
]

const horizontalItems: LhAnchorItem[] = sections.map((s) => ({ id: `h-${s.id}`, title: s.title }))

const scrollTop = ref(0)
const scrollTop2 = ref(0)
const scrollIntoView = ref('')
const scrollIntoView2 = ref('')

function onScroll(event: { detail?: { scrollTop?: number } }): void {
  scrollTop.value = event.detail?.scrollTop ?? 0
}

function onScroll2(event: { detail?: { scrollTop?: number } }): void {
  scrollTop2.value = event.detail?.scrollTop ?? 0
}
</script>

<style>
.demo-anchor-wrap {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.demo-anchor-scroll {
  flex: 1;
  height: 320px;
  overflow-y: auto;
  border: 1px solid var(--lh-border-color-lighter, #eee9e2);
  border-radius: 6px;
  padding: 12px;
}

.demo-anchor-nav {
  flex: 0 0 140px;
}

.demo-anchor-section {
  margin-bottom: 16px;
}

.demo-anchor-section-title {
  display: block;
  margin-bottom: 8px;
  color: var(--lh-text-primary, #2c2c2c);
  font-size: 14px;
  font-weight: 600;
}

.demo-anchor-line {
  display: block;
  padding: 6px 0;
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
