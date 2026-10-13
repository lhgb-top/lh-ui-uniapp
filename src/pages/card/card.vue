<template>
  <demo-page title="Card 卡片">
    <demo-block title="基础">
      <lh-card>
        <template #header>
          <text class="card-title">水墨</text>
        </template>
        留白是中国传统艺术的重要表现手法，以虚空显实景。
        <template #footer>
          <text class="card-extra">2026 年秋</text>
        </template>
      </lh-card>
    </demo-block>

    <demo-block title="title prop + extra 插槽">
      <lh-card title="标题 prop">
        <template #extra>
          <text class="card-extra">更多</text>
        </template>
        内容区：气韵生动，骨法用笔。
      </lh-card>
    </demo-block>

    <demo-block title="封面">
      <lh-card title="带封面的卡片">
        <template #cover>
          <!-- MP 端 cover 的「子元素宽度 100%」规则被 WXSS 通配限制丢弃，
               封面图需自设宽度（偏离已登记） -->
          <image
            class="card-cover-img"
            src="https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f4d8.png"
            mode="aspectFill"
          />
        </template>
        封面在内容之上，圆角随卡片裁切。
      </lh-card>
    </demo-block>

    <demo-block title="阴影时机">
      <lh-card
        v-for="shadow in shadows"
        :key="shadow"
        :shadow="shadow"
        :title="`shadow = ${shadow}`"
      >
        always 常驻 / hover 悬停 / never 从不。
      </lh-card>
    </demo-block>

    <demo-block title="可点击">
      <lh-card
        clickable
        title="点我"
        @click="onClick"
      >
        点击/回车触发 click 事件（H5 支持键盘激活）。
      </lh-card>
    </demo-block>

    <demo-block title="加载态">
      <lh-card
        loading
        title="加载中"
      >
        内容不可见
      </lh-card>
    </demo-block>

    <demo-block title="主题变量">
      <lh-card
        title="局部主题"
        :theme-vars="{ 'card-bg': '#2B4C7C', 'card-border-color': '#1D3661' }"
      >
        themeVars 直接覆盖组件变量（键自动加 --lh- 前缀）。
      </lh-card>
    </demo-block>
  </demo-page>
</template>

<script lang="ts" setup>
import DemoPage from '../../shared/demo-page.vue'
import DemoBlock from '../../shared/demo-block.vue'
import type { LhCardShadow } from '../../components/lh-card/types'

const shadows: LhCardShadow[] = ['always', 'hover', 'never']

function onClick() {
  uni.showToast({ title: '卡片被点击', icon: 'none' })
}
</script>

<style>
.card-title {
  font-size: 16px;
  font-weight: 600;
}
.card-extra {
  font-size: 12px;
  color: #8a8a8a;
}
.card-cover-img {
  width: 100%;
  height: 120px;
}
</style>
